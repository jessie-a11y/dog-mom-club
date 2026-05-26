'use client'

import { useState } from 'react'

export default function EmailSignupForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/klaviyo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="mt-8 text-brown-warm font-medium">
        You&apos;re in! Check your inbox for your 20% off code. 🐾
      </p>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="flex-1 px-5 py-3 rounded-full border border-rose-light bg-white text-brown-dark placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-rose-dusty/30 focus:border-rose-dusty transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary px-7 py-3 whitespace-nowrap disabled:opacity-60"
        >
          {status === 'loading' ? 'Signing up...' : 'Claim My 20% Off'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
    </>
  )
}
