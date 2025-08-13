'use client'

import React, { useId, useState, FormEvent } from 'react'
import Link from 'next/link'

interface FooterProps {
  className?: string
  showNewsletter?: boolean
  onSubscribe?: (email: string) => void | Promise<void>
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Footer: React.FC<FooterProps> = ({
  className = '',
  showNewsletter = true,
  onSubscribe,
}) => {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!EMAIL_REGEX.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      // Optionally allow parent to handle subscription
      if (onSubscribe) {
        await onSubscribe(email)
        setStatus('success')
        setMessage('Subscribed successfully. Check your inbox!')
        setEmail('')
        return
      }

      // Default: POST to /api/newsletter
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        const errMsg =
          err?.message ||
          'Something went wrong while subscribing. Please try again later.'
        setStatus('error')
        setMessage(errMsg)
        return
      }

      setStatus('success')
      setMessage('Subscribed successfully. Check your inbox!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again later.')
    }
  }

  return (
    <footer className={`bg-gray-900 text-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <span className="sr-only">E-Shop</span>
              <svg
                className="h-8 w-8 text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M3 7h18l-2 11H5L3 7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
                <path
                  d="M16 5a2 2 0 11-4 0 2 2 0 014 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-3 text-lg font-semibold">E-Shop</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Hand-picked products, fast shipping, easy returns. Built for
              shoppers who want quality and speed.
            </p>

            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8.5v-3h2V9.5c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
                </svg>
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M22 5.8c-.6.3-1.2.5-1.9.6a3.3 3.3 0 001.4-1.8c-.7.4-1.5.7-2.3.9A3.3 3.3 0 0016.1 4c-1.8 0-3.2 1.6-2.8 3.4A9.4 9.4 0 013 4.8a3.3 3.3 0 001 4.4 3.2 3.2 0 01-1.5-.4v.1c0 1.5 1.1 2.8 2.6 3.1-.5.2-1 .2-1.6.1.4 1.3 1.6 2.2 3 2.2A6.7 6.7 0 012 19.5 9.5 9.5 0 008 21c5 0 7.8-4.1 7.8-7.8v-.4c.5-.4 1-1 1.3-1.6-.4.2-.9.3-1.3.4z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 6.5h.01"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Shop
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li>
                  <Link href="/collections" className="hover:text-white">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="hover:text-white">
                    Sale
                  </Link>
                </li>
                <li>
                  <Link href="/gift-cards" className="hover:text-white">
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-white">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Contact
            </h3>
            <address className="not-italic mt-4 text-sm text-gray-300 space-y-2">
              <div>123 Commerce St.</div>
              <div>Suite 100</div>
              <div>San Francisco, CA 94103</div>
              <div className="mt-2">
                <a
                  href="tel:+14155551234"
                  className="hover:text-white inline-block"
                >
                  +1 (415) 555-1234
                </a>
              </div>
              <div>
                <a
                  href="mailto:hello@eshop.example"
                  className="hover:text-white inline-block"
                >
                  hello@eshop.example
                </a>
              </div>
            </address>

            <div className="mt-6">
              <h4 className="text-xs uppercase text-gray-400 tracking-wider">
                We accept
              </h4>
              <div className="mt-3 flex items-center space-x-3">
                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center">
                  <span className="sr-only">Visa</span>
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M3 4h18v16H3z" />
                  </svg>
                </div>
                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center">
                  <span className="sr-only">Mastercard</span>
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <circle cx="9" cy="12" r="4" />
                    <circle cx="15" cy="12" r="4" />
                  </svg>
                </div>
                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center">
                  <span className="sr-only">PayPal</span>
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M7 7h10v10H7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showNewsletter && (
          <div className="mt-10 border-t border-gray-800 pt-8">
            <div className="max-w-3xl">
              <h3 className="text-lg font-semibold text-gray-100">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Get updates on new products, sales and more — delivered to your
                inbox once a week.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <label htmlFor={`${id}-email`} className="sr-only">
                  Email address
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  aria-required
                  className="min-w-0 w-full sm:flex-1 rounded-md border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-60 transition-colors"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              <div
                role="status"
                aria-live="polite"
                className="mt-3 min-h-[1.25rem] text-sm"
              >
                {message && (
                  <p
                    className={`${
                      status === 'error'
                        ? 'text-red-400'
                        : status === 'success'
                        ? 'text-green-400'
                        : 'text-gray-300'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} E-Shop. All rights reserved.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <span className="hidden sm:inline">|</span>
              <Link href="/sitemap.xml" className="hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer