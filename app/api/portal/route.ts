import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

/**
 * GET /api/portal
 * Redirects a subscriber to the Stripe Customer Portal.
 * Expects ?customer=cus_xxx as a query param. In production you'd
 * look up the customer ID from your database using the logged-in user's session.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customer')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    if (!customerId) {
      // No customer ID — show a simple landing page asking for email/ID
      return NextResponse.redirect(`${baseUrl}/subscribe#manage`)
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/subscribe`,
    })

    return NextResponse.redirect(portalSession.url)
  } catch (err) {
    console.error('[portal] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
