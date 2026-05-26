import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 lg:h-[480px] w-full bg-cream-200">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post header */}
        <div className="-mt-16 relative z-10 bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-10">
          <nav className="text-xs text-brown-warm mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-rose-dusty transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-rose-dusty transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-brown-dark line-clamp-1">{post.title}</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl text-brown-dark leading-tight">{post.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brown-warm">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-dusty" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {post.date}
            </span>
            <span className="text-brown-light">·</span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-dusty" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {post.author}
            </span>
          </div>

          <p className="mt-5 text-brown-warm text-lg leading-relaxed border-l-4 border-rose-light pl-4 italic">
            {post.excerpt}
          </p>
        </div>

        {/* Body */}
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-cream-300">
          <Link href="/blog" className="btn-outline inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            All posts
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-10">
          <h2 className="section-title mb-8">More from the Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group card overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-base text-brown-dark leading-snug group-hover:text-rose-dusty transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs text-brown-light">{p.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
