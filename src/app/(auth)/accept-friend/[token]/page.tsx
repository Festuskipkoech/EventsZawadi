'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { UserPlus, Users, CheckCircle, XCircle, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

interface RequesterInfo {
  name: string
  email: string
  friendCode: string
}

export default function AcceptFriendPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const token = params?.token as string

  const [requesterInfo, setRequesterInfo] = useState<RequesterInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login with return URL
        router.push(`/login?return=${encodeURIComponent(window.location.pathname)}`)
        return
      }
      loadRequesterInfo()
    }
  }, [isAuthenticated, authLoading, token])

  const loadRequesterInfo = async () => {
    try {
      setLoading(true)
      // Call the API to get friend request info from token
      const info = await apiService.getFriendRequestInfo(token)
      setRequesterInfo(info.requester)
    } catch (error: any) {
      setError(error.message || 'Invalid or expired friend request link')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      setAccepting(true)
      await apiService.acceptFriendRequestViaToken(token)
      
      setAccepted(true)
      toast.success('Friend request accepted! 🎉')
      
      setTimeout(() => {
        router.push('/friends')
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request')
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = () => {
    router.push('/friends')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 text-brand-500">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-lato font-bold text-warm-800 mb-4">
            Invalid Link
          </h2>
          <p className="text-warm-600 mb-6">
            {error}
          </p>
          <Button variant="primary" onClick={() => router.push('/friends')}>
            Go to Friends
          </Button>
        </Card>
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
            <CheckCircle className="w-16 h-16 text-nature-500 mx-auto mb-4" />
            <h2 className="text-2xl font-lato font-bold text-warm-800 mb-4">
              Welcome to the Circle! 🎉
            </h2>
            <p className="text-warm-600 mb-6">
              You're now connected with {requesterInfo?.name}. Start sharing the joy of gift-giving!
            </p>
            <div className="text-sm text-warm-500">
              Redirecting to friends page...
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

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

          {/* Requester Info */}
          {requesterInfo && (
            <div className="mb-8 p-6 bg-gradient-to-r from-brand-50 to-ocean-50 rounded-2xl border border-brand-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                {getInitials(requesterInfo.name)}
              </div>
              <h3 className="text-xl font-lato font-bold text-warm-800 mb-2">
                {requesterInfo.name}
              </h3>
              <p className="text-warm-600 text-sm mb-1">
                {requesterInfo.email}
              </p>
              <p className="text-warm-500 text-xs">
                Friend Code: @{requesterInfo.friendCode}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAccept}
              isLoading={accepting}
              leftIcon={<Users size={20} />}
            >
              Accept Friend Request
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleDecline}
              disabled={accepting}
            >
              Not Now
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