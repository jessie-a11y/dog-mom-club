export interface ProductVariant {
  type: 'size' | 'flavor' | 'edition'
  label: string
  value: string
  oz?: string
  price?: number
  /** Short helper text shown under the selector when this option is picked. */
  hint?: string
}

export interface SizeOption {
  label: string
  value: string
  hint: string
}

/** Bundle groups: items in the same group mix and match toward the bundle price. */
export type BundleGroup = 'pair16' | 'pair20'

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  image: string
  gallery?: string[]
  badge?: string
  ingredients: string
  nutritionLabel?: string
  variants: ProductVariant[]
  sizeOptions?: SizeOption[]
  category?: 'treat' | 'advent'
  bundle?: BundleGroup
}

export interface OddDogProduct {
  id: string
  name: string
  author: string
  illustrator: string
  editor: string
  description: string
  image: string
  price?: number
  badge?: string
  variants?: ProductVariant[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  variant: ProductVariant
  quantity: number
  note?: string
}
