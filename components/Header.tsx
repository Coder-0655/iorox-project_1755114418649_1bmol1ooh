"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  href?: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  cartItemCount?: number;
  categories?: Category[];
  user?: User | null;
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "all", name: "All Products", href: "/shop" },
  { id: "new", name: "New Arrivals", href: "/shop/new" },
  { id: "sale", name: "Sale", href: "/shop/sale" },
];

export default function Header({
  logoSrc = "/logo.png",
  logoAlt = "Store logo",
  cartItemCount = 0,
  categories = DEFAULT_CATEGORIES,
  user = null,
  onSearch,
  onSignOut,
  onSignIn,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const profileRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Click outside to close profile & mobile menus
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    // If parent provided handler, call it; otherwise navigate to /search
    if (onSearch) {
      onSearch(q);
    } else {
      // Use router to navigate to search results
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
    // Close mobile menu if open (mobile UX)
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              aria-label="Home"
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <span className="sr-only">Home</span>
              <span className="hidden sm:inline-block text-xl font-semibold text-gray-800">
                MyStore
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-2" aria-label="Primary">
              <Link
                href="/shop"
                className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Shop
              </Link>

              {/* Categories dropdown (simple hover) */}
              <div className="relative group">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={false}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded inline-flex items-center"
                >
                  Categories
                  <svg
                    className="ml-1 h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transform transition-all pointer-events-none group-hover:pointer-events-auto z-20">
                  <ul className="py-1">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={cat.href ?? `/category/${cat.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/about"
                className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Center: Search (desktop) */}
          <div className="flex-1 mx-4 hidden md:flex justify-center">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-xl"
              role="search"
              aria-label="Site search"
            >
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <input
                  id="site-search"
                  name="q"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Search products, brands and categories"
                  className="w-full border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                type="button"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative inline-flex items-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="View cart"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="7" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen((s) => !s)}
                type="button"
                aria-haspopup="true"
                aria-expanded={profileMenuOpen}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A11.955 11.955 0 0112 15c2.485 0 4.78.77 6.879 2.104M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
                <span className="hidden sm:inline-block text-sm text-gray-700">
                  {user ? user.name : "Account"}
                </span>
                <svg className="hidden sm:inline-block h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06L10.53 13a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {profileMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="Account options"
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-30"
                >
                  <div className="py-1">
                    {user ? (
                      <>
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                          My Account
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                          Orders
                        </Link>
                        <button
                          onClick={() => onSignOut?.()}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onSignIn?.()}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        >
                          Sign in
                        </button>
                        <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-2 pb-4">
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <form onSubmit={handleSearchSubmit} className="px-2">
                <div className="relative">
                  <input
                    type="search"
                    name="q"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search products"
                    className="w-full border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 focus:outline-none"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="px-2">
                <Link
                  href="/shop"
                  className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                >
                  Shop
                </Link>
                <div className="border-t border-gray-100"></div>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.href ?? `/category/${cat.id}`}
                    className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                >
                  Contact
                </Link>
              </div>

              <div className="px-2 border-t border-gray-100 pt-3">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <circle cx="7" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-auto text-sm bg-red-600 text-white rounded-full px-2 py-0.5">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onSignIn?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                    >
                      Sign in
                    </button>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 rounded text-base text-gray-700 hover:bg-indigo-50"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}