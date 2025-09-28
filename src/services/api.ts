// services/apiService.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { CONSTANTS } from '@/lib/utils'
import toast from 'react-hot-toast'
import { notificationService, Notification, NotificationListener } from './notificationService'

// Types - Updated to match actual backend responses
interface User {
  id: number
  email: string
  name: string
  friendCode: string
  avatarUrl?: string
  createdAt: string
}

interface AuthResponse {
  user: User
  token: string
}

interface Event {
  id: number
  title: string
  description?: string
  eventDate: string
  eventType: string
  isActive: boolean
  wishlistItemsCount: number
  giftsReceivedCount?: number
  createdAt: string
  updatedAt?: string
  owner?: {
    name: string
    email: string
  }
}

interface WishlistItem {
  id: number
  title: string
  description?: string
  price?: number
  priority: number
  itemUrl?: string
  isPledged: boolean
  hasGift?: boolean
  giftCount?: number
  createdAt: string
  gift?: {
    id: number
    giverName: string
    message?: string
    imageBase64?: string
    purchasedAt: string
  }
  myPledge?: {
    id: number
    status: string
    pledgedAt: string
    purchasedAt?: string
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

interface Friend {
  id: number
  name: string
  email: string
  friendCode: string
  avatarUrl?: string
  friendshipDate: string
}

interface FriendRequest {
  id: number
  requester: {
    id: number
    name: string
    email: string
    friendCode: string
  }
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

interface Gift {
  id: number
  status: 'pledged' | 'purchased'
  message?: string
  hasImage: boolean
  hasMessage?: boolean
  pledgedAt: string
  purchasedAt?: string
  item: {
    title: string
    description?: string
  }
  event: {
    id: number
    title: string
    date: string
    hasPassed?: boolean
  }
  recipient?: {
    name: string
  }
  giver?: {
    name: string
  }
}

interface CreateEventData {
  title: string
  description?: string
  eventDate: string
  eventType: string
}

interface CreateWishlistItemData {
  title: string
  description?: string
  price?: number
  priority: number
  itemUrl?: string
}

interface UpdateProfileData {
  name?: string
  email?: string
}
interface UpdateWishlistItemData {
  title?: string
  description?: string
  price?: number
  priority?: number
  itemUrl?: string
}
class ApiService {
  private api: AxiosInstance
  private token: string | null = null
  private currentUser: User | null = null

  constructor() {
    this.api = axios.create({
      baseURL: CONSTANTS.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load token from localStorage and restore user
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      const userData = localStorage.getItem(CONSTANTS.STORAGE_KEYS.USER_DATA)
      
      if (this.token && userData) {
        try {
          this.currentUser = JSON.parse(userData)
          this.setAuthHeader(this.token)
          
          // Auto-connect to notifications if user is logged in
          this.connectNotifications()
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          this.clearAuth()
        }
      }
    }

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching for GET requests
        if (config.method === 'get') {
          config.params = { ...config.params, _t: Date.now() }
        }
        
        // Add request logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }
        
        return config
      },
      (error) => {
        console.error('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        }
        return response
      },
      async (error: AxiosError) => {
        const status = error.response?.status

        // Handle different error types
        const errorMessage = this.getErrorMessage(error)
        
        if (status === 401) {
          this.clearAuth()
          toast.error('Session expired. Please login again.')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        } else if (status === 500) {
          toast.error('Server error. Please try again later.')
        } else if (status === 429) {
          toast.error('Too many requests. Please slow down.')
        } else if (status === 403) {
          toast.error('You don\'t have permission to perform this action.')
        } else if (status >= 400 && status < 500) {
          // Only show toast for errors that aren't handled elsewhere
          if (!error.config?._skipErrorToast) {
            toast.error(errorMessage)
          }
        }

        console.error('❌ API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  private getErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any
    return data?.error?.message || data?.message || error.message || 'Something went wrong'
  }

  // Auth token management
  setAuthHeader(token: string) {
    this.token = token
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, token)
    }
  }

  clearAuth() {
    this.token = null
    this.currentUser = null
    delete this.api.defaults.headers.common['Authorization']
    
    // Disconnect notifications
    notificationService.disconnect()
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.USER_DATA)
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    const response = await this.request<User>('put', '/auth/profile', profileData)
    this.currentUser = response
    
    // Update stored user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response))
    }
    
    toast.success('Profile updated successfully! ✏️')
    return response
  }

  // Notification connection management
  private connectNotifications() {
    if (this.token && typeof window !== 'undefined') {
      const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
      notificationService.connect(this.token, websocketUrl)
    }
  }

  // API Helper with better error handling
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await this.api[method](
        endpoint, 
        method === 'get' ? { ...config, params: data } : data, 
        method === 'get' ? config : { ...config }
      )
      
      // Handle standard API response format
      if (response.data?.success !== undefined) {
        if (!response.data.success) {
          throw new Error(response.data.error?.message || response.data.message || 'Request failed')
        }
        return response.data.data || response.data
      }
      
      // Direct data response
      return response.data
    } catch (error: any) {
      // Re-throw with better error context
      const message = this.getErrorMessage(error)
      const apiError = new Error(message)
      apiError.name = 'ApiError'
      throw apiError
    }
  }

// auth endpoints

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>(
      'post', 
      '/auth/login', 
      { email, password }
    )
    
    this.setAuthHeader(response.token)
    this.currentUser = response.user
    
    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
    }
    
    // Connect to notifications after successful login
    this.connectNotifications()
    
    toast.success(`Welcome back, ${response.user.name}! 🎉`)
    return response
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>(
      'post', 
      '/auth/register', 
      { email, password, name }
    )
    
    this.setAuthHeader(response.token)
    this.currentUser = response.user
    
    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
    }
    
    // Connect to notifications after successful registration
    this.connectNotifications()
    
    toast.success(`Welcome to GiftWish, ${response.user.name}! ✨`)
    return response
  }

  async getProfile(): Promise<User> {
    const user = await this.request<User>('get', '/auth/profile')
    this.currentUser = user
    
    // Update stored user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    }
    
    return user
  }

  logout() {
    // Disconnect notifications before clearing auth
    notificationService.disconnect()
    
    this.clearAuth()
    toast.success('Logged out successfully')
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
// event endpoints

  async getMyEvents(includeInactive?: boolean): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/mine', { includeInactive })
  }

  async getFriendsEvents(): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/friends')
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await this.request<Event>('post', '/events', eventData)
    toast.success('Event created! 🎉')
    return response
  }

  async updateEvent(eventId: number, eventData: Partial<CreateEventData> & { isActive?: boolean }): Promise<Event> {
    const response = await this.request<Event>('put', `/events/${eventId}`, eventData)
    toast.success('Event updated! ✏️')
    return response
  }

  async deleteEvent(eventId: number): Promise<void> {
    await this.request('delete', `/events/${eventId}`)
    toast.success('Event deleted! 🗑️')
  }

  async addWishlistItem(eventId: number, itemData: CreateWishlistItemData): Promise<WishlistItem> {
    const response = await this.request<WishlistItem>('post', `/events/${eventId}/wishlist`, itemData)
    toast.success('Item added to wishlist! 🎁')
    return response
  }

async updateWishlistItem(eventId: number, itemId: number, itemData: UpdateWishlistItemData): Promise<WishlistItem> {
  const response = await this.request<WishlistItem>('put', `/events/${eventId}/wishlist/${itemId}`, itemData)
  toast.success('Wishlist item updated! ✏️')
  return response
}

async deleteWishlistItem(eventId: number, itemId: number): Promise<void> {
  await this.request('delete', `/events/${eventId}/wishlist/${itemId}`)
  toast.success('Wishlist item deleted! 🗑️')
}
// friends endpoint

  async getFriends(): Promise<Friend[]> {
    return this.request<Friend[]>('get', '/friends/list')
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    return this.request<FriendRequest[]>('get', '/friends/requests')
  }

  async sendFriendRequest(friendCode: string): Promise<void> {
    await this.request('post', '/friends/request', { friendCode })
    toast.success('Friend request sent! 📨')
  }

  async acceptFriendRequest(requestId: number): Promise<void> {
    await this.request('put', `/friends/requests/${requestId}/respond`, { action: 'accept' })
    toast.success('Friend request accepted! 🤝')
  }

  async declineFriendRequest(requestId: number): Promise<void> {
    await this.request('put', `/friends/requests/${requestId}/respond`, { action: 'decline' })
    toast.success('Friend request declined')
  }

  async removeFriend(friendId: number): Promise<void> {
    await this.request('delete', `/friends/${friendId}`)
    toast.success('Friend removed')
  }

  async generateFriendLink(): Promise<{ shareableLink: string; token: string; expiresIn: string }> {
    return this.request<{ shareableLink: string; token: string; expiresIn: string }>('post', '/friends/generate-link')
  }

  async getFriendRequestInfo(token: string): Promise<{ 
    requester: { name: string; email: string; friendCode: string }; 
    createdAt: string; 
    expiresAt: string 
  }> {
    return this.request('get', `/friends/token/${token}`)
  }

  async acceptFriendRequestViaToken(token: string): Promise<void> {
    await this.request('post', `/friends/accept-token/${token}`)
    toast.success('Friend request accepted! 🤝')
  }

  // Gifts endpoints

  async getWishlist(eventId: number): Promise<WishlistData> {
    return this.request<WishlistData>('get', `/gifts/wishlist/${eventId}`)
  }

  async pledgeGift(itemId: number): Promise<void> {
    await this.request('post', `/gifts/pledge/${itemId}`)
    toast.success('Gift pledged! 🎁')
  }

  async markGiftAsPurchased(pledgeId: number, message?: string, imageFile?: File): Promise<void> {
    if (imageFile) {
      // Use FormData for file upload
      const formData = new FormData()
      if (message) formData.append('message', message)
      formData.append('image', imageFile)
      
      await this.request('put', `/gifts/purchase/${pledgeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else if (message) {
      // JSON request for message only
      await this.request('put', `/gifts/purchase/${pledgeId}`, { message })
    } else {
      // No additional data
      await this.request('put', `/gifts/purchase/${pledgeId}`)
    }
    
    toast.success('Gift marked as purchased! 📦')
  }

  async getReceivedGifts(eventId?: number): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/received', eventId ? { eventId } : undefined)
  }

  async getGivenGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/given')
  }

// notifications endpoints

  // Get current notifications (from WebSocket service)
  getNotifications(): Notification[] {
    return notificationService.getNotifications()
  }

  // Get unread notification count
  getUnreadNotificationCount(): number {
    return notificationService.getUnreadCount()
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): void {
    notificationService.markAsRead(notificationId)
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): void {
    notificationService.markAllAsRead()
  }

  // Subscribe to notification updates
  subscribeToNotifications(callback: NotificationListener): () => void {
    return notificationService.subscribe(callback)
  }

  // Request fresh notifications from server
  refreshNotifications(): void {
    notificationService.requestNotifications()
  }

  // Get notification connection status
  getNotificationConnectionStatus(): string {
    return notificationService.getConnectionStatus()
  }

  // Check if notifications are connected
  isNotificationsConnected(): boolean {
    return notificationService.isConnected()
  }

  // Get notifications by type
  getNotificationsByType(type: string): Notification[] {
    return notificationService.getNotificationsByType(type)
  }

  // Get recent notifications
  getRecentNotifications(count: number = 10): Notification[] {
    return notificationService.getRecentNotifications(count)
  }
  // Utility endpoints
  async checkHealth(): Promise<{ status: string; timestamp: string; uptime: number; environment: string }> {
    // Health endpoint is at root level, not /api/health
    const response = await axios.get(`${CONSTANTS.API_BASE_URL}/../health`)
    return response.data
  }

  isAuthenticated(): boolean {
    return !!this.token && this.isTokenValid()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  private isTokenValid(): boolean {
    if (!this.token) return false
    
    try {
      const parts = this.token.split('.')
      if (parts.length !== 3) return false
      
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      return payload.exp > now
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export types
export type { 
  User, 
  AuthResponse, 
  Event, 
  Friend, 
  FriendRequest,
  Gift, 
  WishlistItem,
  WishlistData,
  CreateEventData,
  CreateWishlistItemData,
  UpdateWishlistItemData,
  Notification,
  NotificationListener,
  UpdateProfileData
}