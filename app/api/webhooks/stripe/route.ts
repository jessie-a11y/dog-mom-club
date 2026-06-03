import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { getDb } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// ---------------------------------------------------------------------------
// Klaviyo helper
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
// Order notification email
// ---------------------------------------------------------------------------
async function sendOrderNotificationEmail(params: {
  customerEmail: string
  customerName: string | null
  items: { name: string; quantity: number; price: string }[]
  total: string
  personalizationNotes: string | null
  shippingAddress: {
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postal_code: string | null
    country: string | null
  } | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (!apiKey || !notifyEmail) {
    console.warn('[resend] RESEND_API_KEY or ADMIN_NOTIFY_EMAIL not set — skipping notification')
    return
  }

  const resend = new Resend(apiKey)

  const itemsHtml = params.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">$${i.price}</td>
        </tr>`
    )
    .join('')

  const addressHtml = params.shippingAddress
    ? `<p style="margin:4px 0">${params.shippingAddress.line1 ?? ''}${params.shippingAddress.line2 ? `, ${params.shippingAddress.line2}` : ''}</p>
       <p style="margin:4px 0">${params.shippingAddress.city ?? ''}, ${params.shippingAddress.state ?? ''} ${params.shippingAddress.postal_code ?? ''}</p>`
    : '<p style="margin:4px 0">No address provided</p>'

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#b45309">🐾 New Dog Mom Club Order!</h2>
      <p><strong>Customer:</strong> ${params.customerName ?? 'Unknown'} (${params.customerEmail})</p>

      <h3 style="margin-top:24px">Items</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#fef3c7">
            <th style="padding:8px 12px;text-align:left">Item</th>
            <th style="padding:8px 12px;text-align:center">Qty</th>
            <th style="padding:8px 12px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px 12px;text-align:right;font-weight:bold">Total</td>
            <td style="padding:8px 12px;text-align:right;font-weight:bold">$${params.total}</td>
          </tr>
        </tfoot>
      </table>

      ${
        params.personalizationNotes
          ? `<h3 style="margin-top:24px">Personalization Notes</h3>
             <p style="background:#fef3c7;padding:12px;border-radius:6px">${params.personalizationNotes}</p>`
          : ''
      }

      <h3 style="margin-top:24px">Ship To</h3>
      ${addressHtml}

      <p style="margin-top:32px;color:#999;font-size:12px">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin">View in admin panel</a>
      </p>
    </div>
  `

  const { error } = await resend.emails.send({
    from: 'Dog Mom Club <orders@dogmomclub.com>',
    to: notifyEmail,
    subject: `New order from ${params.customerName ?? params.customerEmail}`,
    html,
  })

  if (error) {
    console.error('[resend] failed to send order notification:', error)
  } else {
    console.log('[resend] order notification sent to', notifyEmail)
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

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_details?.email
      if (!email) break

      if (session.mode === 'payment') {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 20,
        })

        const items = lineItems.data.map((item) => ({
          name: item.description ?? 'Unknown product',
          quantity: item.quantity ?? 1,
          price: ((item.amount_total ?? 0) / 100).toFixed(2),
        }))

        const personalizationNotes = session.metadata?.personalization_notes ?? null
        const customerName = session.customer_details?.name ?? null
        const total = ((session.amount_total ?? 0) / 100).toFixed(2)

        const addr = session.shipping_details?.address ?? null
        const shippingAddress = addr
          ? {
              line1: addr.line1 ?? null,
              line2: addr.line2 ?? null,
              city: addr.city ?? null,
              state: addr.state ?? null,
              postal_code: addr.postal_code ?? null,
              country: addr.country ?? null,
            }
          : null

        // Save to Neon
        try {
          const sql = getDb()
          await sql`
            INSERT INTO orders
              (stripe_session_id, customer_email, customer_name, items, personalization_notes, total, shipping_address)
            VALUES
              (${session.id}, ${email}, ${customerName}, ${JSON.stringify(items)}, ${personalizationNotes}, ${total}, ${JSON.stringify(shippingAddress)})
            ON CONFLICT (stripe_session_id) DO NOTHING
          `
          console.log('[db] order saved:', session.id)
        } catch (err) {
          console.error('[db] failed to save order:', err)
        }

        // Send notification email
        await sendOrderNotificationEmail({
          customerEmail: email,
          customerName,
          items,
          total,
          personalizationNotes,
          shippingAddress,
        })

        // Klaviyo
        await trackKlaviyoEvent(email, 'Placed Order', {
          order_id: session.id,
          total,
          currency: session.currency?.toUpperCase() ?? 'USD',
          items,
          personalization_notes: personalizationNotes,
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

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const email = invoice.customer_email
      if (!email) break

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

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

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
