import type { Metadata } from 'next'
import OddDogProductCard from '@/components/OddDogProductCard'
import oddDogProducts from '@/data/odd-dog-products.json'
import type { OddDogProduct } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Odd Dog Shop',
  description: 'Books and goods from the world of Odd Dog — a silly, sweet children\'s book about love, acceptance, and finding where you belong.',
}

export default function OddDogShopPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-cream-100 border-b border-cream-200 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-rose-pale/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-cream-200/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-dusty mb-4">
            ✦ A children&apos;s book ✦
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-brown-dark leading-tight">
            Odd Dog Shop
          </h1>
          <p className="mt-5 text-brown-warm max-w-xl mx-auto text-lg leading-relaxed">
            Stories for the dogs who are a little different — and the people who love them anyway.
          </p>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(oddDogProducts as OddDogProduct[]).map((product) => (
            <OddDogProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* About the book banner */}
      <div className="bg-cream-100 border-t border-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-2xl">🐾</span>
            <h2 className="font-serif text-2xl text-brown-dark mt-3">About the Series</h2>
            <p className="mt-4 text-brown-warm leading-relaxed">
              The Odd Dog series celebrates the quirky, the scrappy, and the wonderfully weird — because the best dogs (and people) rarely fit the mold. Written by Leia Barrett and illustrated by Shannon McKeon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
