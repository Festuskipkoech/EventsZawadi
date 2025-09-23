
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format dates in a human-readable way
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(dateObj)
}

/**
 * Get relative time string (e.g., "2 days ago", "in 5 days")
 */
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

/**
 * Calculate days until a date
 */
export function getDaysUntil(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = dateObj.getTime() - now.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function
 */
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

/**
 * Deep clone object
 */
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

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate avatar URL using DiceBear
 */
export function generateAvatarUrl(seed: string, style: 'avataaars' | 'personas' | 'lorelei' = 'personas'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f97316,06b6d4,84cc16`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Constants for the application
 */
export const CONSTANTS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'GiftWish',
  
  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'gw_auth_token',
    USER_DATA: 'gw_user_data',
    THEME_PREFERENCE: 'gw_theme',
    NOTIFICATIONS_ENABLED: 'gw_notifications',
  },
  
  // Animation durations
  ANIMATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Event types
  EVENT_TYPES: [
    'birthday',
    'wedding',
    'anniversary',
    'graduation',
    'baby_shower',
    'housewarming',
    'holiday',
    'other'
  ] as const,
  
  // Gift priorities
  GIFT_PRIORITIES: [
    { value: 1, label: 'Low', color: '#84cc16' },
    { value: 2, label: 'Medium', color: '#f97316' },
    { value: 3, label: 'High', color: '#ef4444' },
    { value: 4, label: 'Must Have', color: '#8b5cf6' },
  ] as const,
} as const

// Export types
export type EventType = typeof CONSTANTS.EVENT_TYPES[number]
export type GiftPriority = typeof CONSTANTS.GIFT_PRIORITIES[number]['value']