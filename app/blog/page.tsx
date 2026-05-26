import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, stories, and treat inspiration from the Dog Mom Club team in Kansas City.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-xs font-semibold tracking-widest uppercase text-rose-dusty">From the Dog Mom Club Kitchen</span>
        <h1 className="section-title mt-2">The Blog</h1>
        <p className="mt-3 text-brown-warm max-w-lg mx-auto">
          Tips on ingredients, life with dogs in Kansas City, DIY recipes, and everything in between.
        </p>
      </div>

      {/* Featured post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group block mb-14">
          <div className="card overflow-hidden grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-rose-dusty">Latest Post</span>
              <h2 className="font-serif text-2xl md:text-3xl text-brown-dark mt-2 leading-snug group-hover:text-rose-dusty transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-brown-warm text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 text-xs text-brown-light">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.author}</span>
              </div>
              <span className="mt-4 text-sm font-medium text-rose-dusty group-hover:underline">Read more →</span>
            </div>
          </div>
        </Link>
      )}

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group card overflow-hidden flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-serif text-lg text-brown-dark leading-snug group-hover:text-rose-dusty transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-brown-warm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-brown-light">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
