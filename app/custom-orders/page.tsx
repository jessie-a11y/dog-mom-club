'use client'

import { useState, FormEvent } from 'react'

export default function CustomOrdersPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
      if (!endpoint) throw new Error('No endpoint configured')
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('success'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-brown-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">
            Custom Orders
          </span>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
            Custom Orders
          </h1>
          <p className="mt-5 text-brown-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Planning something special for your pup or a fellow dog lover? We would love to help!
          </p>
          <p className="mt-4 text-brown-light max-w-xl mx-auto leading-relaxed">
            We make custom treat orders for weddings, birthday parties, corporate gifts, and more.
            Tell us what you have in mind — no commitment, just a conversation.
          </p>
        </div>
      </section>

      {/* Info blocks */}
      <section className="bg-rose-pale/30 border-b border-rose-pale py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: '🎂', label: 'Occasions', value: 'Weddings, birthdays, corporate gifts & more' },
              { icon: '🐾', label: 'Flavors', value: 'All our signatures, or let us suggest something' },
              { icon: '⏰', label: 'Response Time', value: 'Within 2 business days' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-dusty">{label}</p>
                <p className="text-sm text-brown-warm leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {status === 'success' ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-serif text-3xl text-brown-dark">Request received!</h2>
            <p className="mt-3 text-brown-warm leading-relaxed">
              {"We'll be in touch within 2 business days to talk through your order. No commitment required."}
            </p>
            <button onClick={() => setStatus('idle')} className="btn-outline mt-8">
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-brown-dark">Tell us about your order</h2>
              <p className="mt-1 text-sm text-brown-warm">
                Fill in what you know — we can figure out the rest together.
              </p>
            </div>

            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="name">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            {/* Occasion + Quantity */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="occasion">
                  Occasion / Event type{' '}
                  <span className="font-normal text-brown-light">(optional)</span>
                </label>
                <input
                  id="occasion"
                  name="occasion"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Wedding, birthday party"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="quantity">
                  Approximate quantity{' '}
                  <span className="font-normal text-brown-light">(optional)</span>
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  className="input-field"
                  placeholder="e.g. 50 bags"
                />
              </div>
            </div>

            {/* Flavors */}
            <div>
              <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="flavors">
                Preferred flavors or allergies to avoid{' '}
                <span className="font-normal text-brown-light">(optional)</span>
              </label>
              <input
                id="flavors"
                name="flavors_allergies"
                type="text"
                className="input-field"
                placeholder="e.g. Peanut butter only, no cheese"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="date_needed">
                Date needed by{' '}
                <span className="font-normal text-brown-light">(optional)</span>
              </label>
              <input
                id="date_needed"
                name="date_needed"
                type="date"
                className="input-field"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="message">
                Message / anything else we should know
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="input-field resize-none"
                placeholder="Tell us about your vision, packaging preferences, timeline, or any other details…"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                Something went wrong. Please try again or email us at hello@dogmomclub.store.
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full py-4 text-base"
              >
                {status === 'loading' ? 'Sending…' : 'Send My Request'}
              </button>
              <p className="mt-3 text-xs text-center text-brown-light">
                {"We'll get back to you within 2 business days to discuss your order. No commitment required."}
              </p>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
