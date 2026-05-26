import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group card hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-teal text-white text-xs font-semibold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-brown-dark group-hover:text-rose-dusty transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-brown-warm leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-brown-dark">${product.price.toFixed(2)}</span>
          <span className="text-xs text-rose-dusty font-medium group-hover:underline">Shop now →</span>
        </div>
      </div>
    </Link>
  )
}
