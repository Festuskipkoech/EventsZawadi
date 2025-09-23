'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService } from '@/services/api'
import { getInitials, formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  UserPlus, 
  ArrowLeft,
  Check,
  X,
  Clock,
  Users,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FriendRequest {
  id: number
  requester: {
    id: number
    name: string
    email: string
    friendCode: string
  }
  status: string
  createdAt: string
}

export default function FriendRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await apiService.getFriendRequests()
      setRequests(data)
    } catch (error) {
      console.error('Error loading friend requests:', error)
      toast.error('Failed to load friend requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: number) => {
    try {
      setProcessingIds(prev => new Set([...prev, requestId]))
      await apiService.acceptFriendRequest(requestId)
      await loadRequests()
      toast.success('Friend request accepted! 🤝')
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleDeclineRequest = async (requestId: number) => {
    try {
      setProcessingIds(prev => new Set([...prev, requestId]))
      // await apiService.declineFriendRequest(requestId)
      await loadRequests()
      toast.success('Friend request declined')
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline request')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin-slow w-12 h-12 text-brand-500">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/friends')}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to Friends
        </Button>
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800">
            Friend Requests 📨
          </h1>
          <p className="text-warm-600">
            Manage incoming friend requests and grow your gifting circle
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            {requests.length}
          </h3>
          <p className="text-sm text-warm-600 font-medium">Pending Requests</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            0
          </h3>
          <p className="text-sm text-warm-600 font-medium">Total Friends</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            0
          </h3>
          <p className="text-sm text-warm-600 font-medium">This Week</p>
        </Card>
      </div>

      {/* Friend Requests */}
      <AnimatePresence mode="wait">
        {requests.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <UserPlus className="w-20 h-20 text-warm-300 mx-auto mb-6" />
              <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
                No Friend Requests
              </h3>
              <p className="text-warm-500 mb-8 max-w-md mx-auto">
                You don't have any pending friend requests right now. 
                Share your friend code or links to connect with others!
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/friends')}
                rightIcon={<Users size={18} />}
              >
                Back to Friends
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="requests-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Requester Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {getInitials(request.requester.name)}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-lato font-bold text-warm-800 mb-1">
                          {request.requester.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-warm-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{request.requester.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>@{request.requester.friendCode}</span>
                          </div>
                        </div>
                        <p className="text-xs text-warm-500 mt-1">
                          Sent {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeclineRequest(request.id)}
                        isLoading={processingIds.has(request.id)}
                        leftIcon={<X size={16} />}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Decline
                      </Button>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id)}
                        isLoading={processingIds.has(request.id)}
                        leftIcon={<Check size={16} />}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-r from-brand-50 to-ocean-50 border-2 border-brand-200">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-lato font-bold text-warm-800 mb-2">
                Growing Your Circle
              </h3>
              <p className="text-warm-600 text-sm">
                When you accept friend requests, those people will be able to view your events and pledge gifts for your celebrations. 
                Similarly, you'll be able to see their events and surprise them with thoughtful gifts!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
