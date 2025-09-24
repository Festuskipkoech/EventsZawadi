'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import Image from 'next/image';
import { 
  Gift, 
  Calendar, 
  Users, 
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronDown
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationCount] = useState(3) 
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/friends', label: 'Friends', icon: Users },
    { href: '/gifts', label: 'Gifts', icon: Gift },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    logout()
  }

  if (!user) return null

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200"
                whileHover={{ rotate: 12 }}
              >
                <Gift className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-lato font-black text-warm-800 group-hover:text-brand-600 transition-colors">
                Events Zawadi
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-4 py-2 rounded-xl font-inter font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive(item.href)
                        ? 'bg-brand-100 text-brand-700 shadow-sm'
                        : 'text-warm-600 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Notifications */}
              <motion.button
                className="relative p-2 text-warm-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-warm-50 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.avatarUrl ? (
                      <Image 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-warm-800 truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-xs text-warm-500">
                      @{user.friendCode}
                    </p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-warm-400 transition-transform duration-200 ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-warm-200 py-2 z-50"
                    >
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-warm-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold shadow-lg">
                            {user.avatarUrl ? (
                              <Image
                                src={user.avatarUrl} 
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(user.name)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-warm-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-warm-500 truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-brand-600 font-medium">
                              @{user.friendCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link href="/profile">
                          <motion.div
                            className="flex items-center space-x-3 px-4 py-2 text-warm-700 hover:bg-warm-50 hover:text-brand-600 transition-colors cursor-pointer"
                            onClick={() => setIsProfileMenuOpen(false)}
                            whileHover={{ x: 4 }}
                          >
                            <User size={16} />
                            <span className="font-medium">Profile Settings</span>
                          </motion.div>
                        </Link>

                        <motion.div
                          className="flex items-center space-x-3 px-4 py-2 text-warm-700 hover:bg-warm-50 hover:text-brand-600 transition-colors cursor-pointer"
                          whileHover={{ x: 4 }}
                        >
                          <Settings size={16} />
                          <span className="font-medium">Preferences</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center space-x-3 px-4 py-2 text-warm-700 hover:bg-warm-50 hover:text-brand-600 transition-colors cursor-pointer"
                          whileHover={{ x: 4 }}
                        >
                          <Bell size={16} />
                          <span className="font-medium">Notifications</span>
                          {notificationCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                              {notificationCount}
                            </span>
                          )}
                        </motion.div>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-warm-100 pt-2">
                        <motion.button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut size={16} />
                          <span className="font-medium">Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-warm-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-warm-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-brand-100 text-brand-700'
                          : 'text-warm-600 hover:text-brand-600 hover:bg-brand-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}