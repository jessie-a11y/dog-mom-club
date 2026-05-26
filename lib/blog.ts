import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  image: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

function formatDate(raw: string | Date): string {
  const d = new Date(raw)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
    const { data } = matter(raw)
    return {
      slug: data.slug ?? slug,
      title: data.title as string,
      date: formatDate(data.date),
      author: data.author as string,
      excerpt: data.excerpt as string,
      image: data.image as string,
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content)
  const contentHtml = processed.toString()

  return {
    slug: data.slug ?? slug,
    title: data.title as string,
    date: formatDate(data.date),
    author: data.author as string,
    excerpt: data.excerpt as string,
    image: data.image as string,
    contentHtml,
  }
}

export function getAllPostSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
