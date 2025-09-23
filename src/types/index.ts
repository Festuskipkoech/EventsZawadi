export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  friendCode: string
  joinedAt: string
  bio?: string
  location?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  notifications: NotificationSettings
  privacy: PrivacySettings
  theme: 'light' | 'dark' | 'system'
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  friendRequests: boolean
  wishlistUpdates: boolean
  giftReminders: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  showLocation: boolean
}

export interface Wishlist {
  id: string
  userId: string
  title: string
  description?: string
  eventDate: string
  eventType: EventType
  items: WishlistItem[]
  isPublic: boolean
  shareCode: string
  createdAt: string
  updatedAt: string
  coverImage?: string
  tags?: string[]
}

export interface WishlistItem {
  id: string
  wishlistId: string
  title: string
  description?: string
  price?: number
  currency: string
  priority: Priority
  category?: string
  url?: string
  images: string[]
  isPurchased: boolean
  purchasedBy?: string // User ID (hidden from wishlist owner)
  purchasedAt?: string
  purchaseDeadline?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Friend {
  id: string
  userId: string
  friendId: string
  status: FriendStatus
  requestedAt: string
  acceptedAt?: string
  nickname?: string
}

export interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  message?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
}

// Enums
export type EventType = 
  | 'birthday'
  | 'wedding'
  | 'baby_shower'
  | 'graduation'
  | 'housewarming'
  | 'holiday'
  | 'anniversary'
  | 'other'

export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type FriendStatus = 'pending' | 'accepted' | 'blocked'

export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'wishlist_shared'
  | 'item_purchased'
  | 'event_reminder'
  | 'deadline_reminder'
  | 'system'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrevious: boolean
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignupForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface WishlistForm {
  title: string
  description?: string
  eventDate: string
  eventType: EventType
  isPublic: boolean
  coverImage?: File
  tags: string[]
}

export interface WishlistItemForm {
  title: string
  description?: string
  price?: number
  currency: string
  priority: Priority
  category?: string
  url?: string
  images: File[]
  notes?: string
}

export interface ProfileForm {
  name: string
  bio?: string
  location?: string
  avatar?: File
}

// Component Props types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  border?: boolean
  hover?: boolean
}

// Hook types
export interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => void
  removeValue: () => void
}

export interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginForm) => Promise<void>
  signup: (data: SignupForm) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface UseWishlistsReturn {
  wishlists: Wishlist[]
  isLoading: boolean
  error: string | null
  createWishlist: (data: WishlistForm) => Promise<Wishlist>
  updateWishlist: (id: string, data: Partial<Wishlist>) => Promise<Wishlist>
  deleteWishlist: (id: string) => Promise<void>
  getWishlist: (id: string) => Promise<Wishlist | null>
  getSharedWishlist: (shareCode: string) => Promise<Wishlist | null>
  addItem: (wishlistId: string, item: WishlistItemForm) => Promise<WishlistItem>
  updateItem: (itemId: string, data: Partial<WishlistItem>) => Promise<WishlistItem>
  deleteItem: (itemId: string) => Promise<void>
  purchaseItem: (itemId: string, deadline?: string) => Promise<void>
}

export interface UseFriendsReturn {
  friends: User[]
  friendRequests: FriendRequest[]
  isLoading: boolean
  error: string | null
  sendFriendRequest: (friendCode: string, message?: string) => Promise<void>
  acceptFriendRequest: (requestId: string) => Promise<void>
  declineFriendRequest: (requestId: string) => Promise<void>
  removeFriend: (friendId: string) => Promise<void>
  blockFriend: (friendId: string) => Promise<void>
  getFriendWishlists: (friendId: string) => Promise<Wishlist[]>
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Animation types
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  loop?: boolean
}

export interface FloatingShapeConfig {
  size: number
  color: string
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface Theme {
  name: string
  colors: ThemeColors
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}