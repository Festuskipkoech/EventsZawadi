'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Event } from '@/services/api'
import { getDaysUntil, formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Calendar, 
  Plus, 
  Gift,
  Users,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search
} from 'lucide-react'
import Input from '@/components/Input'

export default function EventsPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [friendsEvents, setFriendsEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'mine' | 'friends'>('mine')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const [myEventsData, friendsEventsData] = await Promise.all([
        apiService.getMyEvents(),
        apiService.getFriendsEvents()
      ])
      setMyEvents(myEventsData)
      setFriendsEvents(friendsEventsData)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = (events: Event[]) => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Date filter
      const daysUntil = getDaysUntil(event.eventDate)
      let matchesFilter = true
      
      if (filter === 'upcoming') {
        matchesFilter = daysUntil > 0
      } else if (filter === 'past') {
        matchesFilter = daysUntil <= 0
      }
      
      return matchesSearch && matchesFilter
    })
  }

  const handleDeleteEvent = async (eventId: number, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This will also delete all wishlist items and cannot be undone.`)) {
      return
    }

    try {
      await apiService.deleteEvent(eventId)
      // Reload events list or redirect as needed
      if (typeof loadEvents === 'function') {
        await loadEvents() // For events page
      } else {
        router.push('/events') // For event details page
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event')
    }
  }


const EventCard = ({ event, isOwnEvent = false }: { event: Event, isOwnEvent?: boolean }) => {
  const daysUntil = getDaysUntil(event.eventDate)
  const isPast = daysUntil <= 0
  const hasItems = (event.wishlistItemsCount || 0) > 0
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="p-6 group relative overflow-hidden w-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-transparent to-ocean-50/50 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex-1 min-w-0">
              {/* Event Title */}
              <h3 className="text-xl font-lato font-bold text-warm-800 mb-2 group-hover:text-brand-600 transition-colors truncate">
                {event.title}
              </h3>
              
              {/* Owner Info - Show for friends' events */}
              {!isOwnEvent && event.owner && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-xs">
                    {event.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-brand-600">
                    {event.owner.name}'s Event
                  </p>
                </div>
              )}
              
              <p className="text-warm-600 text-sm mb-3">
                {formatDate(event.eventDate)} • {event.eventType}
              </p>
              {event.description && (
                <p className="text-warm-500 text-sm line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 ${
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

          {/* Stats */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Gift className="w-4 h-4 text-brand-500" />
              <span className="font-medium text-warm-700">
                {event.wishlistItemsCount || 0} items
              </span>
            </div>
            {!isOwnEvent && (
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-ocean-500" />
                <span className="font-medium text-warm-700">
                  Friend's Event
                </span>
              </div>
            )}
          </div>

          {/* Actions - Updated for friends' events */}
          <div className="space-y-3">
            {/* Edit/Delete only for owners */}
            {isOwnEvent && (
              <div className="flex items-center space-x-2">
                <Link href={`/events/${event.id}/edit`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full" leftIcon={<Edit3 size={16} />}>
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  leftIcon={<Trash2 size={16} />}
                  onClick={() => handleDeleteEvent(event.id, event.title)}
                >
                  Delete
                </Button>
              </div>
            )}

            {/* Primary Action - Updated for friends */}
            {isOwnEvent ? (
              hasItems ? (
                <Link href={`/events/${event.id}/wishlist`} className="block">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Eye size={16} />}>
                    View Wishlist
                  </Button>
                </Link>
              ) : (
                <Link href={`/events/${event.id}/wishlist`} className="block">
                  <Button variant="primary" size="sm" className="w-full" leftIcon={<Plus size={16} />}>
                    Add First Item
                  </Button>
                </Link>
              )
            ) : (
              hasItems ? (
                <Link href={`/events/${event.id}/wishlist`} className="block">
                  <Button variant="primary" size="sm" className="w-full" leftIcon={<Gift size={16} />}>
                    View Wishlist & Shop
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="sm" className="w-full" disabled>
                  No Items Yet
                </Button>
              )
            )}
          </div>
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

  const currentEvents = activeTab === 'mine' ? myEvents : friendsEvents
  const displayEvents = filteredEvents(currentEvents)

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Option A Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Title and Description with Create Button (Desktop) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
              Events 🎉
            </h1>
            <p className="text-warm-600">
              Manage your celebrations and browse friends' upcoming events
            </p>
          </div>
          
          {/* Desktop: Button on right */}
          <div className="hidden md:block flex-shrink-0">
            <Link href="/events/create">
              <Button variant="primary" rightIcon={<Plus size={20} />}>
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile: Centered Create Button */}
        <div className="md:hidden flex justify-center">
          <Link href="/events/create">
            <Button variant="primary" rightIcon={<Plus size={20} />}>
              Create Event
            </Button>
          </Link>
        </div>

        {/* Tabs - Centered on all devices */}
        <div className="flex justify-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-2 border-2 border-brand-200 shadow-lg">
            {[
              { key: 'mine', label: 'My Events' },
              { key: 'friends', label: 'Friends Events' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'mine' | 'friends')}
                className={`px-8 py-3 rounded-2xl font-inter font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-xl transform scale-105'
                    : 'text-warm-700 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters - All in one card, no side panel */}
      <Card className="p-6 w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          {/* Date Filter */}
          <div className="w-full lg:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
              className="w-full px-4 py-3 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center lg:justify-start text-warm-600">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </Card>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        {displayEvents.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center">
              <Calendar className="w-20 h-20 text-warm-300 mx-auto mb-6" />
              <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
                {activeTab === 'mine' ? 'No events yet' : 'No friends events'}
              </h3>
              <p className="text-warm-500 mb-8 max-w-md mx-auto">
                {activeTab === 'mine' 
                  ? "Create your first event and start building your perfect wishlist!"
                  : "Your friends haven't created any events yet. Invite them to join GiftWish!"
                }
              </p>
              {activeTab === 'mine' && (
                <Link href="/events/create">
                  <Button variant="primary" size="lg" rightIcon={<Plus size={20} />}>
                    Create Your First Event
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="events-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {displayEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isOwnEvent={activeTab === 'mine'} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}