'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import NotificationBell from '@/components/NotificationBell'
import Image from 'next/image'
import { 
  Gift, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Home,
  MoreVertical,
  Bell
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false)
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
    setIsMoreMenuOpen(false)
    logout()
  }

  if (!user) return null

  return (
    <>
      {/* Desktop & Tablet Top Navbar */}
      <nav className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-200 shadow-sm">
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
            <div className="flex items-center space-x-1">
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
              <NotificationBell />
              
              {/* Profile Button */}
              <Link href="/profile">
                <motion.button
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-warm-50 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.avatarUrl ? (
                      <Image 
                        src={user.avatarUrl} 
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-warm-800 truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-xs text-warm-500">
                      @{user.friendCode}
                    </p>
                  </div>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-lato font-black text-warm-800">
              Events Zawadi
            </span>
          </Link>

          {/* Profile Avatar */}
          <Link href="/profile">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold text-sm shadow-lg"
            >
              {user.avatarUrl ? (
                <Image 
                  src={user.avatarUrl} 
                  alt={user.name}
                  width={36}
                  height={36}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-tab-bar">
        <div className="bg-white/95 backdrop-blur-xl border-t border-warm-200 shadow-2xl">
          <div className="flex items-center justify-around px-2 py-2 safe-bottom">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <motion.div
                    className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 relative"
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="mobile-active-tab"
                        className="absolute inset-0 bg-brand-50 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      <Icon 
                        size={22} 
                        className={`transition-colors duration-200 ${
                          active ? 'text-brand-600' : 'text-warm-500'
                        }`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs font-medium mt-1 transition-colors duration-200 relative z-10 ${
                      active ? 'text-brand-700' : 'text-warm-600'
                    }`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}

            {/* More Menu Tab */}
            <div className="flex-1 relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="w-full"
              >
                <motion.div
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300"
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreVertical 
                    size={22} 
                    className={`transition-colors duration-200 ${
                      isMoreMenuOpen ? 'text-brand-600' : 'text-warm-500'
                    }`}
                    strokeWidth={isMoreMenuOpen ? 2.5 : 2}
                  />
                  <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                    isMoreMenuOpen ? 'text-brand-700' : 'text-warm-600'
                  }`}>
                    More
                  </span>
                </motion.div>
              </button>

              {/* Compact Dropdown Menu */}
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                      onClick={() => setIsMoreMenuOpen(false)}
                      style={{ bottom: '80px' }} // Don't cover bottom tabs
                    />

                    {/* Compact Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-2xl shadow-2xl border border-warm-200 overflow-hidden z-[70]"
                    >
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link href="/notifications">
                          <motion.div
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-warm-50 transition-colors"
                            onClick={() => setIsMoreMenuOpen(false)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                              <Bell size={18} className="text-brand-600" />
                            </div>
                            <span className="font-medium text-warm-700 text-sm">Notifications</span>
                          </motion.div>
                        </Link>

                        {/* Divider */}
                        <div className="my-1 border-t border-warm-100"></div>

                        {/* Logout */}
                        <motion.button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <LogOut size={18} className="text-red-600" />
                          </div>
                          <span className="font-medium text-red-600 text-sm">Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}