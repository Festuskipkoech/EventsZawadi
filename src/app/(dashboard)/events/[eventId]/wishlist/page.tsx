'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService } from '@/services/api'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import { 
  Gift,
  Plus,
  ArrowLeft,
  ExternalLink,
  Star,
  Heart,
  Check,
  Package,
  Edit3,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: number
  title: string
  description?: string
  price?: number
  priority: number
  itemUrl?: string
  isPledged: boolean
  createdAt: string
  myPledge?: {
    id: number
    status: string
  }
  hasGift?: boolean
  gift?: {
    giverName: string
    message?: string
  }
}

interface WishlistData {
  event: {
    id: number
    title: string
    eventDate: string
    ownerName: string
    isOwnEvent: boolean
    hasEventPassed: boolean
  }
  items: WishlistItem[]
}

export default function WishlistPage() {
  const router = useRouter()
  const params=useParams()
  const eventId = params?.eventId as string
  
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    price: '',
    priority: 1,
    itemUrl: ''
  })

  useEffect(() => {
    if (eventId) {
      loadWishlist()
    }
  }, [eventId])

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const data = await apiService.getWishlist(parseInt(eventId))
      setWishlistData(data)
    } catch (error) {
      console.error('Error loading wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      const itemData = {
        title: newItem.title,
        description: newItem.description || undefined,
        price: newItem.price ? parseFloat(newItem.price) : undefined,
        priority: newItem.priority,
        itemUrl: newItem.itemUrl || undefined
      }
      
      await apiService.addWishlistItem(parseInt(eventId), itemData)
      toast.success('Item added to wishlist! 🎁')
      setShowAddItemModal(false)
      setNewItem({ title: '', description: '', price: '', priority: 1, itemUrl: '' })
      await loadWishlist()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item')
    }
  }

  const handlePledgeItem = async (itemId: number) => {
    try {
      await apiService.pledgeGift(itemId)
      await loadWishlist()
    } catch (error: any) {
      toast.error(error.message || 'Failed to pledge gift')
    }
  }

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return { icon: Star, color: 'text-gray-400', bg: 'bg-gray-100' }
      case 2: return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' }
      case 3: return { icon: Star, color: 'text-orange-500', bg: 'bg-orange-100' }
      case 4: return { icon: Star, color: 'text-red-500', bg: 'bg-red-100' }
      case 5: return { icon: Heart, color: 'text-purple-500', bg: 'bg-purple-100' }
      default: return { icon: Star, color: 'text-gray-400', bg: 'bg-gray-100' }
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

  if (!wishlistData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <Gift className="w-16 h-16 text-warm-300 mx-auto mb-6" />
          <h2 className="text-2xl font-lato font-bold text-warm-600 mb-4">
            Wishlist Not Found
          </h2>
          <p className="text-warm-500 mb-6">
            This wishlist doesn't exist or you don't have access to view it.
          </p>
          <Button variant="primary" onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </Card>
      </div>
    )
  }

  const { event, items } = wishlistData
  const isOwner = event.isOwnEvent
  const hasEventPassed = event.hasEventPassed

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header - Option A Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Back Button - Separate Row */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/events/${eventId}`)}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to Event
        </Button>

        {/* Title and Add Button Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-lato font-bold text-warm-800 break-words leading-tight">
              {event.title} Wishlist
            </h1>
            <p className="text-warm-600 text-sm mt-2">
              {isOwner ? 'Manage your wishlist items' : `${event.ownerName}'s wishlist`}
            </p>
          </div>

          {isOwner && !hasEventPassed && (
            <Button
              variant="primary"
              onClick={() => setShowAddItemModal(true)}
              rightIcon={<Plus size={20} />}
              className="flex-shrink-0"
            >
              Add Item
            </Button>
          )}
        </div>
      </motion.div>

      {/* Wishlist Items */}
      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <Gift className="w-20 h-20 text-warm-300 mx-auto mb-6" />
              <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
                {isOwner ? 'Your wishlist is empty' : 'No items in wishlist yet'}
              </h3>
              <p className="text-warm-500 mb-8 max-w-md mx-auto">
                {isOwner 
                  ? "Start adding items to help your friends choose the perfect gifts for you!"
                  : "The wishlist is being prepared. Check back soon for gift ideas!"
                }
              </p>
              {isOwner && !hasEventPassed && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowAddItemModal(true)}
                  rightIcon={<Plus size={20} />}
                >
                  Add Your First Item
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="items-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, index) => {
              const priorityInfo = getPriorityIcon(item.priority)
              const hasUrl = Boolean(item.itemUrl)
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full flex flex-col">
                    {/* Priority & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${priorityInfo.bg}`}>
                        <priorityInfo.icon size={14} className={priorityInfo.color} />
                        <span className={`text-xs font-medium ${priorityInfo.color}`}>
                          Priority {item.priority}
                        </span>
                      </div>
                      
                      {item.isPledged && !isOwner && (
                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Pledged
                        </div>
                      )}
                      
                      {isOwner && item.hasGift && !hasEventPassed && (
                        <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center">
                          <EyeOff size={12} className="mr-1" />
                          Surprise
                        </div>
                      )}
                      
                      {isOwner && item.gift && hasEventPassed && (
                        <div className="px-2 py-1 bg-nature-100 text-nature-700 rounded-full text-xs font-medium flex items-center">
                          <Eye size={12} className="mr-1" />
                          Revealed
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <h3 className="font-lato font-bold text-warm-800 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-warm-600 text-sm mb-3 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      
                      {item.price && (
                        <p className="text-brand-600 font-bold mb-3">
                          {formatCurrency(item.price)}
                        </p>
                      )}
                    </div>

                    {/* Gift Details (for owner after event) */}
                    {isOwner && item.gift && hasEventPassed && (
                      <div className="mb-4 p-3 bg-nature-50 rounded-xl border border-nature-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Gift className="w-4 h-4 text-nature-500" />
                          <span className="font-semibold text-nature-700 text-sm">
                            From: {item.gift.giverName}
                          </span>
                        </div>
                        {item.gift.message && (
                          <p className="text-nature-600 text-sm italic">
                            "{item.gift.message}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      {/* Owner Actions - Always show View button (disabled if no URL) */}
                      {isOwner && !hasEventPassed && (
                        <>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex-1"
                              leftIcon={<ExternalLink size={16} />}
                              onClick={() => hasUrl && window.open(item.itemUrl, '_blank')}
                              disabled={!hasUrl}
                            >
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1" leftIcon={<Edit3 size={16} />}>
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              leftIcon={<Trash2 size={16} />}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Friend Actions */}
                      {!isOwner && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            leftIcon={<ExternalLink size={16} />}
                            onClick={() => hasUrl && window.open(item.itemUrl, '_blank')}
                            disabled={!hasUrl}
                          >
                            View
                          </Button>
                          
                          {!item.isPledged && !hasEventPassed && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              leftIcon={<Gift size={16} />}
                              onClick={() => handlePledgeItem(item.id)}
                            >
                              Pledge
                            </Button>
                          )}
                          
                          {item.myPledge && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              leftIcon={item.myPledge.status === 'purchased' ? <Check size={16} /> : <Package size={16} />}
                              disabled={item.myPledge.status === 'purchased'}
                            >
                              {item.myPledge.status === 'purchased' ? 'Bought' : 'Mark'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false)
          setNewItem({ title: '', description: '', price: '', priority: 1, itemUrl: '' })
        }}
        title="Add Wishlist Item"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            type="text"
            label="Item Title"
            placeholder="e.g., Wireless Headphones"
            value={newItem.title}
            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            leftIcon={<Gift size={18} />}
            variant="floating"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-warm-700 font-inter">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe the item or specific preferences..."
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="Price (Optional)"
              placeholder="0.00"
              value={newItem.price}
              onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              variant="floating"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-700 font-inter">
                Priority
              </label>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none"
              >
                <option value={1}>1 - Low Priority</option>
                <option value={2}>2 - Medium Priority</option>
                <option value={3}>3 - High Priority</option>
                <option value={4}>4 - Very High Priority</option>
                <option value={5}>5 - Must Have!</option>
              </select>
            </div>
          </div>

          <Input
            type="url"
            label="Item URL (Optional)"
            placeholder="https://..."
            value={newItem.itemUrl}
            onChange={(e) => setNewItem(prev => ({ ...prev, itemUrl: e.target.value }))}
            leftIcon={<ExternalLink size={18} />}
            variant="floating"
          />

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowAddItemModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleAddItem}
              disabled={!newItem.title.trim()}
              rightIcon={<Plus size={18} />}
            >
              Add Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}