'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  Share2,
  MoreVertical
} from 'lucide-react'
export async function generateStaticParams() {
  // Return empty array to skip pre-generation
  // Pages will be generated on-demand on the client side
  return []
}

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  // const params = useParams()
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
    <div className="max-w-4xl mx-auto space-y-6 w-full overflow-x-hidden pb-8">
      {/* Header with Back Button and Actions */}
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
            <h1 className="text-3xl font-lato font-black text-warm-800 mb-2 break-words">
              {event.title}
            </h1>
            <p className="text-warm-600 mb-1">
              {formatDate(event.eventDate)}
            </p>
            <p className="text-warm-500 text-sm">
              {event.eventType}
            </p>
          </div>

          {/* Desktop Actions */}
          {isOwner && (
            <div className="hidden md:flex space-x-2 flex-shrink-0">
              <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>
                Share
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Edit3 size={16} />}>
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                leftIcon={<Trash2 size={16} />}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          )}

          {/* Mobile Actions - Three Dots Menu */}
          {isOwner && (
            <div className="md:hidden relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                leftIcon={<MoreVertical size={18} />}
              />
              
              {showActionsMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-warm-200 py-2 z-50">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-warm-50 transition-colors text-left">
                    <Share2 size={16} className="text-brand-500" />
                    <span className="text-warm-700">Share</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-warm-50 transition-colors text-left">
                    <Edit3 size={16} className="text-ocean-500" />
                    <span className="text-warm-700">Edit</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-left">
                    <Trash2 size={16} className="text-red-500" />
                    <span className="text-red-600">Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Days Badge */}
        <div className="flex justify-start">
          <div className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
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
        </div>
      </motion.div>

      {/* Event Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Event Info Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-lato font-bold text-warm-800 mb-4">
              Event Details
            </h2>
            {event.description && (
              <p className="text-warm-600 leading-relaxed mb-6">
                {event.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-brand-50 rounded-2xl">
                <Calendar className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                <h3 className="font-semibold text-warm-800 mb-1 text-sm">Date</h3>
                <p className="text-sm text-warm-600">{formatDate(event.eventDate)}</p>
              </div>
              
              <div className="text-center p-4 bg-ocean-50 rounded-2xl">
                <Gift className="w-8 h-8 text-ocean-500 mx-auto mb-2" />
                <h3 className="font-semibold text-warm-800 mb-1 text-sm">Wishlist</h3>
                <p className="text-sm text-warm-600">{event.wishlistItemsCount || 0} items</p>
              </div>
              
              <div className="text-center p-4 bg-nature-50 rounded-2xl">
                <Users className="w-8 h-8 text-nature-500 mx-auto mb-2" />
                <h3 className="font-semibold text-warm-800 mb-1 text-sm">Pledged</h3>
                <p className="text-sm text-warm-600">{event.giftsReceivedCount || 0} gifts</p>
              </div>
            </div>
          </Card>

          {/* Wishlist Preview */}
          <Card className="p-6">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-lato font-bold text-warm-800 mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              {/* Smart Wishlist Action */}
              {isOwner ? (
                hasItems ? (
                  <Link href={`/events/${eventId}/wishlist`}>
                    <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Eye size={16} />}>
                      View Wishlist
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/events/${eventId}/wishlist`}>
                    <Button variant="primary" size="sm" className="w-full justify-start" leftIcon={<Plus size={16} />}>
                      Add Wishlist Items
                    </Button>
                  </Link>
                )
              ) : (
                hasItems ? (
                  <Link href={`/events/${eventId}/wishlist`}>
                    <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Eye size={16} />}>
                      View Wishlist
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                    No Wishlist Items
                  </Button>
                )
              )}
              
              {isOwner && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Share2 size={16} />}>
                    Share Event
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Edit3 size={16} />}>
                    Edit Event
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Event Stats */}
          <Card className="p-6 bg-gradient-to-br from-brand-50 to-ocean-50 border-2 border-brand-200">
            <h3 className="font-lato font-bold text-warm-800 mb-4">Event Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-warm-600 text-sm">Items Added</span>
                <span className="font-bold text-warm-800">{event.wishlistItemsCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-warm-600 text-sm">Gifts Pledged</span>
                <span className="font-bold text-warm-800">{event.giftsReceivedCount || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-warm-600 text-sm">Days Remaining</span>
                <span className="font-bold text-warm-800">
                  {isPast ? 'Past' : daysUntil}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}