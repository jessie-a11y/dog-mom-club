import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import products from '@/data/products.json'
import type { Product } from '@/lib/types'
import ProductDetail from './ProductDetail'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  return (products as Product[]).map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = (products as Product[]).find((p) => p.id === params.id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.shortDescription,
  }
}

export default function ProductPage({ params }: Props) {
  const product = (products as Product[]).find((p) => p.id === params.id)
  if (!product) notFound()

  const related = (products as Product[]).filter((p) => p.id !== product.id).slice(0, 2)

  return <ProductDetail product={product} related={related} />
}
