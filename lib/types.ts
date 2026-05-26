export interface ProductVariant {
  type: 'size' | 'flavor' | 'edition'
  label: string
  value: string
  oz?: string
  price?: number
}

export interface SizeOption {
  label: string
  value: string
  hint: string
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  image: string
  badge?: string
  ingredients: string
  nutritionLabel?: string
  variants: ProductVariant[]
  sizeOptions?: SizeOption[]
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
