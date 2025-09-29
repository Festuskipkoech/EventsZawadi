'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Gift } from '@/services/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Gift as GiftIcon, 
  Heart,
  Package,
  Calendar,
  User,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  TrendingUp
} from 'lucide-react'

export default function GiftsPage() {
  const [receivedGifts, setReceivedGifts] = useState<Gift[]>([])
  const [givenGifts, setGivenGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')

  useEffect(() => {
    loadGifts()
  }, [])

  const loadGifts = async () => {
    try {
      setLoading(true)
      const [receivedData, givenData] = await Promise.all([
        apiService.getReceivedGifts().catch(() => []),
        apiService.getGivenGifts().catch(() => [])
      ])
      setReceivedGifts(receivedData)
      setGivenGifts(givenData)
    } catch (error) {
      console.error('Error loading gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const GiftCard = ({ gift, type }: { gift: Gift, type: 'received' | 'given' }) => {
    const isRevealed = type === 'received' && gift.event && new Date(gift.event.date) < new Date()
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-nature-50/30 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-lato font-bold text-warm-800 mb-2">
                  {type === 'received' && !isRevealed ? '🎁 Surprise Gift!' : gift.item.title}
                </h3>
                
                {gift.item.description && isRevealed && (
                  <p className="text-warm-600 text-sm mb-2">
                    {gift.item.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-warm-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(gift.event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GiftIcon className="w-4 h-4" />
                    <span>{gift.event.title}</span>
                  </div>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                gift.status === 'delivered' 
                  ? 'bg-nature-100 text-nature-700'
                  : gift.status === 'purchased'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {gift.status === 'delivered' ? 'Delivered' : 
                 gift.status === 'purchased' ? 'Purchased' : 'Pledged'}
              </div>
            </div>

            {/* Gift Details (only for revealed gifts) */}
            {isRevealed && (
              <div className="space-y-3">
                {type === 'received' && (
                  <div className="p-4 bg-gradient-to-r from-brand-50 to-ocean-50 rounded-2xl border border-brand-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-brand-500" />
                      <span className="font-semibold text-brand-700">
                        From: Secret Friend
                      </span>
                    </div>
                    
                    {gift.message && (
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-ocean-500 mt-1" />
                        <p className="text-warm-700 italic">
                          "{gift.message}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {gift.hasImage && (
                  <div className="flex items-center space-x-2 text-sm text-warm-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>Includes photo</span>
                  </div>
                )}
              </div>
            )}

            {/* Mystery Gift (for unrevealed received gifts) */}
            {type === 'received' && !isRevealed && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-nature-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-warm-600 font-medium mb-2">
                  Someone has prepared a gift for you! 
                </p>
                <p className="text-sm text-warm-500">
                  The surprise will be revealed after {formatDate(gift.event.date)}
                </p>
              </div>
            )}

            {/* Actions */}
            {type === 'given' && gift.status === 'pledged' && (
              <div className="mt-4 pt-4 border-t border-warm-200">
                <Button variant="primary" size="sm" leftIcon={<Package size={16} />}>
                  Mark as Purchased
                </Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    )
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

  const currentGifts = activeTab === 'received' ? receivedGifts : givenGifts
  const currentStats = activeTab === 'received' 
    ? {
        total: receivedGifts.length,
        revealed: receivedGifts.filter(g => g.event && new Date(g.event.date) < new Date()).length,
        awaiting: receivedGifts.filter(g => g.event && new Date(g.event.date) >= new Date()).length
      }
    : {
        total: givenGifts.length,
        pledged: givenGifts.filter(g => g.status === 'pledged').length,
        purchased: givenGifts.filter(g => g.status === 'purchased' || g.status === 'delivered').length
      }

  return (
    <div className="space-y-6">
      {/* Header with integrated tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
            Gifts 🎁
          </h1>
          <p className="text-warm-600">
            Track gifts you've given and the wonderful surprises you've received
          </p>
        </div>

        {/* Header Tabs */}
        <div className="mt-4 md:mt-0">
          <div className="inline-flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-warm-200">
            {[
              { key: 'received', label: 'Received', icon: Heart },
              { key: 'given', label: 'Given', icon: GiftIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'received' | 'given')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-inter font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
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

      </motion.div>

      {/* Stats - Desktop: Grid, Mobile: Summary Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Desktop Stats Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTab === 'received' ? (
              <>
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.total}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Total Received</p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.revealed}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Surprises Revealed</p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.awaiting}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Awaiting Surprise</p>
                </Card>
              </>
            ) : (
              <>
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.total}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Total Given</p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.pledged}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Pledged</p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-nature-500 to-nature-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-lato font-black text-warm-800">
                    {currentStats.purchased}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium">Purchased</p>
                </Card>
              </>
            )}
          </div>

          {/* Mobile Summary Card */}
          <div className="md:hidden">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-lato font-bold text-warm-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3 text-brand-500" />
                  {activeTab === 'received' ? 'Received Summary' : 'Given Summary'}
                </h3>
              </div>
              
              {activeTab === 'received' ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-nature-500 to-nature-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.total}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Total
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.revealed}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Revealed
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.awaiting}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Awaiting
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <GiftIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.total}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Total
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.pledged}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Pledged
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-nature-500 to-nature-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-lato font-black text-warm-800 leading-none">
                      {currentStats.purchased}
                    </p>
                    <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                      Purchased
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gifts List */}
      <AnimatePresence mode="wait">
        {currentGifts.length === 0 ? (
          <motion.div
            key={`empty-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-warm-200 to-warm-300 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'received' ? (
                  <Heart className="w-10 h-10 text-warm-500" />
                ) : (
                  <GiftIcon className="w-10 h-10 text-warm-500" />
                )}
              </div>
              <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
                {activeTab === 'received' ? 'No gifts received yet' : 'No gifts given yet'}
              </h3>
              <p className="text-warm-500 max-w-md mx-auto">
                {activeTab === 'received' 
                  ? "When friends pledge gifts for your events, they'll appear here. The surprises will be revealed after your event date!"
                  : "Start spreading joy by pledging gifts for your friends' events. Browse their wishlists to find the perfect presents!"
                }
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={`gifts-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {currentGifts.map((gift) => (
              <GiftCard 
                key={gift.id} 
                gift={gift} 
                type={activeTab} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}