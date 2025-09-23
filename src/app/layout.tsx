
import type { Metadata } from 'next'
import { Inter, Lato } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lato = Lato({ 
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Events Zawadi - Magical Gift Lists',
  description: 'Create wishlists, connect with friends, and make gift-giving magical with GiftWish',
  keywords: 'wishlist, gifts, birthday, wedding, friends, gift list',
  authors: [{ name: 'GiftWish Team' }],
  creator: 'Events Zawadi',
  publisher: 'Events Zawadi',
  robots: 'index, follow',
  openGraph: {
    title: 'GiftWish - Magical Gift Lists',
    description: 'Create wishlists, connect with friends, and make gift-giving magical',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'GiftWish',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GiftWish - Magical Gift Lists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GiftWish - Magical Gift Lists',
    description: 'Create wishlists, connect with friends, and make gift-giving magical',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#f97316',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/shortcut-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable}`}>
      <body className="font-inter antialiased min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
        <AuthProvider>
          {/* Background decorations */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/20 to-ocean-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-nature-400/20 to-brand-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-ocean-400/10 to-nature-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(249, 115, 22, 0.2)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#84cc16',
                  secondary: '#ffffff',
                },
                style: {
                  border: '2px solid rgba(132, 204, 22, 0.3)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}