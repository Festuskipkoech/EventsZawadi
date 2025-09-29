'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Event } from '@/services/api'
import { getDaysUntil, formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Calendar, 
  Gift,
  Users,
  Edit3,
  Trash2,
  ArrowLeft,
  Plus,
  Eye,
  MoreVertical,
  Share2,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

export async function generateStaticParams() {
  // Return empty array - events are user-specific and created dynamically
  return [];
}
export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.eventId as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  useEffect(() => {
    if (eventId) {
      loadEventDetails()
    }
  }, [eventId])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowActionsMenu(false)
    if (showActionsMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showActionsMenu])

  const loadEventDetails = async () => {
    try {
      setLoading(true)
      const events = await apiService.getMyEvents()
      const foundEvent = events.find(e => e.id.toString() === eventId)
      
      if (foundEvent) {
        setEvent(foundEvent)
        setIsOwner(true)
      } else {
        const friendsEvents = await apiService.getFriendsEvents()
        const friendEvent = friendsEvents.find(e => e.id.toString() === eventId)
        if (friendEvent) {
          setEvent(friendEvent as Event)
          setIsOwner(false)
        }
      }
    } catch (error) {
      console.error('Error loading event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: number, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This will also delete all wishlist items and cannot be undone.`)) {
      return
    }

    try {
      await apiService.deleteEvent(eventId)
      toast.success('Event deleted successfully')
      router.push('/events')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event')
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

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-warm-300 mx-auto mb-6" />
          <h2 className="text-2xl font-lato font-bold text-warm-600 mb-4">
            Event Not Found
          </h2>
          <p className="text-warm-500 mb-6">
            This event doesn't exist or you don't have access to view it.
          </p>
          <Button variant="primary" onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </Card>
      </div>
    )
  }

  const daysUntil = getDaysUntil(event.eventDate)
  const isPast = daysUntil <= 0
  const hasItems = (event.wishlistItemsCount || 0) > 0

  return (
    <div className="space-y-6 pb-8 w-full lg:max-w-5xl lg:mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/events')}
          leftIcon={<ArrowLeft size={18} />}
          className="mb-2"
        >
          Back to Events
        </Button>

        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-lato font-black text-warm-800 mb-2 break-words">
              {event.title}
            </h1>
            
            {/* Show owner info if not owner */}
            {!isOwner && event.owner && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-sm">
                  {event.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-brand-600 font-semibold">
                    {event.owner.name}'s Event
                  </p>
                  <p className="text-warm-500 text-sm">
                    {event.owner.email}
                  </p>
                </div>
              </div>
            )}
            
            <p className="text-warm-600 mb-1 text-lg">
              {formatDate(event.eventDate)}
            </p>
            <p className="text-warm-500">
              {event.eventType}
            </p>
          </div>
          
          {/* Desktop Actions */}
          {isOwner && (
            <div className="hidden md:flex space-x-2 flex-shrink-0">
              {/* <Button variant="secondary" size="sm" leftIcon={<Share2 size={16} />}>
                Share
              </Button> */}
              <Link href={`/events/${event.id}/edit`}>
                <Button variant="outline" size="sm" leftIcon={<Edit3 size={16} />}>
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Trash2 size={16} />}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => handleDeleteEvent(event.id, event.title)}
              >
                Delete
              </Button>
            </div>
          )}

          {/* Mobile Actions - Fixed positioning */}
          {isOwner && (
            <div className="md:hidden relative z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActionsMenu(!showActionsMenu)
                }}
                leftIcon={<MoreVertical size={18} />}
              />
              
              <AnimatePresence>
                {showActionsMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-warm-200 py-2 overflow-visible"
                    style={{ zIndex: 9999 }}
                  >
                    {/* <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-warm-50 transition-colors text-left">
                      <Share2 size={16} className="text-brand-500" />
                      <span className="text-warm-700">Share</span>
                    </button> */}
                    <Link href={`/events/${event.id}/edit`}>
                      <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-warm-50 transition-colors text-left">
                        <Edit3 size={16} className="text-ocean-500" />
                        <span className="text-warm-700">Edit</span>
                      </button>
                    </Link>
                    <button 
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-left" 
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                      <span className="text-red-600">Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Status and Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Desktop: Single row */}
        <div className="hidden md:block">
          <Card className="p-6 overflow-visible">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isPast 
                    ? 'bg-warm-100 text-warm-600' 
                    : daysUntil <= 7 
                    ? 'bg-red-100 text-red-700' 
                    : daysUntil <= 30 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isPast ? 'Past Event' : `${daysUntil} days to go`}
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-lato font-black text-warm-800">{event.wishlistItemsCount || 0}</p>
                    <p className="text-sm text-warm-600 font-medium">Wishlist Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-lato font-black text-warm-800">{event.giftsReceivedCount || 0}</p>
                    <p className="text-sm text-warm-600 font-medium">Gifts Pledged</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {hasItems ? (
                  <Link href={`/events/${eventId}/wishlist`}>
                    <Button variant="outline" leftIcon={<Eye size={18} />}>
                      View Wishlist
                    </Button>
                  </Link>
                ) : isOwner ? (
                  <Link href={`/events/${eventId}/wishlist`}>
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                      Add Items
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>
                    No Items Yet
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile: Summary card */}
        <div className="md:hidden">
          <Card className="p-5 overflow-visible">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-lato font-bold text-warm-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-500" />
                Event Summary
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPast 
                  ? 'bg-warm-100 text-warm-600' 
                  : daysUntil <= 7 
                  ? 'bg-red-100 text-red-700' 
                  : daysUntil <= 30 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {isPast ? 'Past' : `${daysUntil} days`}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-lato font-black text-warm-800 leading-none">
                  {event.wishlistItemsCount || 0}
                </p>
                <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                  Wishlist Items
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-nature-500 to-nature-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-xl font-lato font-black text-warm-800 leading-none">
                  {event.giftsReceivedCount || 0}
                </p>
                <p className="text-xs font-inter font-semibold text-warm-600 leading-tight">
                  Gifts Pledged
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-warm-200">
              {hasItems ? (
                <Link href={`/events/${eventId}/wishlist`}>
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Eye size={16} />}>
                    View Wishlist
                  </Button>
                </Link>
              ) : isOwner ? (
                <Link href={`/events/${eventId}/wishlist`}>
                  <Button variant="primary" size="sm" className="w-full" leftIcon={<Plus size={16} />}>
                    Add Wishlist Items
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  No Wishlist Items
                </Button>
              )}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Event Description */}
      {event.description && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 overflow-visible">
            <h2 className="text-xl font-lato font-bold text-warm-800 mb-4">
              About This Event
            </h2>
            <p className="text-warm-600 leading-relaxed">
              {event.description}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Wishlist Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 overflow-visible">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-lato font-bold text-warm-800 flex items-center">
              <Gift className="w-6 h-6 mr-2 text-brand-500" />
              Wishlist
            </h2>
          </div>

          {!hasItems ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-warm-300 mx-auto mb-4" />
              <h3 className="font-semibold text-warm-600 mb-2">
                {isOwner ? 'No items in your wishlist yet' : 'No wishlist items yet'}
              </h3>
              <p className="text-warm-500 text-sm mb-4">
                {isOwner 
                  ? "Start adding items to help your friends choose the perfect gifts!"
                  : "The wishlist is being prepared. Check back soon!"
                }
              </p>
              {isOwner && (
                <Link href={`/events/${eventId}/wishlist`}>
                  <Button variant="primary" rightIcon={<Plus size={18} />}>
                    Add First Item
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-warm-600 mb-4">
                This wishlist contains {event.wishlistItemsCount} item{event.wishlistItemsCount !== 1 ? 's' : ''}
              </p>
              <Link href={`/events/${eventId}/wishlist`}>
                <Button variant="primary" rightIcon={<Eye size={18} />}>
                  View Full Wishlist
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}