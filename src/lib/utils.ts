import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//  Utility function to merge Tailwind CSS classes
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Format currency values

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

//  Format dates in a human-readable way
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(dateObj)
}


//  Get relative time string (e.g., "2 days ago", "in 5 days")
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = dateObj.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays === -1) return 'Yesterday'
  if (diffInDays > 0) return `In ${diffInDays} days`
  return `${Math.abs(diffInDays)} days ago`
}


// Calculate days until a date

export function getDaysUntil(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = dateObj.getTime() - now.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

// Truncate text with ellipsis

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}


// Generate random ID

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Generate secure friend code

export function generateFriendCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}


// Debounce function

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
// Throttle function

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}


// Deep clone object

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}


// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Must be at least 8 characters')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Must contain a number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Must contain special character')
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (errors.length === 0) {
    strength = password.length >= 12 ? 'strong' : 'medium'
  } else if (errors.length <= 2) {
    strength = 'medium'
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}


// Generate avatar URL using DiceBear
export function generateAvatarUrl(seed: string, style: 'avataaars' | 'personas' | 'lorelei' = 'personas'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f97316,06b6d4,84cc16`
}


// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Format file size

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}


// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Format friend code with spaces
export function formatFriendCode(code: string): string {
  return code.replace(/(.{4})/g, '$1 ').trim()
}

// Check if date is today

export function isToday(date: string | Date): boolean {
  const today = new Date()
  const checkDate = typeof date === 'string' ? new Date(date) : date
  
  return today.toDateString() === checkDate.toDateString()
}

// Check if date is this week

export function isThisWeek(date: string | Date): boolean {
  const today = new Date()
  const checkDate = typeof date === 'string' ? new Date(date) : date
  
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
  
  return checkDate >= startOfWeek && checkDate <= endOfWeek
}

/**
 * Constants for the application
 */
export const CONSTANTS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  
  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'gw_auth_token',
    REFRESH_TOKEN: 'gw_refresh_token',
    USER_DATA: 'gw_user_data',
    THEME_PREFERENCE: 'gw_theme',
    NOTIFICATIONS_ENABLED: 'gw_notifications',
    ONBOARDING_COMPLETED: 'gw_onboarding_completed',
  },
  
  // Animation durations
  ANIMATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // API timeouts
  TIMEOUTS: {
    DEFAULT: 15000,
    UPLOAD: 30000,
    LONG_POLLING: 60000,
  },
  
  // Event types
  EVENT_TYPES: [
    { value: 'birthday', label: '🎂 Birthday', color: 'from-brand-500 to-brand-600' },
    { value: 'wedding', label: '💒 Wedding', color: 'from-pink-500 to-rose-500' },
    { value: 'anniversary', label: '💕 Anniversary', color: 'from-purple-500 to-violet-500' },
    { value: 'graduation', label: '🎓 Graduation', color: 'from-blue-500 to-indigo-500' },
    { value: 'baby_shower', label: '👶 Baby Shower', color: 'from-teal-500 to-cyan-500' },
    { value: 'housewarming', label: '🏠 Housewarming', color: 'from-green-500 to-emerald-500' },
    { value: 'holiday', label: '🎄 Holiday', color: 'from-red-500 to-orange-500' },
    { value: 'other', label: '🎉 Other Celebration', color: 'from-yellow-500 to-amber-500' }
  ] as const,
  
  // Gift priorities
  GIFT_PRIORITIES: [
    { value: 1, label: 'Low Priority', color: '#84cc16', icon: '⭐' },
    { value: 2, label: 'Medium Priority', color: '#f97316', icon: '⭐⭐' },
    { value: 3, label: 'High Priority', color: '#ef4444', icon: '⭐⭐⭐' },
    { value: 4, label: 'Very High Priority', color: '#8b5cf6', icon: '⭐⭐⭐⭐' },
    { value: 5, label: 'Must Have!', color: '#ec4899', icon: '💖' },
  ] as const,
  
  // File upload limits
  FILE_LIMITS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_FILES: 5,
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // Validation rules
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MAX_EVENT_TITLE_LENGTH: 100,
    MAX_ITEM_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    FRIEND_CODE_LENGTH: 8,
  },
  
  // URLs
  URLS: {
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
    SUPPORT: '/support',
    DOCS: '/docs',
  },
  
  // Feature flags (would typically come from environment)
  FEATURES: {
    REAL_TIME_NOTIFICATIONS: true,
    FILE_UPLOADS: true,
    GIFT_IMAGES: true,
    SOCIAL_SHARING: true,
    ADVANCED_SEARCH: true,
  },
} as const

// Export types
export type EventType = typeof CONSTANTS.EVENT_TYPES[number]['value']
export type GiftPriority = typeof CONSTANTS.GIFT_PRIORITIES[number]['value']

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'GENERIC_ERROR')
  }
  
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR')
}

// Local storage utilities with error handling
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      if (typeof window === 'undefined') return defaultValue || null
      
      const item = localStorage.getItem(key)
      if (!item) return defaultValue || null
      
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return defaultValue || null
    }
  },
  
  set: (key: string, value: any): boolean => {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error)
      return false
    }
  },
  
  remove: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error)
      return false
    }
  },
  
  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') return false
      
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage', error)
      return false
    }
  }
}

// URL utilities
export const urlUtils = {
  addSearchParams: (url: string, params: Record<string, string | number | boolean>): string => {
    const urlObj = new URL(url, window.location.origin)
    
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, String(value))
    })
    
    return urlObj.toString()
  },
  
  getSearchParam: (param: string): string | null => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  },
  
  removeSearchParam: (param: string): void => {
    if (typeof window === 'undefined') return
    
    const url = new URL(window.location.href)
    url.searchParams.delete(param)
    
    window.history.replaceState({}, '', url.toString())
  }
}

// Date utilities
export const dateUtils = {
  isExpired: (date: string | Date): boolean => {
    const expDate = typeof date === 'string' ? new Date(date) : date
    return expDate < new Date()
  },
  
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  
  addHours: (date: Date, hours: number): Date => {
    const result = new Date(date)
    result.setHours(result.getHours() + hours)
    return result
  },
  
  startOfDay: (date: Date): Date => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  },
  
  endOfDay: (date: Date): Date => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  },
  
  isSameDay: (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString()
  },
  
  formatForInput: (date: Date): string => {
    return date.toISOString().split('T')[0]
  }
}

// Array utilities
export const arrayUtils = {
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)]
  },
  
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key])
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },
  
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },
  
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}