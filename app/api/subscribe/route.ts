import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(_req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

    if (!priceId) {
      console.error('[subscribe] STRIPE_SUBSCRIPTION_PRICE_ID is not set')
      return NextResponse.json({ error: 'Subscription not configured' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${baseUrl}/subscribe`,
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[subscribe] error:', message, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
