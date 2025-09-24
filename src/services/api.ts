import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { CONSTANTS } from '@/lib/utils'
import toast from 'react-hot-toast'

// Types
interface User {
  id: number
  email: string
  name: string
  friendCode: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

interface AuthResponse {
  user: User
  token: string
  refreshToken: string
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
  updatedAt: string
  ownerId: number
  ownerName?: string
  isOwnEvent?: boolean
  hasEventPassed?: boolean
}

interface WishlistItem {
  id: number
  title: string
  description?: string
  price?: number
  priority: number
  itemUrl?: string
  isPledged: boolean
  hasGift: boolean
  isRevealed: boolean
  createdAt: string
  updatedAt: string
  eventId: number
  pledgedBy?: {
    id: number
    name: string
  }
  gift?: {
    id: number
    giverName: string
    message?: string
    hasImage: boolean
    purchasedAt: string
  }
}

interface WishlistData {
  event: Event
  items: WishlistItem[]
}

interface Friend {
  id: number
  name: string
  email: string
  friendCode: string
  avatarUrl?: string
  friendshipDate: string
  status: 'active' | 'blocked'
  upcomingEventsCount: number
}

interface FriendRequest {
  id: number
  requester: {
    id: number
    name: string
    email: string
    friendCode: string
  }
  recipient: {
    id: number
    name: string
    email: string
  }
  status: 'pending' | 'accepted' | 'declined'
  message?: string
  createdAt: string
  token?: string
}

interface Gift {
  id: number
  status: 'pledged' | 'purchased' | 'delivered'
  message?: string
  hasImage: boolean
  pledgedAt: string
  purchasedAt?: string
  deliveredAt?: string
  item: {
    id: number
    title: string
    description?: string
    price?: number
  }
  event: {
    id: number
    title: string
    date: string
    eventType: string
  }
  recipient: {
    id: number
    name: string
    email: string
  }
  giver: {
    id: number
    name: string
    email: string
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
  avatarUrl?: string
}

class ApiService {
  private api: AxiosInstance
  private token: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: CONSTANTS.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load tokens from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      this.refreshToken = localStorage.getItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN)
      if (this.token) {
        this.setAuthHeader(this.token)
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

    // Response interceptor with token refresh logic
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        }
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any
        const status = error.response?.status

        // Handle authentication errors with token refresh
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const newToken = await this.refreshAuthToken()
            if (newToken) {
              this.setAuthHeader(newToken)
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            this.clearAuth()
            toast.error('Session expired. Please login again.')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        // Handle other errors with user-friendly messages
        const errorMessage = this.getErrorMessage(error)
        
        if (status === 500) {
          toast.error('Server error. Please try again later.')
        } else if (status === 429) {
          toast.error('Too many requests. Please slow down.')
        } else if (status === 403) {
          toast.error('You don\'t have permission to perform this action.')
        } else if (status >= 400 && status < 500) {
          // Only show toast for non-auth errors that aren't handled elsewhere
          if (status !== 401 && !originalRequest._skipErrorToast) {
            toast.error(errorMessage)
          }
        }

        console.error(' API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  private getErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any
    return data?.error?.message || data?.message || error.message || 'Something went wrong'
  }

  private async refreshAuthToken(): Promise<string | null> {
    if (!this.refreshToken) return null

    try {
      const response = await axios.post(`${CONSTANTS.API_BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken
      })

      const { token, refreshToken } = response.data.data
      this.token = token
      this.refreshToken = refreshToken

      // Update localStorage
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, token)
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, refreshToken)

      return token
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
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
    this.refreshToken = null
    delete this.api.defaults.headers.common['Authorization']
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.USER_DATA)
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
      const response = await this.api[method](endpoint, method === 'get' ? { ...config, params: data } : data, config)
      
      // Handle different response structures
      if (response.data?.success !== undefined) {
        // Standard API response format
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

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string; refreshToken: string }>(
      'post', 
      '/auth/login', 
      { email, password }
    )
    
    this.setAuthHeader(response.token)
    this.refreshToken = response.refreshToken
    
    // Store tokens and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
    }
    
    toast.success(`Welcome back, ${response.user.name}! 🎉`)
    return response
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string; refreshToken: string }>(
      'post', 
      '/auth/register', 
      { email, password, name }
    )
    
    this.setAuthHeader(response.token)
    this.refreshToken = response.refreshToken
    
    // Store tokens and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
    }
    
    toast.success(`Welcome to GiftWish, ${response.user.name}! ✨`)
    return response
  }

  async getProfile(): Promise<User> {
    return this.request<User>('get', '/auth/profile')
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await this.request<User>('put', '/auth/profile', data)
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response))
    }
    
    toast.success('Profile updated successfully! 👤')
    return response
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request('put', '/auth/change-password', { currentPassword, newPassword })
    toast.success('Password changed successfully! 🔒')
  }

  logout() {
    // Call logout endpoint to invalidate token on server
    this.request('post', '/auth/logout').catch(() => {
      // Ignore errors on logout
    })
    
    this.clearAuth()
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  // Events endpoint
  async getMyEvents(): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/mine')
  }

  async getFriendsEvents(): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/friends')
  }

  async getEvent(eventId: number): Promise<Event> {
    return this.request<Event>('get', `/events/${eventId}`)
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await this.request<Event>('post', '/events', eventData)
    toast.success('Event created! 🎉')
    return response
  }

  async updateEvent(eventId: number, eventData: Partial<CreateEventData>): Promise<Event> {
    const response = await this.request<Event>('put', `/events/${eventId}`, eventData)
    toast.success('Event updated! ✏️')
    return response
  }

  async deleteEvent(eventId: number): Promise<void> {
    await this.request('delete', `/events/${eventId}`)
    toast.success('Event deleted! 🗑️')
  }

  // Wishlist endpoint

async getWishlist(eventId: number): Promise<WishlistData> {
  return this.request<WishlistData>('get', `/gifts/wishlist/${eventId}`)
}


async addWishlistItem(eventId: number, itemData: CreateWishlistItemData): Promise<WishlistItem> {
  const response = await this.request<WishlistItem>('post', `/events/${eventId}/wishlist`, itemData)
  toast.success('Item added to wishlist! 🎁')
  return response
}

  async updateWishlistItem(itemId: number, itemData: Partial<CreateWishlistItemData>): Promise<WishlistItem> {
    const response = await this.request<WishlistItem>('put', `/wishlist/items/${itemId}`, itemData)
    toast.success('Wishlist item updated! ✏️')
    return response
  }

  async deleteWishlistItem(itemId: number): Promise<void> {
    await this.request('delete', `/wishlist/items/${itemId}`)
    toast.success('Item removed from wishlist! 🗑️')
  }

  // Friends endpoints
  async getFriends(): Promise<Friend[]> {
    return this.request<Friend[]>('get', '/friends')
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    return this.request<FriendRequest[]>('get', '/friends/requests')
  }

  async sendFriendRequest(friendCode: string, message?: string): Promise<void> {
    await this.request('post', '/friends/request', { friendCode, message })
    toast.success('Friend request sent! 📨')
  }

  async acceptFriendRequest(requestId: number): Promise<void> {
    await this.request('put', `/friends/requests/${requestId}/accept`)
    toast.success('Friend request accepted! 🤝')
  }

  async declineFriendRequest(requestId: number): Promise<void> {
    await this.request('put', `/friends/requests/${requestId}/decline`)
    toast.success('Friend request declined')
  }

  async removeFriend(friendId: number): Promise<void> {
    await this.request('delete', `/friends/${friendId}`)
    toast.success('Friend removed')
  }

  // Friends link endpoint
  async generateFriendLink(expiresInHours: number = 168): Promise<{ shareableLink: string; token: string }> {
    return this.request<{ shareableLink: string; token: string }>('post', '/friends/generate-link', { expiresInHours })
  }

  async getFriendRequestInfo(token: string): Promise<{ requester: User; isValid: boolean; expiresAt: string }> {
    return this.request<{ requester: User; isValid: boolean; expiresAt: string }>('get', `/friends/link-info/${token}`)
  }

  async acceptFriendRequestViaToken(token: string): Promise<void> {
    await this.request('post', '/friends/accept-via-token', { token })
    toast.success('Friend request accepted! 🤝')
  }

  // Gifts endpoints
  async pledgeGift(itemId: number, message?: string): Promise<void> {
    await this.request('post', `/gifts/pledge`, { itemId, message })
    toast.success('Gift pledged! 🎁')
  }

  async unpledgeGift(pledgeId: number): Promise<void> {
    await this.request('delete', `/gifts/pledge/${pledgeId}`)
    toast.success('Gift unpledged')
  }

  async markGiftAsPurchased(pledgeId: number, message?: string, hasImage?: boolean): Promise<void> {
    await this.request('put', `/gifts/pledge/${pledgeId}/purchase`, { message, hasImage })
    toast.success('Gift marked as purchased! 📦')
  }

  async markGiftAsDelivered(pledgeId: number): Promise<void> {
    await this.request('put', `/gifts/pledge/${pledgeId}/deliver`)
    toast.success('Gift marked as delivered! 🎉')
  }

  async getReceivedGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/received')
  }

  async getGivenGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/given')
  }

  async getMyPledges(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/pledges')
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<{
    upcomingEvents: number
    totalFriends: number
    giftsGiven: number
    giftsReceived: number
    recentActivity: Array<{
      type: string
      message: string
      time: string
      icon: string
    }>
  }> {
    return this.request('get', '/dashboard/stats')
  }

  // Notifications endpoints
  async getNotifications(): Promise<Array<{
    id: number
    type: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
    data?: any
  }>> {
    return this.request('get', '/notifications')
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.request('put', `/notifications/${notificationId}/read`)
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('put', '/notifications/read-all')
  }

  // File upload logic
  async uploadFile(file: File, type: 'avatar' | 'gift_image' | 'event_cover'): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request('post', '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Utility functions
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request('get', '/health')
  }

  isAuthenticated(): boolean {
    return !!this.token && this.isTokenValid()
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
  UpdateProfileData
}