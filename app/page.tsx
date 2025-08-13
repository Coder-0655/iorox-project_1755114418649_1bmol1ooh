'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * Main Home Page for the e-commerce site (app/page.tsx)
 *
 * - Client component providing interactive product browsing and cart management.
 * - Fetches products from /api/products with a fallback to sample products.
 * - Implements search, category filter, sorting, and a persistent cart (localStorage).
 *
 * Note: This file is a self-contained interactive page. In a real project,
 * product fetching should be implemented via server-side functions or API routes connected to the DB.
 */

/* ----------------------------- Types / Interfaces ---------------------------- */

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category?: string
  rating?: { rate: number; count: number }
}

interface CartItem {
  product: Product
  quantity: number
}

/* ----------------------------- Sample Data Fallback --------------------------- */

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Minimal Leather Wallet',
    description: 'Handcrafted full-grain leather wallet with RFID protection.',
    price: 49.0,
    category: 'Accessories',
    image: '/products/wallet.jpg',
    rating: { rate: 4.6, count: 132 },
  },
  {
    id: 'p2',
    title: 'Cotton Crew T-Shirt',
    description: 'Soft, breathable cotton tee with modern fit.',
    price: 19.99,
    category: 'Clothing',
    image: '/products/tshirt.jpg',
    rating: { rate: 4.3, count: 210 },
  },
  {
    id: 'p3',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30h battery.',
    price: 129.0,
    category: 'Electronics',
    image: '/products/headphones.jpg',
    rating: { rate: 4.7, count: 540 },
  },
  {
    id: 'p4',
    title: 'Ceramic Coffee Mug',
    description: '350ml mug, dishwasher safe with matte finish.',
    price: 12.5,
    category: 'Home',
    image: '/products/mug.jpg',
    rating: { rate: 4.5, count: 88 },
  },
]

/* ----------------------------- Helpers & Utils ------------------------------- */

const CART_STORAGE_KEY = 'ecom_cart_v1'

async function fetchProductsFromApi(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' })
    if (!res.ok) throw new Error('API fetch failed')
    const data = await res.json()
    // Basic validation
    if (!Array.isArray(data)) throw new Error('Invalid product response')
    return data.map((p: any) => ({
      id: String(p.id ?? p._id ?? p.slug ?? Math.random().toString(36).slice(2)),
      title: p.title ?? p.name ?? 'Untitled product',
      description: p.description ?? '',
      price: Number(p.price ?? 0),
      category: p.category ?? 'Uncategorized',
      image: p.image ?? p.imageUrl ?? '',
      rating: p.rating ?? undefined,
    }))
  } catch (err) {
    // Fallback to sample products
    return SAMPLE_PRODUCTS
  }
}

/* ----------------------------- UI Components -------------------------------- */

/**
 * ProductCard - presentational card for a product
 */
function ProductCard({
  product,
  onAdd,
  onQuickView,
}: {
  product: Product
  onAdd: (p: Product) => void
  onQuickView: (p: Product) => void
}) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="object-contain h-full w-full"
          />
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 flex-1 mb-3 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{product.category}</div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => onAdd(product)}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              Add
            </button>
            <button
              onClick={() => onQuickView(product)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Quick view
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * CartDrawer - simple cart panel with ability to update quantity and checkout
 */
function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  onClear,
}: {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  return (
    <aside
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:underline"
              aria-label="Clear cart"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              aria-label="Close cart"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-sm text-gray-500">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.image} alt={item.product.title} className="object-contain h-full" />
                  ) : (
                    <div className="text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.product.title}</div>
                  <div className="text-xs text-gray-500">${item.product.price.toFixed(2)}</div>
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 rounded border text-sm"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <div className="text-sm">{item.quantity}</div>
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 rounded border text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="ml-3 text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => alert('Proceed to checkout (demo)')}
              disabled={cart.length === 0}
              className="w-full py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded border text-sm"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ----------------------------- Main Page Component --------------------------- */

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & UI state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Quick view modal state
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)

  // Fetch products on mount
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetchProductsFromApi()
      .then((data) => {
        if (!mounted) return
        setProducts(data)
      })
      .catch((err) => {
        console.error(err)
        if (!mounted) return
        setError('Failed to load products.')
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { product: Product; quantity: number }[]
        setCart(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore storage errors
    }
  }, [cart])

  // Derived categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set).sort()]
  }, [products])

  // Filtered & sorted products
  const visibleProducts = useMemo(() => {
    let list = products.slice()
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (category !== 'All') {
      list = list.filter((p) => p.category === category)
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
    }
    // featured = original order
    return list
  }, [products, search, category, sortBy])

  /* ----------------------------- Cart helpers ----------------------------- */

  const handleAddToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.product.id === product.id)
      if (idx >= 0) {
        const copy = prev.slice()
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
        return copy
      }
      return [...prev, { product, quantity: qty }]
    })
    setIsCartOpen(true)
  }

  const handleUpdateQty = (productId: string, quantity: number) => {
    setCart((prev) => prev
      .map((it) => (it.product.id === productId ? { ...it, quantity } : it))
      .filter((it) => it.quantity > 0))
  }

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((it) => it.product.id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  /* ----------------------------- UI Rendering ----------------------------- */

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero / Banner */}
        <section className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold">Discover modern essentials</h1>
            <p className="mt-2 text-indigo-100">Quality products curated for everyday life. Shop with fast shipping and easy returns.</p>
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                className="px-4 py-2 rounded bg-white text-indigo-600 font-semibold"
              >
                Shop Now
              </button>
              <button
                onClick={() => alert('Open deals (demo)')}
                className="px-3 py-2 rounded border border-white text-white text-sm"
              >
                Today's deals
              </button>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-6">
            <div className="bg-white rounded-lg p-4 text-gray-700">
              <div className="text-sm">Free shipping</div>
              <div className="text-lg font-semibold">On orders over $50</div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1">
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="placeholder-gray-400 w-full rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search products, categories, brands..."
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-sm">
                  ⌕
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded border border-gray-200 bg-white py-2 px-3 text-sm"
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded border border-gray-200 bg-white py-2 px-3 text-sm"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="rating">Rating</option>
              </select>

              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-2 rounded bg-indigo-600 text-white text-sm"
              >
                Cart ({cart.reduce((s, it) => s + it.quantity, 0)})
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section>
          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : visibleProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={(prod) => handleAddToCart(prod, 1)}
                  onQuickView={(prod) => setQuickProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick view modal */}
        {quickProduct && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={() => setQuickProduct(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
            >
              <div className="p-4 flex items-start space-x-4">
                <div className="w-40 h-40 bg-gray-50 flex items-center justify-center rounded">
                  {quickProduct.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={quickProduct.image} alt={quickProduct.title} className="object-contain h-full" />
                  ) : (
                    <div className="text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{quickProduct.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{quickProduct.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold">${quickProduct.price.toFixed(2)}</div>
                    <div>
                      <button
                        onClick={() => {
                          handleAddToCart(quickProduct)
                          setQuickProduct(null)
                        }}
                        className="px-4 py-2 rounded bg-indigo-600 text-white"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setQuickProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close quick view"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClear={handleClearCart}
      />
    </div>
  )
}