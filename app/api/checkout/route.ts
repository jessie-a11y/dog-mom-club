import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { CartItem } from '@/lib/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

/**
 * Derives the env var name for a product+variant and returns the price ID.
 * e.g. productId="beagles-bagels", variantValue="2-pack"
 *   → process.env.NEXT_PUBLIC_STRIPE_PRICE_BEAGLES_BAGELS_2PACK
 */
function getPriceId(productId: string, variantValue: string): string | undefined {
  const productKey = productId.replace(/-/g, '_').toUpperCase()
  const variantKey = variantValue.replace(/-/g, '').toUpperCase()
  const envVar = `NEXT_PUBLIC_STRIPE_PRICE_${productKey}_${variantKey}`
  return process.env[envVar]
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Resolve all price IDs before hitting Stripe
    const resolvedItems = items.map((item) => {
      const priceId = getPriceId(item.productId, item.variant.value)
      if (!priceId) {
        throw new Error(
          `No Stripe price ID configured for product "${item.productId}" variant "${item.variant.value}"`
        )
      }
      return { ...item, priceId }
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedItems.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }))

    // Determine if the cart qualifies for free shipping
    const FREE_SHIPPING_THRESHOLD = 29_00 // in cents
    const cartTotalCents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0)
    const qualifiesForFreeShipping = cartTotalCents >= FREE_SHIPPING_THRESHOLD

    // One shipping option only: free at $35+, otherwise standard $5.99
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
              fixed_amount: { amount: 599, currency: 'usd' },
              display_name: 'Standard shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 4 },
              },
            },
          },
    ]

    // Collect any personalization notes for session-level visibility in Stripe dashboard
    const personalizationNotes = items
      .filter((i) => i.note)
      .map((i) => `${i.name} (${i.variant.label}): ${i.note}`)
      .join(' | ')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      ...(personalizationNotes ? { metadata: { personalization_notes: personalizationNotes } } : {}),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: shippingOptions,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
