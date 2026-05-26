'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from './CartProvider'

export default function Navbar() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-sm border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Dog Mom Club"
              height={80}
              width={200}
              className="h-20 w-auto object-contain mix-blend-multiply brightness-100"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">

            <Link href="/products" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Shop Treats
            </Link>
            <Link href="/odd-dog-shop" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Odd Dog Shop
            </Link>

            <Link href="/subscribe" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Subscribe
            </Link>
            <Link href="/about" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              About
            </Link>
            <Link href="/find-us" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Find Us
            </Link>
            <Link href="/blog" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium text-brown-warm hover:text-teal transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-brown-warm hover:text-teal transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-dusty text-white text-[10px] font-semibold flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-brown-warm"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-cream-200 flex flex-col gap-4">
            <Link href="/products" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Shop Treats</Link>
            <Link href="/odd-dog-shop" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Odd Dog Shop</Link>
            <Link href="/subscribe" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Subscribe</Link>
            <Link href="/about" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/find-us" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Find Us</Link>
            <Link href="/blog" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/custom-orders" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Custom Orders</Link>
            <Link href="/contact" className="text-sm font-medium text-brown-warm" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
