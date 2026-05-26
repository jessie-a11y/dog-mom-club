'use client'

import { useState, FormEvent } from 'react'

export default function ContactPage() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">Get in Touch</span>
          <h1 className="section-title mt-2">{"We'd love to hear from you"}</h1>
          <p className="mt-4 text-brown-warm leading-relaxed">
            Have a question about an order, an ingredient concern, or just want to share a photo of
            your pup enjoying our treats? We read every message and reply within 24 hours.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: '📧', label: 'Email', value: 'hello@dogmomclub.store' },
              { icon: '📦', label: 'Shipping', value: '2–4 business days, US only' },
              { icon: '⏰', label: 'Response time', value: 'Within 24 hours' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-xs text-brown-light font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-brown-dark text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-rose-pale/40 border border-rose-pale">
            <p className="text-sm font-semibold text-brown-dark">Planning a custom order?</p>
            <p className="mt-1 text-sm text-brown-warm">
              For weddings, birthday parties, corporate gifts, and bulk orders, use our dedicated{' '}
              <a href="/custom-orders" className="text-rose-dusty underline hover:text-brown-dark transition-colors">
                Custom Orders form
              </a>
              .
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-serif text-2xl text-brown-dark">Message sent!</h3>
              <p className="mt-2 text-brown-warm">{"We'll get back to you within 24 hours."}</p>
              <button onClick={() => setStatus('idle')} className="btn-outline mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="name">
                    Your name
                  </label>
                  <input id="name" name="name" type="text" required className="input-field" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="email">
                    Email address
                  </label>
                  <input id="email" name="email" type="email" required className="input-field" placeholder="jane@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="subject">
                  Subject
                </label>
                <select id="subject" name="subject" className="input-field">
                  <option value="">Select a topic…</option>
                  <option value="order">Order question</option>
                  <option value="subscription">Subscription help</option>
                  <option value="ingredients">Ingredients / allergies</option>
                  <option value="wholesale">Wholesale inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-dark mb-1.5" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Tell us how we can help…"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-4">
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
