'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { apiService, Event } from '@/services/api'
import { getDaysUntil, formatDate } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Calendar, 
  Users, 
  Gift as GiftIcon, 
  Plus, 
  Clock,
  Heart,
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    totalFriends: 0,
    giftsGiven: 0,
    giftsReceived: 0
  })
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Function to get recent activity from notifications
  const getRecentActivity = () => {
    const notifications = apiService.getNotifications()
    
    return notifications.slice(0, 2).map(notification => {
      let icon = ''
      let message = notification.message
      
      switch (notification.type) {
        case 'friend_request':
          icon = '👥'
          message = `${notification.relatedUser?.name || 'Someone'} sent you a friend request`
          break
        case 'friend_request_response':
          icon = '🤝'
          break
        case 'gift_received':
          icon = '🎁'
          break
        case 'wishlist_threshold':
          icon = '📈'
          break
        default:
          icon = '🔔'
      }
      
      return {
        type: notification.type,
        message: message,
        time: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }),
        icon: icon
      }
    })
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [myEvents, friendsEvents, friends, givenGifts, receivedGifts] = await Promise.all([
        apiService.getMyEvents().catch(() => []),
        apiService.getFriendsEvents().catch(() => []),
        apiService.getFriends().catch(() => []),
        apiService.getGivenGifts().catch(() => []),
        apiService.getReceivedGifts().catch(() => [])
      ])

      // Calculate stats
      const upcoming = myEvents.filter(event => getDaysUntil(event.eventDate) > 0)
      setStats({
        upcomingEvents: upcoming.length,
        totalFriends: friends.length,
        giftsGiven: givenGifts.length,
        giftsReceived: receivedGifts.length
      })

      // Set upcoming events (next 3)
      const sortedUpcoming = [...upcoming, ...friendsEvents]
        .sort((a, b) => getDaysUntil(a.eventDate) - getDaysUntil(b.eventDate))
        .slice(0, 3)
      setUpcomingEvents(sortedUpcoming)

      // Get recent activity from notifications
      const activity = getRecentActivity()
      setRecentActivity(activity)

    } catch (error) {
      console.error('Dashboard loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to truncate text with blur effect
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) {
      return { text, isTruncated: false }
    }
    
    const truncated = text.substring(0, maxLength - 3) + '...'
    return { text: truncated, isTruncated: true }
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

  const statCards = [
    { 
      title: 'Upcoming Events', 
      value: stats.upcomingEvents, 
      icon: Calendar, 
      color: 'from-brand-500 to-brand-600',
      description: 'Events to celebrate'
    },
    { 
      title: 'Friends', 
      value: stats.totalFriends, 
      icon: Users, 
      color: 'from-ocean-500 to-ocean-600',
      description: 'In your circle'
    },
    { 
      title: 'Gifts Given', 
      value: stats.giftsGiven, 
      icon: GiftIcon, 
      color: 'from-nature-500 to-nature-600',
      description: 'Spreading joy'
    },
    { 
      title: 'Gifts Received', 
      value: stats.giftsReceived, 
      icon: Heart, 
      color: 'from-purple-500 to-pink-500',
      description: 'Magical surprises'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-lato font-black text-warm-800 mb-4">
          Welcome back, {user?.name?.split(' ')[0]}! ✨
        </h1>
        <p className="text-xl text-warm-600 font-inter">
          Here's what's happening in your magical gift world
        </p>
      </motion.div>

      {/* Stats - Desktop: Grid, Mobile: Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Desktop Stats Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:scale-105 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-lato font-black text-warm-800 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-inter font-semibold text-warm-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-warm-500">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Summary Card */}
        <div className="md:hidden">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-lato font-bold text-warm-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-brand-500" />
                Your Overview
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-lato font-black text-warm-800 leading-none">
                      {stat.value}
                    </p>
                    <p className="text-sm font-inter font-semibold text-warm-600 leading-tight">
                      {stat.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-lato font-bold text-warm-800 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-brand-500" />
                Upcoming Events
              </h2>
              <Link href="/events">
                <Button variant="ghost" size="sm" rightIcon={<Plus size={16} />}>
                  View All
                </Button>
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-warm-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-warm-600 mb-2">No upcoming events</h3>
                <p className="text-warm-500 mb-6">Create your first event to start receiving gifts!</p>
                <Link href="/events/create">
                  <Button variant="primary" rightIcon={<Plus size={18} />}>
                    Create Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => {
                  const daysUntil = getDaysUntil(event.eventDate)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-50 to-ocean-50 rounded-2xl border border-brand-200 hover:border-brand-400 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-lato font-bold text-warm-800 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-warm-600">
                          {formatDate(event.eventDate)} • {event.eventType}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">
                            {event.wishlistItemsCount || 0} items
                          </span>
                          {event.giftsReceivedCount && (
                            <span className="text-xs bg-nature-100 text-nature-700 px-2 py-1 rounded-full font-medium">
                              {event.giftsReceivedCount} pledged
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          daysUntil <= 7 
                            ? 'bg-red-100 text-red-700' 
                            : daysUntil <= 30 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {daysUntil} days
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-lato font-bold text-warm-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
              Quick Actions
            </h3>
            <div className="flex flex-col gap-4">
              <Link href="/events/create">
                <Button variant="primary" size="sm" className="w-full justify-start" leftIcon={<Calendar size={16} />}>
                  Create Event
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="secondary" size="sm" className="w-full justify-start" leftIcon={<Users size={16} />}>
                  Add Friends
                </Button>
              </Link>
              <Link href="/gifts/received">
                <Button variant="accent" size="sm" className="w-full justify-start" leftIcon={<GiftIcon size={16} />}>
                  View Gifts
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-lato font-bold text-warm-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-500" />
                Recent Activity
              </h3>
              {recentActivity.length > 0 && (
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                    View All
                  </Button>
                </Link>
              )}
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-warm-300 mx-auto mb-3" />
                <p className="text-warm-500 text-sm">No recent activity</p>
                <p className="text-xs text-warm-400 mt-1">Activity will appear here when you interact with friends</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const { text: displayText, isTruncated } = truncateText(activity.message, 50)
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-100 to-ocean-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <p className={`text-sm text-warm-700 font-medium ${isTruncated ? 'pr-2' : ''}`}>
                              {displayText}
                              {isTruncated && (
                                <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                              )}
                            </p>
                            <p className="text-xs text-warm-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isTruncated && (
                        <div className="mt-2 text-right">
                          <Link href="/notifications">
                            <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
                              View more
                            </button>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
                
                {/* View All Button at bottom if there are activities */}
                <div className="pt-3 border-t border-warm-200 mt-4">
                  <Link href="/notifications">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-brand-600 hover:text-brand-700"
                      rightIcon={<ArrowRight size={16} />}
                    >
                      See all activity
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Welcome Tips (for new users) */}
      {stats.upcomingEvents === 0 && stats.totalFriends === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-8 text-center bg-gradient-to-r from-brand-50 via-ocean-50 to-nature-50 border-2 border-brand-200">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-ocean-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-lato font-bold text-warm-800 mb-4">
              Welcome to GiftWish! 🎉
            </h3>
            <p className="text-warm-600 mb-6 max-w-2xl mx-auto">
              You're all set up! Let's get started by creating your first event and connecting with friends. 
              The magic of perfect gift-giving awaits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events/create">
                <Button variant="primary" size="lg" rightIcon={<Calendar size={20} />}>
                  Create Your First Event
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="secondary" size="lg" rightIcon={<Users size={20} />}>
                  Connect with Friends
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}