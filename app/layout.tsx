import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'Dog Mom Club — Small-Batch Dog Treats',
    template: '%s | Dog Mom Club',
  },
  description: 'Small-batch, all-natural dog treats made with love. Shop single treats or subscribe to our monthly Dog Mom Box.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    siteName: 'Dog Mom Club',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  )
}
