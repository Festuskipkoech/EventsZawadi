// services/notificationService.ts
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

// Types for notifications
interface Notification {
  id: number
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  relatedUser?: {
    name: string
  }
  relatedEventId?: number
}

interface NotificationListener {
  (notifications: Notification[]): void
}

class NotificationService {
  private socket: Socket | null = null
  private notifications: Notification[] = []
  private listeners: NotificationListener[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(token: string, websocketUrl: string = 'http://localhost:5000') {
    if (this.socket?.connected) {
      console.log('WebSocket already connected')
      return
    }

    console.log('🔌 Connecting to notification WebSocket...')
    
    this.socket = io(websocketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    if (!this.socket) return

    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Notification WebSocket connected')
      this.reconnectAttempts = 0
      this.requestNotifications()
    })

    // Receive notification list
    this.socket.on('notifications_list', (notifications: Notification[]) => {
      console.log('📬 Received notifications list:', notifications.length)
      this.notifications = notifications
      this.notifyListeners()
    })

    // Receive new real-time notification
    this.socket.on('new_notification', (notification: Notification) => {
      console.log('🔔 New notification received:', notification)
      this.notifications.unshift(notification)
      this.notifyListeners()
      
      // Show toast notification for new notifications
      if (notification.type !== 'system') {
        toast.success(notification.title, {
          duration: 4000,
          icon: this.getNotificationIcon(notification.type)
        })
      }
    })

    // Notification marked as read confirmation
    this.socket.on('notification_marked_read', ({ notificationId }) => {
      console.log('✅ Notification marked as read:', notificationId)
      this.notifications = this.notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
      this.notifyListeners()
    })

    // Handle connection errors
    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error)
      this.handleReconnection()
    })

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Notification WebSocket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnection()
      }
    })

    // Handle authentication errors
    this.socket.on('error', (error) => {
      console.error('🚫 WebSocket authentication error:', error)
      if (error === 'Authentication token required' || error === 'Invalid authentication token') {
        toast.error('Session expired. Please login again.')
        this.disconnect()
        // Redirect to login could be handled here or by the parent app
      }
    })
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      toast.error('Connection lost. Please refresh the page.')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // Exponential backoff
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`)
    
    setTimeout(() => {
      this.socket?.connect()
    }, delay)
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'friend_request':
        return '👥'
      case 'friend_request_response':
        return '🤝'
      case 'gift_received':
        return '🎁'
      case 'wishlist_threshold':
        return '📈'
      default:
        return '🔔'
    }
  }

  // Request current notifications from server
  requestNotifications() {
    if (this.socket?.connected) {
      console.log('📮 Requesting notifications...')
      this.socket.emit('get_notifications')
    } else {
      console.warn('Cannot request notifications: WebSocket not connected')
    }
  }

  // Mark notification as read
  markAsRead(notificationId: number) {
    if (this.socket?.connected) {
      console.log('✅ Marking notification as read:', notificationId)
      this.socket.emit('mark_notification_read', notificationId)
    } else {
      console.warn('Cannot mark notification as read: WebSocket not connected')
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => !n.isRead)
    unreadNotifications.forEach(notification => {
      this.markAsRead(notification.id)
    })
  }

  // Subscribe to notification updates
  subscribe(callback: NotificationListener): () => void {
    this.listeners.push(callback)
    
    // Immediately call with current notifications
    callback(this.notifications)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]) // Send copy to prevent mutations
      } catch (error) {
        console.error('Error in notification listener:', error)
      }
    })
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting notification WebSocket...')
      this.socket.disconnect()
      this.socket = null
    }
    
    this.notifications = []
    this.listeners = []
    this.reconnectAttempts = 0
  }

  // Get current notifications
  getNotifications(): Notification[] {
    return [...this.notifications] // Return copy
  }

  // Get unread notification count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length
  }

  // Check if WebSocket is connected
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  // Get connection status
  getConnectionStatus(): string {
    if (!this.socket) return 'disconnected'
    if (this.socket.connected) return 'connected'
    return 'connecting'
  }

  // Clear all notifications (local only)
  clearNotifications() {
    this.notifications = []
    this.notifyListeners()
  }

  // Filter notifications by type
  getNotificationsByType(type: string): Notification[] {
    return this.notifications.filter(n => n.type === type)
  }

  // Get recent notifications (last N)
  getRecentNotifications(count: number = 10): Notification[] {
    return this.notifications.slice(0, count)
  }
}

// Create and export singleton instance
export const notificationService = new NotificationService()

// Export types
export type { Notification, NotificationListener }