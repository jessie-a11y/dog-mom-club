import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { CartItem } from '@/lib/types'
import {
  BUNDLES,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
  priceCart,
} from '@/lib/pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Prices always come from the server-side catalog, never from the browser.
    const priced = priceCart(
      items.map((i) => ({
        productId: i.productId,
        variantValue: i.variant?.value,
        quantity: i.quantity,
        note: typeof i.note === 'string' ? i.note.slice(0, 300) : undefined,
      }))
    )

    if (priced.invalid.length > 0 || priced.lines.length === 0) {
      return NextResponse.json(
        { error: 'Some items in your cart are no longer available. Please refresh your cart and try again.' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    // One Stripe line item per price segment, so bundled units show at the bundle price.
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.lines.flatMap((line) =>
      line.segments.map((seg) => ({
        quantity: seg.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: seg.unitCents,
          product_data: {
            name: `${line.name} (${line.variantLabel})${
              seg.bundled && line.bundle ? `, ${BUNDLES[line.bundle].label}` : ''
            }`,
            ...(baseUrl.startsWith('https://') ? { images: [`${baseUrl}${line.image}`] } : {}),
            metadata: { product_id: line.productId, variant: line.variantValue },
          },
        },
      }))
    )

    // Free shipping is based on the bundle-priced subtotal (before promo codes).
    const qualifiesForFreeShipping = priced.subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      qualifiesForFreeShipping
        ? {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'usd' },
              display_name: 'Free shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          }
        : {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: STANDARD_SHIPPING_CENTS, currency: 'usd' },
              display_name: 'Standard shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 4 },
              },
            },
          },
    ]

    // Collect any personalization notes for session-level visibility in Stripe dashboard
    const personalizationNotes = priced.lines
      .filter((l) => l.note)
      .map((l) => `${l.name} (${l.variantLabel}): ${l.note}`)
      .join(' | ')
      .slice(0, 500)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      ...(personalizationNotes ? { metadata: { personalization_notes: personalizationNotes } } : {}),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: shippingOptions,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
