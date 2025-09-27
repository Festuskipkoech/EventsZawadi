'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService } from '@/services/api'
import { Notification } from '@/services/notificationService'
import { formatDistanceToNow } from 'date-fns'
import { 
  Bell,
  BellRing,
  X,
  CheckCheck,
  Users,
  Gift,
  TrendingUp
} from 'lucide-react'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auto-mark notifications as read when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Mark unread notifications as read after a short delay (user has seen them)
      const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 5) // Only recent ones shown
      if (unreadNotifications.length > 0) {
        const timer = setTimeout(() => {
          unreadNotifications.forEach(notification => {
            apiService.markNotificationAsRead(notification.id)
          })
        }, 1500) // 1.5 seconds - enough time to see them

        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, notifications])

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = apiService.subscribeToNotifications((notifications) => {
      setNotifications(notifications)
      setUnreadCount(notifications.filter(n => !n.isRead).length)
    })

    // Check connection status
    const checkConnection = () => {
      setIsConnected(apiService.isNotificationsConnected())
    }
    
    checkConnection()
    const interval = setInterval(checkConnection, 5000)

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      unsubscribe()
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
      case 'friend_request_response':
        return <Users className="w-4 h-4 text-blue-500" />
      case 'gift_received':
        return <Gift className="w-4 h-4 text-green-500" />
      case 'wishlist_threshold':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'friend_request':
      case 'friend_request_response':
        return 'border-l-blue-500 bg-blue-50'
      case 'gift_received':
        return 'border-l-green-500 bg-green-50'
      case 'wishlist_threshold':
        return 'border-l-orange-500 bg-orange-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const handleMarkAllAsRead = () => {
    apiService.markAllNotificationsAsRead()
  }

  const formatNotificationTime = (createdAt: string) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    } catch {
      return 'Just now'
    }
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          isOpen
            ? 'bg-brand-100 text-brand-600'
            : 'text-warm-600 hover:text-brand-600 hover:bg-brand-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}

        {/* Connection Status Indicator */}
        <div 
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-warm-200 z-50 max-h-[70vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-warm-100">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-brand-500" />
                <h3 className="font-semibold text-warm-800">Notifications</h3>
                {!isConnected && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Offline
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <motion.button
                    onClick={handleMarkAllAsRead}
                    className="text-xs bg-brand-100 text-brand-600 px-3 py-1 rounded-full hover:bg-brand-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCheck className="w-3 h-3 inline mr-1" />
                    Mark all read
                  </motion.button>
                )}
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-warm-400 hover:text-warm-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-warm-300 mx-auto mb-3" />
                  <p className="text-warm-500 font-medium">No notifications yet</p>
                  <p className="text-sm text-warm-400 mt-1">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-warm-100">
                  {recentNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 hover:bg-warm-50 transition-colors cursor-pointer border-l-4 ${
                        notification.isRead 
                          ? 'opacity-75 border-l-transparent' 
                          : getNotificationColor(notification.type)
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        // Auto-mark as read when clicked/viewed
                        if (!notification.isRead) {
                          apiService.markNotificationAsRead(notification.id)
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium truncate ${
                              notification.isRead ? 'text-warm-600' : 'text-warm-800'
                            }`}>
                              {notification.title}
                            </h4>
                            
                            {!notification.isRead && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-brand-500 font-medium bg-brand-50 px-2 py-1 rounded-full">
                                  New
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className={`text-sm mt-1 ${
                            notification.isRead ? 'text-warm-500' : 'text-warm-600'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-warm-400">
                              {formatNotificationTime(notification.createdAt)}
                            </span>
                            
                            {notification.relatedUser && (
                              <span className="text-xs text-brand-500 font-medium">
                                from {notification.relatedUser.name}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-warm-100 p-3">
                <Link href="/notifications">
                  <motion.button
                    className="w-full text-center text-sm text-brand-600 hover:text-brand-700 font-medium py-2 rounded-lg hover:bg-brand-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View all notifications ({notifications.length})
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}