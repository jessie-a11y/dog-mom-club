import type { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Shop All Treats',
  description: 'Browse our full collection of small-batch, all-natural dog treats.',
}

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">All Treats</span>
        <h1 className="section-title mt-2">Signature Treats</h1>
        <p className="mt-3 text-brown-warm max-w-lg mx-auto">
          Fresh-baked in small batches with human-grade ingredients, right here in Kansas City. Simple recipes. Real ingredients. Happy dogs.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(products as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Upsell banner */}
      <div className="mt-16 rounded-3xl bg-rose-pale/50 border border-rose-pale p-8 md:p-12 text-center">
        <h2 className="font-serif text-2xl text-brown-dark">Love what you see?</h2>
        <p className="mt-2 text-brown-warm">
          Subscribe to the Dog Mom Box and get a new curated selection of treats every month — at a fraction of the retail price.
        </p>
        <a href="/subscribe" className="btn-primary mt-6 inline-flex">
          Explore the Dog Mom Box
        </a>
      </div>
    </div>
  )
}
