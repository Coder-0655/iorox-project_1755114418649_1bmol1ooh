import React from "react";
import type { Metadata } from "next";
import "../app/globals.css";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Acme Shop",
    template: "%s | Acme Shop",
  },
  description:
    "Acme Shop — a modern, fast, and secure e-commerce storefront. Browse products, add to cart, and checkout with confidence.",
  applicationName: "Acme Shop",
  keywords: [
    "ecommerce",
    "shop",
    "store",
    "products",
    "acme",
    "shopping",
    "cart",
    "checkout",
  ],
  authors: [{ name: "Acme Inc.", url: "https://example.com" }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Acme Shop",
    description:
      "Discover great products at Acme Shop. Fast shipping, secure payments, and exceptional service.",
    url: "https://example.com",
    siteName: "Acme Shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Acme Shop Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acme Shop",
    description:
      "Discover great products at Acme Shop. Fast shipping, secure payments, and exceptional service.",
    creator: "@acme",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout - Application root layout for the Next.js App Router.
 * - Provides HTML structure (<html>, <body>)
 * - Imports global styles and fonts
 * - Renders header, footer and the page content
 * - Adds accessibility helpers and responsive container
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head />
      <body className="antialiased bg-gray-50 text-gray-900 selection:bg-indigo-500 selection:text-white">
        {/* Skip link for keyboard users */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-md"
        >
          Skip to content
        </a>

        <div className="min-h-screen flex flex-col">
          <Header />

          <main
            id="content"
            className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            {children}
          </main>

          <Footer />
        </div>

        <noscript className="block text-center text-sm text-gray-600 py-4">
          JavaScript is disabled in your browser. Some features of this site may
          not work properly.
        </noscript>
      </body>
    </html>
  );
}