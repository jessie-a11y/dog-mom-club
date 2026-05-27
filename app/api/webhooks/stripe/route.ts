import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// ---------------------------------------------------------------------------
// Klaviyo helper — sends a named event to a profile identified by email
// ---------------------------------------------------------------------------
async function trackKlaviyoEvent(
  email: string,
  eventName: string,
  properties: Record<string, unknown>
) {
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY
  if (!privateKey) {
    console.warn('[klaviyo] KLAVIYO_PRIVATE_KEY not set — skipping event:', eventName)
    return
  }

  const res = await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${privateKey}`,
      'Content-Type': 'application/json',
      'revision': '2024-10-15',
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: { email },
            },
          },
          metric: {
            data: {
              type: 'metric',
              attributes: { name: eventName },
            },
          },
          properties,
          time: new Date().toISOString(),
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[klaviyo] failed to track "${eventName}":`, res.status, body)
  } else {
    console.log(`[klaviyo] tracked "${eventName}" for ${email}`)
  }
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {

    // -----------------------------------------------------------------------
    // One-time purchase OR new subscription checkout completed
    // -----------------------------------------------------------------------
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_details?.email
      if (!email) break

      if (session.mode === 'payment') {
        // Fetch line items so we can pass product names + quantities to Klaviyo
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 20,
        })

        const items = lineItems.data.map((item) => ({
          name: item.description ?? 'Unknown product',
          quantity: item.quantity ?? 1,
          price: ((item.amount_total ?? 0) / 100).toFixed(2),
        }))

        await trackKlaviyoEvent(email, 'Placed Order', {
          order_id: session.id,
          total: ((session.amount_total ?? 0) / 100).toFixed(2),
          currency: session.currency?.toUpperCase() ?? 'USD',
          items,
          personalization_notes: session.metadata?.personalization_notes ?? null,
        })
      }

      if (session.mode === 'subscription') {
        await trackKlaviyoEvent(email, 'Started Subscription', {
          subscription_id: session.subscription,
          customer_id: session.customer,
          total: ((session.amount_total ?? 0) / 100).toFixed(2),
        })
      }

      break
    }

    // -----------------------------------------------------------------------
    // Subscription renewal (skip the first payment — covered by checkout above)
    // -----------------------------------------------------------------------
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const email = invoice.customer_email
      if (!email) break

      // billing_reason === 'subscription_create' = first payment, already tracked above
      if (invoice.billing_reason === 'subscription_create') break

      await trackKlaviyoEvent(email, 'Subscription Renewed', {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription,
        amount_paid: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        period_start: new Date((invoice.period_start ?? 0) * 1000).toISOString(),
        period_end: new Date((invoice.period_end ?? 0) * 1000).toISOString(),
      })

      break
    }

    // -----------------------------------------------------------------------
    // Subscription cancelled
    // -----------------------------------------------------------------------
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Look up customer email from Stripe since it's not on the subscription object
      let email: string | null = null
      if (subscription.customer) {
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (!customer.deleted) {
          email = customer.email
        }
      }

      if (!email) break

      await trackKlaviyoEvent(email, 'Cancelled Subscription', {
        subscription_id: subscription.id,
        cancelled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : new Date().toISOString(),
      })

      break
    }

    default:
      console.log(`[webhook] unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
