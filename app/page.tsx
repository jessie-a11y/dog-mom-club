import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import EmailSignupForm from '@/components/EmailSignupForm'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'

export default function HomePage() {
  const featuredProducts = products as Product[]

  return (
    <>
      {/* Pre-order Banner */}
      <a
        href="https://www.hotplate.com/dogmomclub"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-rose-dusty text-white text-center text-sm font-medium py-3 px-4 hover:bg-rose-light hover:text-brown-dark transition-colors"
      >
        🎉 Pre-orders now open — order fresh treats on HotPlate →
      </a>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-cream-100">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80"
            alt="Happy dog"
            fill
            priority
            className="object-cover object-center opacity-25"
            sizes="100vw"
          />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-pale rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cream-200 rounded-full blur-3xl opacity-80 translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-dusty mb-4">
              Fresh-Baked in Kansas City. Human-Grade. Small-Batch.
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brown-dark leading-tight">
              Small-Batch Dog Treats Baked by Dog Moms.
            </h1>
            <p className="mt-6 text-lg text-brown-warm leading-relaxed">
              Handmade dog treats made with simple ingredients and baked in small batches — crafted by real dog moms, right here in Kansas City.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary text-base px-8 py-4">
                Shop Treats
              </Link>
              <Link href="/subscribe" className="btn-secondary text-base px-8 py-4">
                Dog Mom Box — $29/mo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-rose-pale/40 py-6 border-y border-rose-pale">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🥣', label: 'Human-Grade Ingredients' },
              { icon: '🏡', label: 'Small-Batch Baked in Kansas City' },
              { icon: '🐾', label: 'Crafted by Dog Moms' },
              { icon: '📦', label: 'Free Shipping on $29+' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold text-brown-soft uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">Our Treats</span>
            <h2 className="section-title mt-1">Fan Favorites</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-rose-dusty hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-outline">View all treats</Link>
        </div>
      </section>

      {/* Subscription banner */}
      <section className="bg-brown-dark text-white flex flex-col md:flex-row min-h-[560px]">
        {/* Image — top on mobile, right on desktop */}
        <div className="order-first md:order-last md:w-1/2 relative aspect-[4/3] md:aspect-auto">
          <Image
            src="/images/Subscription_Box_Image.png"
            alt="Dog Mom Box subscription"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content — bottom on mobile, left on desktop */}
        <div className="md:w-1/2 flex items-center py-16 px-8 md:px-16 lg:px-20">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">Monthly Subscription</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-2 leading-tight">
              The Dog Mom Box
            </h2>
            <p className="mt-4 text-brown-light leading-relaxed">
              A curated box of our best treats, delivered to your door every month. New flavors, seasonal specials, and exclusive member perks — all for just $29/month. Cancel anytime.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                '4–6 full-size treat bags per month',
                'Exclusive member-only flavors',
                'Handwritten note from the Dog Mom herself',
                'Cancel or pause anytime',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-brown-light">
                  <span className="text-rose-light">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/subscribe" className="btn-primary bg-rose-dusty hover:bg-rose-light hover:text-brown-dark text-base px-8 py-4">
                Subscribe — $29/month
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="bg-rose-pale/60 border-y border-rose-pale py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">Newsletter</span>
          <h2 className="section-title mt-2">Join the Pack</h2>
          <p className="mt-3 text-brown-warm leading-relaxed">
            Sign up for exclusive deals, new treat drops, and dog mom content. Get 20% off your first order just for joining.
          </p>

          <EmailSignupForm />

          <p className="mt-4 text-xs text-brown-light">
            No spam, ever. Just good stuff for you and your pup. 🐾
          </p>
        </div>
      </section>

      {/* About snippet */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
              alt="Dog Mom Club founder with her dogs"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">Our Story</span>
            <h2 className="section-title mt-2">Fresh-baked by dog moms, for dog moms.</h2>
            <p className="mt-4 text-brown-warm leading-relaxed">
              Dog Mom Club was born in Kansas City out of one simple idea: our dogs deserve better. We're real dog moms who got tired of flipping over treat bags and reading ingredient lists full of things we couldn't pronounce.
            </p>
            <p className="mt-3 text-brown-warm leading-relaxed">
              So we started baking — human-grade, small-batch treats with simple ingredients you can actually recognize. Every batch is made with love and a few extra dog kisses along the way.
            </p>
            <Link href="/products" className="btn-primary mt-8 inline-flex">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
