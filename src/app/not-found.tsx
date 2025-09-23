'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Search, Home, ArrowLeft, Gift } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="p-8 text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="text-8xl font-lato font-black text-transparent bg-gradient-to-r from-brand-500 via-ocean-500 to-nature-500 bg-clip-text mb-4">
              404
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-xl"
            >
              <Search className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          {/* Message */}
          <h2 className="text-3xl font-lato font-black text-warm-800 mb-4">
            Page Not Found 🎁
          </h2>
          
          <p className="text-warm-600 mb-8 leading-relaxed">
            Looks like this page got lost in the gift wrapping! The page you're looking for 
            doesn't exist or may have been moved to a different location.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Home size={20} />}
              >
                Go to Homepage
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft size={20} />}
            >
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-warm-200">
            <h3 className="text-sm font-semibold text-warm-700 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/events">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Events
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Friends
                </Button>
              </Link>
              <Link href="/gifts">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Gifts
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-6">
            <p className="text-xs text-warm-500 flex items-center justify-center space-x-1">
              <Gift className="w-3 h-3" />
              <span>Let's get back to spreading joy!</span>
              <Gift className="w-3 h-3" />
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}