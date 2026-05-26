import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Us',
  description: 'Find Dog Mom Club at a farmers market or event near you.',
}

const markets = [
  {
    name: "Historic Downtown Liberty Farmer's Market",
    schedule: 'Saturdays, May–October · 8am–noon',
    url: 'https://historicdowntownliberty.org/farmers-market/',
    image: null,
    imageAlt: "Historic Downtown Liberty Farmer's Market",
  },
  {
    name: "Parkville Farmer's Market",
    schedule: 'Saturdays, April 25–October 31 · 7am–noon',
    url: 'https://www.parkvillefarmersmarket.com/',
    image: '/images/Parkville_Farmers_Market_Logo.avif',
    imageAlt: "Parkville Farmer's Market",
  },
  {
    name: 'Mission Market',
    schedule: 'Thursdays, June–August · 4:30–8pm',
    url: 'https://www.missionks.org/parks-recreation/mission-market/',
    image: '/images/Mission_Market_Logo.jpg',
    imageAlt: 'Mission Market',
  },
  {
    name: 'Made In KC',
    schedule: 'Year-round',
    url: 'https://www.madeinkc.co/',
    image: null,
    imageAlt: 'Made In KC',
  },
  {
    name: 'Copper Canary',
    schedule: 'Year-round',
    url: 'https://www.coppercanarykc.com/',
    image: null,
    imageAlt: 'Copper Canary',
  },
]

interface Event {
  name: string
  date: string
  display: string
  url: string | null
  image: string | null
  imageAlt: string
}

const events: Event[] = [
  {
    name: 'Pupchella at the KC Wheel',
    date: '2026-05-17',
    display: 'May 17, 2026 · 9am–noon',
    url: 'https://www.visitkc.com/events/pupchella-2026-at-the-kc-wheel/',
    image: null,
    imageAlt: 'Pupchella at the KC Wheel',
  },
  {
    name: 'Taste at the Place',
    date: '2026-09-24',
    display: 'September 24, 2026 · 5–8pm',
    url: 'https://childrensplacekc.org/events/taste/',
    image: null,
    imageAlt: 'Taste at the Place event',
  },
  {
    name: 'Strutt With Your Mutt — Wayside Waifs',
    date: '2026-09-27',
    display: 'September 27, 2026',
    url: 'https://waysidewaifs.org/',
    image: null,
    imageAlt: 'Strutt With Your Mutt at Wayside Waifs',
  },
  {
    name: 'Weston Applefest',
    date: '2026-10-03',
    display: 'October 3–4, 2026',
    url: 'https://www.westonmo.com/calendar-events#!event/2026/10/3/applefest-weston-apos-s-fall-harvest-celebration-since-1990',
    image: null,
    imageAlt: 'Weston Applefest festival',
  },
  {
    name: 'Kansas City Holiday Boutique',
    date: '2026-11-18',
    display: 'November 18–22, 2026',
    url: 'https://www.kcholidayboutique.com/',
    image: null,
    imageAlt: 'Kansas City Holiday Boutique',
  },
  {
    name: 'Kristkindl Market',
    date: '2026-12-04',
    display: 'December 4–5, 2026',
    url: 'https://www.kcucc.org/kkm',
    image: null,
    imageAlt: 'Kristkindl Market',
  },
  {
    name: 'Liberty Holiday Mart',
    date: '2026-12-05',
    display: 'December 5, 2026 · 2–5pm',
    url: null,
    image: null,
    imageAlt: 'Liberty Holiday Mart',
  },
]

function Placeholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-rose-pale/50 text-rose-dusty/60 text-xs font-medium text-center px-2">
      {label}
    </div>
  )
}

export default function FindUsPage() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      {/* Hero */}
      <section className="bg-brown-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-light">
            In Person
          </span>
          <h1 className="font-serif text-5xl md:text-6xl mt-2">Find Us</h1>
          <p className="mt-4 text-brown-light text-lg max-w-xl mx-auto leading-relaxed">
            Come say hello — and bring your pup. We're at markets and events across the KC area all year long.
          </p>
        </div>
      </section>

      {/* Weekly Markets */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">
            Recurring
          </span>
          <h2 className="section-title mt-2">Weekly Markets</h2>
          <p className="mt-2 text-brown-warm">
            Look for our booth at these markets throughout the season.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <div key={market.name} className="card overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-cream-100">
                {market.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={market.image}
                    alt={market.imageAlt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Placeholder label={market.name} />
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-semibold text-brown-dark text-lg leading-snug">
                    {market.name}
                  </h3>
                  <p className="mt-2 text-sm text-brown-warm">{market.schedule}</p>
                </div>
                {market.url ? (
                  <a
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline self-start text-sm py-2 px-4 mt-auto"
                  >
                    Learn More →
                  </a>
                ) : (
                  <span className="self-start text-sm text-brown-light mt-auto">
                    No website available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-rose-pale/30 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">
              One-Time Appearances
            </span>
            <h2 className="section-title mt-2">Upcoming Events</h2>
            <p className="mt-2 text-brown-warm">
              Special events and pop-ups — we'd love to see you there.
            </p>
          </div>

          <ol className="relative border-l-2 border-cream-200 space-y-0">
            {events.map((event) => {
              const past = event.date < today
              return (
                <li key={event.name} className="ml-6 pb-10 last:pb-0">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 ${
                      past
                        ? 'bg-cream-200 border-cream-200'
                        : 'bg-rose-dusty border-white'
                    }`}
                  />

                  <div className={`flex gap-4 items-start ${past ? 'opacity-40' : ''}`}>
                    {/* Image thumbnail */}
                    <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cream-100 mt-0.5">
                      {event.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.image}
                          alt={event.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Placeholder label={event.name} />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold tracking-wide uppercase mb-1 ${
                        past ? 'text-brown-light' : 'text-rose-dusty'
                      }`}>
                        {event.display}
                        {past && ' · Past event'}
                      </p>
                      <h3 className="font-semibold text-brown-dark text-lg leading-snug">
                        {event.name}
                      </h3>
                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm font-medium text-rose-dusty hover:text-brown-dark transition-colors underline underline-offset-2"
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </div>
  )
}
