'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'

const perks = [
  { icon: '📦', title: '4–6 Treat Bags', desc: 'Full-size bags of our most popular and seasonal treats.' },
  { icon: '🌟', title: 'Member Exclusives', desc: 'Flavors and products available only to subscribers.' },
  { icon: '💌', title: 'Personal Note', desc: 'A handwritten note from the Dog Mom herself every month.' },
  { icon: '🔄', title: 'Flexible Billing', desc: 'Cancel, pause, or update your card anytime via the portal.' },
]

const faqs = [
  {
    q: 'When will my box ship?',
    a: "Boxes ship on the 1st of each month. Subscribe by the 25th to receive the current month's box.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Log in to the Subscriber Portal to cancel before your next billing date and you\'ll never be charged again.',
  },
  {
    q: 'What if my dog has allergies?',
    a: 'Email us before subscribing and we\'ll do our best to accommodate. Each box comes with a full ingredient list.',
  },
  {
    q: 'Can I give this as a gift?',
    a: 'Yes! Gift subscriptions are available — just contact us through the Contact page and we\'ll set it up.',
  },
]

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSubscribe() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/subscribe', { method: 'POST' })
      const data = await res.json()
      console.log('[subscribe] response:', res.status, data)
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('[subscribe] fetch error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-brown-dark text-white flex flex-col md:flex-row min-h-[600px]">
        {/* Image — top on mobile, right on desktop */}
        <div className="order-first md:order-last md:w-1/2 relative aspect-[4/3] md:aspect-auto">
          <Image
            src="/images/Subscription_Box_Image.png"
            alt="Dog Mom Box subscription"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content — bottom on mobile, left on desktop */}
        <div className="md:w-1/2 flex items-center py-16 px-8 md:px-16 lg:px-20">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">Monthly Subscription</span>
            <h1 className="font-serif text-5xl md:text-6xl mt-2 leading-tight">
              The Dog Mom Box
            </h1>
            <p className="mt-5 text-brown-light text-lg leading-relaxed">
              A curated monthly box of our very best treats, delivered right to your door. New flavors every month. Made fresh, shipped with love.
            </p>

            <div className="mt-8 flex items-baseline gap-2">
              <span className="font-serif text-5xl text-rose-light">$29</span>
              <span className="text-brown-light text-lg">/month</span>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-900/20 rounded-lg p-3">{error}</p>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn-primary mt-6 py-4 px-10 text-base bg-rose-dusty hover:bg-rose-light hover:text-brown-dark"
            >
              {loading ? 'Redirecting…' : 'Subscribe Now'}
            </button>

            <p className="mt-3 text-xs text-brown-light">
              Secure checkout via Stripe. Cancel anytime.
            </p>

            <p className="mt-4 text-sm text-brown-light">
              Already a subscriber?{' '}
              <a href="/api/portal" className="text-rose-light underline hover:text-white">
                Manage your subscription →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">What's Inside</span>
          <h2 className="section-title mt-2">Everything you (and your pup) love</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk) => (
            <div key={perk.title} className="card p-6 text-center">
              <span className="text-4xl">{perk.icon}</span>
              <h3 className="font-semibold text-brown-dark mt-3">{perk.title}</h3>
              <p className="mt-2 text-sm text-brown-warm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-rose-pale/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">What subscribers are saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "My golden retriever literally sprints to the door when the box arrives. Best $29 I spend every month.",
                name: "Sarah M.",
                dog: "Mom to Honey (Golden Retriever)",
              },
              {
                quote: "I love that every month is a surprise. My picky dachshund has loved everything so far — which is saying something!",
                name: "Lauren T.",
                dog: "Mom to Pretzel (Dachshund)",
              },
              {
                quote: "The quality is unreal. You can tell these are made with actual care. My dog has a sensitive stomach and these are the first treats she tolerates perfectly.",
                name: "Jess R.",
                dog: "Mom to Luna (French Bulldog)",
              },
            ].map((review) => (
              <div key={review.name} className="card p-6">
                <div className="flex text-rose-dusty mb-3">{'★★★★★'}</div>
                <p className="text-brown-warm text-sm leading-relaxed italic">"{review.quote}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-brown-dark text-sm">{review.name}</p>
                  <p className="text-xs text-brown-light">{review.dog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                className="w-full text-left p-5 flex justify-between items-center"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-brown-dark">{faq.q}</span>
                <span className={`text-rose-dusty transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-brown-warm leading-relaxed border-t border-cream-200 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="btn-primary py-4 px-10 text-base"
          >
            {loading ? 'Redirecting…' : 'Start My Subscription'}
          </button>
          <p className="mt-2 text-xs text-brown-light">Cancel anytime. No commitment.</p>
        </div>
      </section>
    </div>
  )
}
