// REPLACE src/app/(auth)/accept-friend/[token]/page.tsx with this fixed version:

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter} from 'next/navigation'
import { motion } from 'framer-motion'
import { apiService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { UserPlus, Users, CheckCircle, XCircle, Gift, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image';

interface RequesterInfo {
  name: string
  email: string
  friendCode: string
}

interface FriendRequestData {
  requester: RequesterInfo
  createdAt: string
  expiresAt: string
}
export async function generateStaticParams() {
  // Return empty array since friend tokens are generated dynamically
  // and cannot be pre-rendered
  return [];
}
export default function AcceptFriendPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const token = params?.token as string

  const [requestData, setRequestData] = useState<FriendRequestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?return=${returnUrl}`)
        return
      }
      loadRequestInfo()
    }
  }, [isAuthenticated, authLoading, token])

  const loadRequestInfo = async () => {
    if (!token) {
      setError('Invalid friend request link')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiService.getFriendRequestInfo(token)
      
      // Check if the token has expired based on expiresAt
      const now = new Date().getTime()
      const expires = new Date(data.expiresAt).getTime()
      
      if (expires <= now) {
        setError('This friend request link has expired. Please ask for a new one.')
      } else {
        setRequestData(data)
      }
    } catch (error: any) {
      setError(error.message || 'Invalid or expired friend request link')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!token) return

    try {
      setAccepting(true)
      await apiService.acceptFriendRequestViaToken(token)
      
      setAccepted(true)
      
      setTimeout(() => {
        router.push('/friends')
      }, 3000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request')
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = () => {
    router.push('/friends')
  }

  const getTimeRemaining = () => {
    if (!requestData?.expiresAt) return null
    
    const now = new Date().getTime()
    const expires = new Date(requestData.expiresAt).getTime()
    const diff = expires - now
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} remaining`
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    
    return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`
  }

  const isTokenExpired = () => {
    if (!requestData?.expiresAt) return false
    const now = new Date().getTime()
    const expires = new Date(requestData.expiresAt).getTime()
    return expires <= now
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow w-12 h-12 text-brand-500 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-warm-600 font-medium">Loading friend request...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 text-center max-w-md">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-lato font-bold text-warm-800 mb-4">
              {error.includes('expired') ? 'Link Expired' : 'Invalid Link'}
            </h2>
            <p className="text-warm-600 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <Button variant="primary" onClick={() => router.push('/friends')}>
                Go to Friends
              </Button>
              <Button variant="outline" onClick={() => router.push('/friends')}>
                Add Friends Manually
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <Card className="p-8 text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', duration: 0.4 }}
            >
              <CheckCircle className="w-16 h-16 text-nature-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-lato font-bold text-warm-800 mb-4">
              Welcome to the Circle! 🎉
            </h2>
            <p className="text-warm-600 mb-6">
              You're now connected with {requestData?.requester.name}. Start sharing the joy of gift-giving!
            </p>
            <div className="text-sm text-warm-500 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Redirecting to friends page...</span>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!requestData) return null

  const timeRemaining = getTimeRemaining()
  const isExpiring = timeRemaining?.includes('minute') || timeRemaining === 'Expired'
  const expired = isTokenExpired()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-brand-400/30 to-ocean-400/30 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-nature-400/30 to-brand-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Card className="p-8 max-w-md text-center">
          {/* Header */}
          <div className="mb-8">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-brand-500 to-ocean-500 rounded-3xl flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
              Friend Request
            </h1>
            <p className="text-warm-600">
              Someone wants to connect with you!
            </p>
          </div>

          {/* Expiry Warning */}
          {timeRemaining && !expired && (
            <div className={`mb-6 p-3 rounded-xl border flex items-center space-x-2 ${
              isExpiring 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              {isExpiring ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Clock className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{timeRemaining}</span>
            </div>
          )}

          {/* Expired Warning */}
          {expired && (
            <div className="mb-6 p-3 rounded-xl border bg-red-50 border-red-200 text-red-700 flex items-center space-x-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">This request has expired</span>
            </div>
          )}

          {/* Requester Info */}
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-50 to-ocean-50 rounded-2xl border border-brand-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
              {getInitials(requestData.requester.name)}
            </div>
            <h3 className="text-xl font-lato font-bold text-warm-800 mb-2">
              {requestData.requester.name}
            </h3>
            <p className="text-warm-600 text-sm mb-1">
              {requestData.requester.email}
            </p>
            <p className="text-warm-500 text-xs">
              Friend Code: @{requestData.requester.friendCode}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAccept}
              isLoading={accepting}
              leftIcon={<Users size={20} />}
              disabled={expired}
            >
              {expired ? 'Request Expired' : 'Accept Friend Request'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleDecline}
              disabled={accepting}
            >
              {expired ? 'Go Back' : 'Not Now'}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-warm-500 text-sm">
              <Gift className="w-4 h-4" />
              <span>Start sharing magical moments together</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}