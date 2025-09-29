'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Gift } from '@/services/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Heart,
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  EyeOff,
  Eye,
  TrendingUp
} from 'lucide-react'

export default function ReceivedGiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'revealed' | 'hidden'>('all')

  useEffect(() => {
    loadReceivedGifts()
  }, [])

  const loadReceivedGifts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getReceivedGifts()
      setGifts(data)
    } catch (error) {
      console.error('Error loading received gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGifts = gifts.filter(gift => {
    const isRevealed = gift.event && new Date(gift.event.date) < new Date()
    
    if (filter === 'revealed') return isRevealed
    if (filter === 'hidden') return !isRevealed
    return true
  })

  const stats = {
    total: gifts.length,
    revealed: gifts.filter(g => g.event && new Date(g.event.date) < new Date()).length,
    hidden: gifts.filter(g => g.event && new Date(g.event.date) >= new Date()).length,
    withPhotos: gifts.filter(g => g.hasImage).length
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
        className="space-y-3"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/gifts')}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to Gifts
        </Button>
        
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
            Received Gifts
          </h1>
          <p className="text-warm-600">
            All the wonderful surprises you've received from friends
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="px-1">
        <div className="inline-flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-warm-200">
          {[
            { key: 'all', label: 'All', icon: Heart },
            { key: 'revealed', label: 'Revealed', icon: Eye },
            { key: 'hidden', label: 'Hidden', icon: EyeOff }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'revealed' | 'hidden')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-inter font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md'
                  : 'text-warm-700 hover:text-brand-600 hover:bg-white/70'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats - Desktop: 3 columns, Mobile: Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Desktop Stats */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-lato font-black text-warm-800">
              {stats.total}
            </h3>
            <p className="text-sm text-warm-600 font-medium">Total Gifts</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-lato font-black text-warm-800">
              {stats.revealed}
            </h3>
            <p className="text-sm text-warm-600 font-medium">Revealed</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <EyeOff className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-lato font-black text-warm-800">
              {stats.hidden}
            </h3>
            <p className="text-sm text-warm-600 font-medium">Surprises</p>
          </Card>
        </div>

        {/* Mobile Summary Card */}
        <div className="md:hidden">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-lato font-bold text-warm-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-500" />
                Summary
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-lato font-black text-warm-800 leading-none">
                  {stats.total}
                </p>
                <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                  Total
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-nature-500 to-nature-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-lato font-black text-warm-800 leading-none">
                  {stats.revealed}
                </p>
                <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                  Revealed
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <EyeOff className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-lato font-black text-warm-800 leading-none">
                  {stats.hidden}
                </p>
                <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                  Surprises
                </p>
              </div>
            </div>

            {stats.withPhotos > 0 && (
              <div className="mt-4 pt-4 border-t border-warm-200">
                <div className="flex items-center justify-center space-x-2 text-warm-600">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {stats.withPhotos} gift{stats.withPhotos !== 1 ? 's' : ''} with photos
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>

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
              <Heart className="w-16 h-16 md:w-20 md:h-20 text-warm-300 mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-lato font-bold text-warm-600 mb-4">
                No gifts {filter === 'all' ? 'yet' : filter === 'revealed' ? 'revealed yet' : 'hidden'}
              </h3>
              <p className="text-warm-500 max-w-md mx-auto text-sm md:text-base">
                {filter === 'all' 
                  ? "When friends pledge gifts for your events, they'll appear here. Create events and share them with friends to start receiving gifts!"
                  : filter === 'revealed'
                  ? "Revealed gifts will show up here after your events have passed. The surprises are worth the wait!"
                  : "Hidden gifts are surprises waiting for their event date. You'll see them after your celebrations!"
                }
              </p>
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
            {filteredGifts.map((gift, index) => {
              const isRevealed = gift.event && new Date(gift.event.date) < new Date()
              
              return (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-lato font-bold text-warm-800 mb-2">
                          {isRevealed ? gift.item.title : 'Surprise Gift!'}
                        </h3>
                        
                        {gift.item.description && isRevealed && (
                          <p className="text-warm-600 text-sm mb-2">
                            {gift.item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center flex-wrap gap-2 text-sm text-warm-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(gift.event.date)}</span>
                          </div>
                          <span>•</span>
                          <span className="truncate">{gift.event.title}</span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 flex-shrink-0 ml-2 ${
                        isRevealed 
                          ? 'bg-nature-100 text-nature-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {isRevealed ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span className="hidden sm:inline">{isRevealed ? 'Revealed' : 'Surprise'}</span>
                      </div>
                    </div>

                    {/* Gift Details (only for revealed gifts) */}
                    {isRevealed && (
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-brand-50 to-ocean-50 rounded-2xl border border-brand-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-brand-500" />
                            <span className="font-semibold text-brand-700">
                              From: Secret Friend
                            </span>
                          </div>
                          
                          {gift.message && (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 text-ocean-500 mt-1 flex-shrink-0" />
                              <p className="text-warm-700 italic text-sm">
                                "{gift.message}"
                              </p>
                            </div>
                          )}
                        </div>

                        {gift.hasImage && (
                          <div className="flex items-center justify-center p-4 bg-warm-50 rounded-2xl border-2 border-dashed border-warm-300">
                            <div className="text-center">
                              <ImageIcon className="w-8 h-8 text-warm-400 mx-auto mb-2" />
                              <p className="text-warm-600 text-sm font-medium">
                                Gift photo included
                              </p>
                              <p className="text-warm-500 text-xs">
                                Your friend shared a photo
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mystery Gift (for unrevealed gifts) */}
                    {!isRevealed && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-warm-600 font-medium mb-2">
                          Someone has prepared a gift for you! 
                        </p>
                        <p className="text-sm text-warm-500">
                          The surprise will be revealed on {formatDate(gift.event.date)}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}