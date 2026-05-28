import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-cream-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl text-cream-100 mb-3">Dog Mom Club</h3>
            <p className="text-sm text-brown-light leading-relaxed">
              Small-batch dog treats made with love, for pups who deserve the very best.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-cream-100 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-brown-light">
              <li><Link href="/products" className="hover:text-cream-100 transition-colors">All Treats</Link></li>
              <li><Link href="/odd-dog-shop" className="hover:text-cream-100 transition-colors">Odd Dog Shop</Link></li>
              <li><Link href="/subscribe" className="hover:text-cream-100 transition-colors">Dog Mom Box</Link></li>
              <li><Link href="/cart" className="hover:text-cream-100 transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-cream-100 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-brown-light">
              <li><Link href="/about" className="hover:text-cream-100 transition-colors">About</Link></li>
              <li><Link href="/find-us" className="hover:text-cream-100 transition-colors">Find Us</Link></li>
              <li><Link href="/blog" className="hover:text-cream-100 transition-colors">Blog</Link></li>
              <li><Link href="/custom-orders" className="hover:text-cream-100 transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-cream-100 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-brown-light">
              <li><Link href="/contact" className="hover:text-cream-100 transition-colors">Contact Us</Link></li>
              <li><Link href="/api/portal" className="hover:text-cream-100 transition-colors">Manage Subscription</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brown-soft/30 text-xs text-brown-light text-center">
          &copy; {new Date().getFullYear()} Dog Mom Club. All rights reserved. Made with 🐾 in Kansas City.
        </div>
      </div>
    </footer>
  )
}
