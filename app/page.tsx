import Image from 'next/image'
import Link from 'next/link'
import EmailSignupForm from '@/components/EmailSignupForm'
import AddToCartButton from '@/components/holiday/AddToCartButton'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'
import { BOUTIQUE, HOTPLATE_URL, SHIP_BY_MESSAGE, isBefore } from '@/lib/holiday'

// Rebuild hourly so date-based sections (Boutique promo) switch off on time.
export const revalidate = 3600

export default function HomePage() {
  const all = products as Product[]
  const advent = all.filter((p) => p.category === 'advent')
  const treats = all.filter((p) => p.category !== 'advent')
  const boutiqueActive = isBefore(BOUTIQUE.ends)

  return (
    <>
      {/* Holiday hero */}
      <section className="holiday-snow text-holiday-snow overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-holiday-gold-light">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
              Holiday 2026
            </span>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05]">
              Advent calendars, but make it <em className="text-holiday-gold-light font-normal">treats</em>
            </h1>
            <p className="text-lg leading-relaxed text-[#e9e3d4] max-w-lg">
              A small-batch treat behind every door, baked by hand in Kansas City. Three designs, made for the dog who deserves a countdown.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {boutiqueActive ? (
                <a
                  href={HOTPLATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[48px] rounded-full bg-holiday-berry px-7 py-3 font-bold text-white hover:bg-[#8a1825] transition-colors"
                >
                  Pre-order for Boutique pickup
                </a>
              ) : null}
              <a
                href="#advent"
                className="inline-flex items-center min-h-[48px] rounded-full border-2 border-holiday-snow px-7 py-3 font-bold text-holiday-snow hover:bg-white/10 transition-colors"
              >
                Shop Advent Boxes
              </a>
            </div>
          </div>

          {/* Fanned box photos */}
          <div className="relative h-[340px] sm:h-[420px]" aria-hidden="true">
            {[
              { p: advent[1], cls: 'left-0 top-14 w-[46%] -rotate-[7deg] z-0', label: 'KC Dogs' },
              { p: advent[2], cls: 'right-0 top-14 w-[46%] rotate-6 z-0', label: 'Odd Dog' },
              { p: advent[0], cls: 'left-1/4 top-0 w-1/2 -rotate-1 z-10', label: 'Nutcracker' },
            ].map(({ p, cls, label }) =>
              p ? (
                <div key={p.id} className={`absolute bg-white p-2.5 pb-4 rounded-md shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${cls}`}>
                  <div className="relative aspect-square">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" priority />
                  </div>
                  <p className="mt-2 text-center font-serif text-holiday-pine text-base">{label}</p>
                </div>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* Gold ribbon */}
      <div className="h-2.5 bg-holiday-gold" />

      {/* Advent boxes */}
      <section id="advent" className="bg-holiday-snow scroll-mt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-holiday-berry">The Advent Boxes</span>
            <h2 className="font-serif text-4xl md:text-5xl text-holiday-pine">Pick your pup&apos;s countdown</h2>
            <p className="text-lg text-holiday-muted max-w-xl leading-relaxed">
              Every treat is baked in small batches with short, simple ingredient lists. Just open a door a day.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {advent.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl overflow-hidden border border-holiday-line flex flex-col">
                <Link href={`/products/${p.id}`} className="relative block aspect-square">
                  <Image src={p.image} alt={`${p.name} front`} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  {p.badge && (
                    <span className="absolute top-4 left-4 rounded-full bg-holiday-berry px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                      {p.badge}
                    </span>
                  )}
                </Link>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl text-holiday-pine">
                      <Link href={`/products/${p.id}`} className="hover:underline">{p.name.replace(' Advent Box', '')}</Link>
                    </h3>
                    <span className="text-xl font-bold text-holiday-pine">${p.price.toFixed(0)}</span>
                  </div>
                  <p className="text-holiday-muted leading-relaxed flex-1">{p.shortDescription}</p>
                  <AddToCartButton product={p} className="mt-2 w-full" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Boutique band */}
      {boutiqueActive && (
        <section id="boutique" className="holiday-berry text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-[#f6e7c1]">Come see us in person</span>
              <h2 className="font-serif text-4xl md:text-[44px] leading-tight">Skip the line at the KC Holiday Boutique</h2>
              <p className="text-lg leading-relaxed text-[#fbecec]">
                Pre-order your Advent Box online and grab it at our booth. We&apos;ll have it bagged and waiting.
              </p>
              <div className="mt-2">
                <a
                  href={HOTPLATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[48px] rounded-full bg-holiday-snow px-7 py-3 font-bold text-holiday-berry hover:bg-white transition-colors"
                >
                  Pre-order for booth pickup
                </a>
              </div>
            </div>
            <div className="bg-holiday-snow text-holiday-pine rounded-2xl p-7 flex flex-col gap-5 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              {[
                { title: BOUTIQUE.dates, sub: 'Five days of holiday shopping', icon: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 10h18M8 3v4M16 3v4' },
                { title: BOUTIQUE.venue, sub: BOUTIQUE.name, icon: 'M12 22s7-6.2 7-12a7 7 0 00-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
                { title: BOUTIQUE.booth, sub: 'Look for the Dog Mom Club sign', icon: 'M4 9l2-5h12l2 5M4 9v11h16V9M4 9h16M10 20v-6h4v6' },
              ].map((row) => (
                <div key={row.title} className="flex gap-4 items-start">
                  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a51e2d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d={row.icon} />
                  </svg>
                  <div>
                    <p className="font-bold text-lg">{row.title}</p>
                    <p className="text-sm text-holiday-muted">{row.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stocking stuffers */}
      <section id="treats" className="bg-holiday-snow scroll-mt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-holiday-berry">Stocking stuffers</span>
              <h2 className="font-serif text-4xl md:text-[44px] text-holiday-pine">Treat bags, holiday wrapped</h2>
            </div>
            <span className="rounded-full bg-holiday-pine text-holiday-snow px-5 py-2.5 font-bold">Mix and match: 2 for $16</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {treats.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-2xl overflow-hidden border border-holiday-line flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-serif text-lg text-holiday-pine group-hover:underline">{p.name}</h3>
                  <p className="text-sm text-holiday-muted">
                    {p.variants.length > 1 ? p.variants.map((v) => v.label).join(' or ') : 'One size'}
                    {p.bundle === 'pair20' ? ' · 2 for $20' : ''}
                  </p>
                  <p className="mt-1 font-bold text-holiday-pine">${p.price.toFixed(0)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ship-by strip */}
      <section className="holiday-snow text-holiday-snow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-lg">
          <span className="flex items-center gap-3">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7c873" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7" cy="18" r="1.8" />
              <circle cx="17" cy="18" r="1.8" />
            </svg>
            {SHIP_BY_MESSAGE}
          </span>
          <span className="text-holiday-gold-light">Free shipping on orders $29+</span>
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
