import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { CONSTANTS } from '@/lib/utils'
import toast from 'react-hot-toast'

// Types
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    message: string
    code: string
  }
}

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
}

interface Friend {
  id: number
  name: string
  email: string
  friendCode: string
  avatarUrl?: string
  friendshipDate: string
}

interface Gift {
  id: number
  item: {
    title: string
    description?: string
  }
  event: {
    id: number
    title: string
    date: string
  }
  status: 'pledged' | 'purchased' | 'delivered'
  purchasedAt?: string
  message?: string
  hasImage?: boolean
}

class ApiService {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: CONSTANTS.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      if (this.token) {
        this.setAuthHeader(this.token)
      }
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
        if (config.method === 'get') {
          config.params = { ...config.params, _t: Date.now() }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const status = error.response?.status

        // Handle authentication errors
        if (status === 401) {
          this.clearAuth()
          toast.error('Session expired. Please login again.')
          window.location.href = '/login'
        }

        // Handle server errors with friendly messages
        if (status === 500) {
          toast.error('Server error. Please try again later.')
        }

        if (status === 429) {
          toast.error('Too many requests. Please slow down.')
        }

        return Promise.reject(error)
      }
    )
  }

  // Auth methods
  setAuthHeader(token: string) {
    this.token = token
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, token)
    }
  }

  clearAuth() {
    this.token = null
    delete this.api.defaults.headers.common['Authorization']
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.USER_DATA)
    }
  }

  // API Helper
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await this.api[method](endpoint, data)
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Something went wrong'
      throw new Error(message)
    }
  }

  // ============ AUTH ENDPOINTS ============
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('post', '/auth/login', {
      email,
      password,
    })
    
    if (response.success && response.data) {
      this.setAuthHeader(response.data.token)
      
      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
      }
      
      toast.success('Welcome back! 🎉')
      return response.data
    }
    
    throw new Error(response.error?.message || 'Login failed')
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('post', '/auth/register', {
      email,
      password,
      name,
    })
    
    if (response.success && response.data) {
      this.setAuthHeader(response.data.token)
      
      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
      }
      
      toast.success('Welcome to GiftWish! ✨')
      return response.data
    }
    
    throw new Error(response.error?.message || 'Registration failed')
  }

  async getProfile(): Promise<User> {
    return this.request<User>('get', '/auth/profile')
  }

  logout() {
    this.clearAuth()
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  // ============ EVENTS ENDPOINTS ============
  async getMyEvents(): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/mine')
  }

  async getFriendsEvents(): Promise<Event[]> {
    return this.request<Event[]>('get', '/events/friends')
  }

  async createEvent(eventData: {
    title: string
    description?: string
    eventDate: string
    eventType: string
  }): Promise<Event> {
    const response = await this.request<Event>('post', '/events', eventData)
    toast.success('Event created! 🎉')
    return response
  }

  // ============ FRIENDS ENDPOINTS ============
  async getFriends(): Promise<Friend[]> {
    return this.request<Friend[]>('get', '/friends/list')
  }

  async getFriendRequests(): Promise<any[]> {
    return this.request<any[]>('get', '/friends/requests')
  }

  async sendFriendRequest(friendCode: string): Promise<void> {
    await this.request('post', '/friends/request', { friendCode })
    toast.success('Friend request sent! 📨')
  }

  async generateFriendLink(): Promise<{ shareableLink: string }> {
    return this.request<{ shareableLink: string }>('post', '/friends/generate-link')
  }

  async acceptFriendRequest(requestId: number): Promise<void> {
    await this.request('put', `/friends/requests/${requestId}/respond`, { action: 'accept' })
    toast.success('Friend request accepted! 🤝')
  }

  // ============ GIFTS ENDPOINTS ============
  async getReceivedGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/received')
  }

  async getGivenGifts(): Promise<Gift[]> {
    return this.request<Gift[]>('get', '/gifts/given')
  }

  async getWishlist(eventId: number): Promise<any> {
    return this.request('get', `/gifts/wishlist/${eventId}`)
  }

  async pledgeGift(itemId: number): Promise<void> {
    await this.request('post', `/gifts/pledge/${itemId}`)
    toast.success('Gift pledged! 🎁')
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export types
export type { User, AuthResponse, Event, Friend, Gift }
