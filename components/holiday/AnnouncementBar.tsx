'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BOUTIQUE, HOLIDAY_CODE, HOLIDAY_CODE_ENDS } from '@/lib/holiday'

const DISMISS_KEY = 'dmc-holiday-bar-dismissed'

export default function AnnouncementBar() {
  // Render on the client only, so the end dates are checked against the visitor's clock.
  const [visible, setVisible] = useState(false)
  const [showBoutique, setShowBoutique] = useState(false)

  useEffect(() => {
    const now = Date.now()
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'
    } catch {}
    setShowBoutique(now < BOUTIQUE.ends.getTime())
    setVisible(!dismissed && now < HOLIDAY_CODE_ENDS.getTime())
  }, [])

  if (!visible) return null

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {}
    setVisible(false)
  }

  return (
    <div className="bg-holiday-berry text-white">
      <div className="relative max-w-6xl mx-auto px-12 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-center">
        <span>
          Use code <strong className="tracking-wider">{HOLIDAY_CODE}</strong> for $5 off
        </span>
        {showBoutique && (
          <>
            <span aria-hidden="true" className="text-holiday-gold-light">&#10022;</span>
            <Link href="/find-us" className="underline underline-offset-2 hover:text-holiday-gold-light">
              Visit us at the KC Holiday Boutique, {BOUTIQUE.booth}, Nov 18-22
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
    </div>
  )
}
