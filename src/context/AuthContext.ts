
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiService, User, AuthResponse } from '@/services/api'
import { CONSTANTS } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AuthContextType {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  
  // Utilities
  getToken: () => string | null
  isTokenValid: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      const userData = localStorage.getItem(CONSTANTS.STORAGE_KEYS.USER_DATA)

      if (token && userData) {
        // Set token in API service
        apiService.setAuthHeader(token)
        
        // Parse and set user data
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)

        // Verify token by fetching fresh profile
        try {
          await refreshUser()
        } catch (error) {
          // Token invalid, clear auth
          handleLogout()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      handleLogout()
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await apiService.login(email, password)
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const response: AuthResponse = await apiService.register(email, password, name)
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    apiService.logout()
  }

  const refreshUser = async () => {
    try {
      const freshUser = await apiService.getProfile()
      setUser(freshUser)
      
      // Update localStorage
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(freshUser))
    } catch (error) {
      throw error
    }
  }

  const getToken = (): string | null => {
    return localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
  }

  const isTokenValid = (): boolean => {
    const token = getToken()
    if (!token) return false
    
    try {
      // Basic JWT structure validation
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Decode payload (basic check)
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      return payload.exp > now
    } catch {
      return false
    }
  }

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
    
    // Utilities
    getToken,
    isTokenValid,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth()
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = '/login'
      }
    }, [isAuthenticated, isLoading])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin-slow w-12 h-12 text-brand-500">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) return null

    return <Component {...props} />
  }
}