'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-red-400/20 to-pink-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>

          {/* Error Message */}
          <h2 className="text-2xl font-lato font-black text-warm-800 mb-4">
            Oops! Something went wrong 😔
          </h2>
          
          <p className="text-warm-600 mb-6 leading-relaxed">
            We encountered an unexpected error while loading your magical experience. 
            Don't worry, we're here to help!
          </p>

          {/* Error Details (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={reset}
              leftIcon={<RefreshCw size={20} />}
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = '/'}
              leftIcon={<Home size={20} />}
            >
              Go Home
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-warm-200">
            <p className="text-xs text-warm-500">
              If the problem persists, please contact our support team.
              We're here to help make your gift-giving experience perfect! ✨
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
