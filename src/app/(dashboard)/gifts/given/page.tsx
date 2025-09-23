'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Gift } from '@/services/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Gift as GiftIcon,
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Image as ImageIcon,
  Package,
  Clock,
  Check,
  Heart
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function GivenGiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pledged' | 'purchased'>('all')
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadGivenGifts()
  }, [])

  const loadGivenGifts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getGivenGifts()
      setGifts(data)
    } catch (error) {
      console.error('Error loading given gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsPurchased = async (giftId: number) => {
    try {
      setProcessingIds(prev => new Set([...prev, giftId]))
      await apiService.markGiftAsPurchased(giftId)
      toast.success('Gift marked as purchased! 📦')
      await loadGivenGifts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update gift status')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(giftId)
        return newSet
      })
    }
  }

  const filteredGifts = gifts.filter(gift => {
    if (filter === 'pledged') return gift.status === 'pledged'
    if (filter === 'purchased') return gift.status === 'purchased'
    return true
  })

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/gifts')}
            leftIcon={<ArrowLeft size={18} />}
          >
            Back to Gifts
          </Button>
          <div>
            <h1 className="text-3xl font-lato font-black text-warm-800">
              Given Gifts 🎁
            </h1>
            <p className="text-warm-600">
              Track all the joy you've shared with friends and family
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-2 border-2 border-brand-200 shadow-lg">
          {[
            { key: 'all', label: 'All Gifts', icon: GiftIcon },
            { key: 'pledged', label: 'Pledged', icon: Clock },
            { key: 'purchased', label: 'Purchased', icon: Check }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'pledged' | 'purchased')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-inter font-semibold transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-xl transform scale-105'
                  : 'text-warm-700 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <GiftIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            {gifts.length}
          </h3>
          <p className="text-sm text-warm-600 font-medium">Total Gifts</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            {gifts.filter(g => g.status === 'pledged').length}
          </h3>
          <p className="text-sm text-warm-600 font-medium">Pledged</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            {gifts.filter(g => g.status === 'purchased').length}
          </h3>
          <p className="text-sm text-warm-600 font-medium">Purchased</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-lato font-black text-warm-800">
            {gifts.filter(g => g.message).length}
          </h3>
          <p className="text-sm text-warm-600 font-medium">With Messages</p>
        </Card>
      </div>

      {/* Gifts List */}
      <AnimatePresence mode="wait">
        {filteredGifts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <GiftIcon className="w-20 h-20 text-warm-300 mx-auto mb-6" />
              <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
                No gifts {filter === 'all' ? 'given yet' : filter}
              </h3>
              <p className="text-warm-500 max-w-md mx-auto mb-8">
                {filter === 'all' 
                  ? "Start spreading joy by pledging gifts for your friends' events. Browse their wishlists to find perfect presents!"
                  : `No ${filter} gifts found. Try switching to a different filter.`
                }
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/events')}
                rightIcon={<GiftIcon size={18} />}
              >
                Browse Friends' Events
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="gifts-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredGifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-lato font-bold text-warm-800 mb-2">
                        {gift.item.title}
                      </h3>
                      
                      {gift.item.description && (
                        <p className="text-warm-600 text-sm mb-2">
                          {gift.item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-warm-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>For: {gift.recipient.name}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(gift.event.date)}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-warm-500 mt-1">
                        Event: {gift.event.title}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      gift.status === 'purchased' 
                        ? 'bg-nature-100 text-nature-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {gift.status === 'purchased' ? 'Purchased' : 'Pledged'}
                    </div>
                  </div>

                  {/* Gift Details */}
                  <div className="space-y-4">
                    {/* Timestamps */}
                    <div className="text-xs text-warm-500 space-y-1">
                      <p>Pledged: {formatDate(gift.pledgedAt)}</p>
                      {gift.purchasedAt && (
                        <p>Purchased: {formatDate(gift.purchasedAt)}</p>
                      )}
                    </div>

                    {/* Message */}
                    {gift.message && (
                      <div className="p-3 bg-ocean-50 rounded-2xl border border-ocean-200">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-ocean-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-ocean-700 text-sm font-semibold mb-1">Your Message:</p>
                            <p className="text-ocean-600 text-sm italic">"{gift.message}"</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Photo Indicator */}
                    {gift.hasImage && (
                      <div className="flex items-center space-x-2 text-sm text-warm-600">
                        <ImageIcon className="w-4 h-4" />
                        <span>Photo included with gift</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {gift.status === 'pledged' && (
                    <div className="mt-6 pt-4 border-t border-warm-200">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkAsPurchased(gift.id)}
                        isLoading={processingIds.has(gift.id)}
                        leftIcon={<Package size={16} />}
                        className="w-full"
                      >
                        Mark as Purchased
                      </Button>
                    </div>
                  )}

                  {gift.status === 'purchased' && (
                    <div className="mt-6 pt-4 border-t border-warm-200">
                      <div className="flex items-center justify-center space-x-2 text-nature-600">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Gift Successfully Delivered!</span>
                      </div>
                    </div>
                  )}
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
              <GiftIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-lato font-bold text-warm-800 mb-2">
                Gift Giving Tips
              </h3>
              <p className="text-warm-600 text-sm">
                Remember to mark gifts as purchased once you've bought them! This helps keep track of your gift-giving 
                and ensures the recipient knows they have a surprise waiting. You can also add photos and personal messages 
                to make your gifts extra special.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}