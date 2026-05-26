import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet the dog moms behind Dog Mom Club: small-batch treats made with love and tested by pups.',
}

const differentiators = [
  {
    icon: '01',
    title: 'Human-grade ingredients only',
    desc: "No 'dried bakery product,' no mystery fillers, no ingredient you'd need a chemistry degree to pronounce. Every single thing in our treats is something we'd eat ourselves.",
  },
  {
    icon: '02',
    title: 'Meat-free, simple recipes',
    desc: "Real peanut butter, real apples, real cheese. Our ingredient lists are short because they should be. Good food doesn't need to hide behind a wall of additives.",
  },
  {
    icon: '03',
    title: 'Homemade in small batches',
    desc: "These aren't made in a factory and drop-shipped to a warehouse. We bake every batch ourselves, by hand, in small quantities so they're always fresh.",
  },
  {
    icon: '04',
    title: 'Pup-approved before they reach yours',
    desc: "Every recipe goes through the most rigorous quality control panel we know: our own dogs. If Layla, Doug, Winston, Lucy, or Moose turns their nose up at it, it doesn't ship.",
  },
]

const dogs = [
  {
    name: 'Layla',
    title: 'Chief Biscuit Officer',
    image: '/images/Layla.png',
  },
  {
    name: 'Doug',
    title: 'VP of Snack Acquisition',
    image: '/images/Doug.png',
  },
  {
    name: 'Winston',
    title: 'Director of Quality Control',
    image: '/images/Winston.png',
  },
  {
    name: 'Lucy',
    title: 'Head of Crunch Research',
    image: '/images/Lucy.png',
  },
  {
    name: 'Moose',
    title: 'Senior Taste Consultant',
    image: '/images/Moose.png',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brown-dark text-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">
            Our Story
          </span>
          <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
            Made with Love.<br className="hidden sm:block" /> Tested by Pups.
          </h1>
          <p className="mt-6 text-brown-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {"We're Leia and Jessie, two dog moms on a mission to make treats worthy of your good girl (or boy)."}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">
              How It Started
            </span>
            <h2 className="section-title mt-2">From scratch. Literally.</h2>
            <div className="mt-6 space-y-4 text-brown-warm leading-relaxed">
              <p>
                Dog Mom Club was born in 2024 when Leia and Jessie (two friends, two dog moms, two
                people who read too many dog treat ingredient labels) decided enough was enough.
                Leia had spent years leading nonprofits and writing children's books. Jessie had
                spent years building brands and communities online. Together, they had exactly the
                right combination of stubbornness and optimism to start a business.
              </p>
              <p>
                It started the way most good things do: in a kitchen, with a bad first batch and a
                dog willing to eat it anyway. They tested recipe after recipe on their own pups,
                tweaking ingredients until the tail wags were undeniable. Once the recipes were
                locked, they took them to the streets. Literally. Pop-ups around Kansas City, tote
                bags full of treats, and a whole lot of dogs who became instant fans.
              </p>
              <p>
                Those early pop-ups turned into a permanent booth at the Historic Downtown Liberty
                Farmers Market, and a growing community of dog lovers across Kansas City who keep
                coming back every Saturday. Dog Mom Club is still small on purpose, because small
                means fresh, small means personal, and small means every bag leaves our hands and
                not a factory floor.
              </p>
            </div>
          </div>

          {/* Founder photo + quote */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/Leia_and_Jessie.png"
                alt="Leia and Jessie, co-founders of Dog Mom Club"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="card p-8 bg-rose-pale/40 border-rose-pale text-center">
              <p className="font-serif text-xl md:text-2xl text-brown-dark leading-snug italic">
                {"\"We just wanted treats we could actually feel good about giving our dogs.\""}
              </p>
              <p className="mt-4 text-sm font-semibold text-brown-warm tracking-wide">
                &mdash; Leia &amp; Jessie, Co-Founders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Treats Are Different */}
      <section className="bg-brown-dark text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">
              The Dog Mom Difference
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-2">
              Why our treats are different.
            </h2>
            <p className="mt-4 text-brown-light max-w-xl mx-auto leading-relaxed">
              {"The pet treat industry is full of shortcuts. We don't take any of them."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {differentiators.map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <span className="font-serif text-3xl font-bold text-rose-light/60" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="font-semibold text-white text-lg mt-4">{item.title}</h3>
                <p className="mt-2 text-brown-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Taste Testers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">
            The Real Bosses
          </span>
          <h2 className="section-title mt-2">Meet the Taste Testers</h2>
          <p className="mt-3 text-brown-warm max-w-lg mx-auto">
            No treat leaves our kitchen without passing their inspection. They take the job very seriously.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {dogs.map((dog) => (
            <div key={dog.name} className="card p-6 text-center flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] border-teal/40">
                <Image
                  src={dog.image}
                  alt={dog.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div>
                <h3 className="font-semibold text-brown-dark text-lg">{dog.name}</h3>
                <p className="mt-1 text-xs font-medium text-rose-dusty tracking-wide uppercase">
                  {dog.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Find Us CTA */}
      <section className="bg-rose-pale/30 py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-brown-dark">Come find us in person.</h2>
          <p className="mt-3 text-brown-warm leading-relaxed">
            {"We're at markets and events across Kansas City all year long. Nothing beats meeting your pup face-to-face and handing over a sample."}
          </p>
          <Link href="/find-us" className="btn-primary mt-6 inline-flex">
            See Where We&apos;ll Be &rarr;
          </Link>
        </div>
      </section>
    </div>
  )
}
