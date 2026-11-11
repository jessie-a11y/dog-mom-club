'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import type { CartItem } from '@/lib/types'
import { lookup, priceCart, type PricedCart } from '@/lib/pricing'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string; variantValue: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantValue: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] }

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantValue: string) => void
  updateQuantity: (productId: string, variantValue: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  priced: PricedCart
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      // Drop items that are no longer sold and refresh names, labels and prices from the catalog.
      return {
        items: action.items.flatMap((i) => {
          const found = i?.variant ? lookup(i.productId, i.variant.value) : null
          if (!found) return []
          return [{
            ...i,
            name: found.name,
            image: found.image,
            price: found.unitCents / 100,
            variant: { ...i.variant, label: found.variantLabel },
          }]
        }),
      }

    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId && i.variant.value === action.item.variant.value
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId && i.variant.value === action.item.variant.value
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.productId && i.variant.value === action.variantValue)
        ),
      }

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => !(i.productId === action.productId && i.variant.value === action.variantValue)
          ),
        }
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId && i.variant.value === action.variantValue
            ? { ...i, quantity: action.quantity }
            : i
        ),
      }

    case 'CLEAR_CART':
      return { items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dmc-cart')
      if (stored) {
        dispatch({ type: 'HYDRATE', items: JSON.parse(stored) })
      }
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('dmc-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', item })
  const removeItem = (productId: string, variantValue: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId, variantValue })
  const updateQuantity = (productId: string, variantValue: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, variantValue, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const priced = priceCart(
    state.items.map((i) => ({ productId: i.productId, variantValue: i.variant.value, quantity: i.quantity, note: i.note }))
  )
  // Bundle-priced subtotal (2 for $16 etc. already applied)
  const totalPrice = priced.subtotalCents / 100

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, priced }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
