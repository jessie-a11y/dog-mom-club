import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

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
      console.log('[webhook] checkout.session.completed', {
        sessionId: session.id,
        mode: session.mode,
        customerId: session.customer,
        amountTotal: session.amount_total,
        customerEmail: session.customer_details?.email,
      })
      // TODO: Fulfill order — save to database, send confirmation email, etc.
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('[webhook] invoice.payment_succeeded', {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
        amountPaid: invoice.amount_paid,
        customerEmail: invoice.customer_email,
      })
      // TODO: Send monthly box confirmation email, update subscriber record, etc.
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('[webhook] customer.subscription.deleted', {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        canceledAt: subscription.canceled_at,
      })
      // TODO: Update user record to mark subscription as inactive, send farewell email, etc.
      break
    }

    default:
      console.log(`[webhook] unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
