'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService } from '@/services/api'
import { Notification } from '@/services/notificationService'
import { formatDistanceToNow, format } from 'date-fns'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { 
  Bell,
  BellRing,
  Users,
  Gift,
  TrendingUp,
  Filter,
  Search,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedType, setSelectedType] = useState<'all' | 'friend_request' | 'gift_received' | 'wishlist_threshold'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  // Auto-mark visible notifications as read when they come into view
  useEffect(() => {
    const unreadNotifications = filteredNotifications.filter(n => !n.isRead)
    if (unreadNotifications.length > 0) {
      // Mark as read after user has had time to see them
      const timer = setTimeout(() => {
        unreadNotifications.forEach(notification => {
          apiService.markNotificationAsRead(notification.id)
        })
      }, 2000) // 2 seconds to see them

      return () => clearTimeout(timer)
    }
  }, [filteredNotifications])

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = apiService.subscribeToNotifications((notifications) => {
      setNotifications(notifications)
    })

    // Check connection status
    const checkConnection = () => {
      setIsConnected(apiService.isNotificationsConnected())
      setConnectionStatus(apiService.getNotificationConnectionStatus())
    }
    
    checkConnection()
    const interval = setInterval(checkConnection, 3000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  // Filter notifications based on selected filters
  useEffect(() => {
    let filtered = notifications

    // Filter by read status
    if (selectedFilter === 'unread') {
      filtered = filtered.filter(n => !n.isRead)
    } else if (selectedFilter === 'read') {
      filtered = filtered.filter(n => n.isRead)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, selectedFilter, selectedType, searchTerm])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
      case 'friend_request_response':
        return <Users className="w-6 h-6 text-blue-500" />
      case 'gift_received':
        return <Gift className="w-6 h-6 text-green-500" />
      case 'wishlist_threshold':
        return <TrendingUp className="w-6 h-6 text-orange-500" />
      default:
        return <Bell className="w-6 h-6 text-gray-500" />
    }
  }

  const getNotificationBg = (type: string, isRead: boolean) => {
    const baseClasses = isRead ? 'bg-white border-warm-200' : 'bg-white border-l-4'
    
    if (isRead) return baseClasses

    switch (type) {
      case 'friend_request':
      case 'friend_request_response':
        return `${baseClasses} border-l-blue-500`
      case 'gift_received':
        return `${baseClasses} border-l-green-500`
      case 'wishlist_threshold':
        return `${baseClasses} border-l-orange-500`
      default:
        return `${baseClasses} border-l-gray-500`
    }
    
  }

  const handleMarkAllAsRead = () => {
    apiService.markAllNotificationsAsRead()
  }

  const handleRefresh = () => {
    apiService.refreshNotifications()
    handleMarkAllAsRead()

  }

  const formatNotificationTime = (createdAt: string) => {
    try {
      const date = new Date(createdAt)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      } else {
        return format(date, 'MMM d, h:mm a')
      }
    } catch {
      return 'Just now'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'friend_request':
      case 'friend_request_response':
        return 'Friends'
      case 'gift_received':
        return 'Gifts'
      case 'wishlist_threshold':
        return 'Wishlist'
      default:
        return 'General'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800 flex items-center gap-3">
            <BellRing className="w-8 h-8 text-brand-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-warm-600 mt-1">
            Stay updated with your latest activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {connectionStatus === 'connected' ? 'Live' : 'Offline'}
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>

          {/* Mark All Read */}
          {/* {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Mark All Read
            </Button>
          )} */}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-warm-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-3 py-2 border border-warm-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all"
            >
              <option value="all">All ({notifications.length})</option>
              <option value="unread">Unread ({unreadCount})</option>
              <option value="read">Read ({notifications.length - unreadCount})</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-warm-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all"
            >
              <option value="all">All Types</option>
              <option value="friend_request">Friends</option>
              <option value="gift_received">Gifts</option>
              <option value="wishlist_threshold">Wishlist</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedFilter !== 'all' || selectedType !== 'all' || searchTerm) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-warm-200">
            <Filter className="w-4 h-4 text-warm-500" />
            <span className="text-sm text-warm-600">Active filters:</span>
            
            {selectedFilter !== 'all' && (
              <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded-lg text-xs font-medium">
                {selectedFilter}
              </span>
            )}
            
            {selectedType !== 'all' && (
              <span className="bg-ocean-100 text-ocean-700 px-2 py-1 rounded-lg text-xs font-medium">
                {getTypeLabel(selectedType)}
              </span>
            )}
            
            {searchTerm && (
              <span className="bg-nature-100 text-nature-700 px-2 py-1 rounded-lg text-xs font-medium">
                "{searchTerm}"
              </span>
            )}

            <button
              onClick={() => {
                setSelectedFilter('all')
                setSelectedType('all')
                setSearchTerm('')
              }}
              className="ml-auto text-xs text-warm-500 hover:text-brand-500"
            >
              Clear all
            </button>
          </div>
        )}
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredNotifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-12 text-center">
                <Bell className="w-16 h-16 text-warm-300 mx-auto mb-4" />
                <h3 className="text-xl font-lato font-bold text-warm-700 mb-2">
                  {searchTerm || selectedFilter !== 'all' || selectedType !== 'all'
                    ? 'No notifications match your filters'
                    : 'No notifications yet'
                  }
                </h3>
                <p className="text-warm-500">
                  {searchTerm || selectedFilter !== 'all' || selectedType !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'We\'ll notify you when something happens'
                  }
                </p>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                    getNotificationBg(notification.type, notification.isRead)
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${
                              notification.isRead ? 'text-warm-600' : 'text-warm-800'
                            }`}>
                              {notification.title}
                            </h3>
                            
                            <p className={`text-sm leading-relaxed ${
                              notification.isRead ? 'text-warm-500' : 'text-warm-600'
                            }`}>
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between gap-4 mt-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-warm-400">
                                  {formatNotificationTime(notification.createdAt)}
                                </span>
                                
                                <span className="text-xs bg-warm-100 text-warm-600 px-2 py-1 rounded-full">
                                  {getTypeLabel(notification.type)}
                                </span>
                                
                                {notification.relatedUser && (
                                  <span className="text-xs text-brand-500 font-medium">
                                    from {notification.relatedUser.name}
                                  </span>
                                )}
                              </div>

                              {!notification.isRead && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-brand-500 font-medium bg-brand-50 px-2 py-1 rounded-full">
                                    New
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="w-3 h-3 bg-brand-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Footer */}
      {filteredNotifications.length > 0 && (
        <Card className="p-4 text-center">
          <p className="text-sm text-warm-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </p>
        </Card>
      )}
    </div>
  )
}