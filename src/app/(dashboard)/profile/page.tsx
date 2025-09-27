'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getInitials, formatDate } from '@/lib/utils'
import { apiService } from '@/services/api'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { 
  User, 
  Mail,
  Calendar,
  Hash,
  Copy,
  Check,
  Settings,
  Shield,
  Bell,
  Gift,
  Users,
  CalendarDays
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const { user } = useAuth()
  const [codeCopied, setCodeCopied] = useState(false)
  const [stats, setStats] = useState({
    eventsCreated: 0,
    friendsCount: 0,
    giftsGiven: 0,
    giftsReceived: 0
  })
  const [loading, setLoading] = useState(true)

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        
        // Fetch real data from backend
        const [myEvents, friends, givenGifts, receivedGifts] = await Promise.all([
          apiService.getMyEvents().catch(() => []),
          apiService.getFriends().catch(() => []),
          apiService.getGivenGifts().catch(() => []),
          apiService.getReceivedGifts().catch(() => [])
        ])

        setStats({
          eventsCreated: myEvents.length,
          friendsCount: friends.length,
          giftsGiven: givenGifts.length,
          giftsReceived: receivedGifts.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user?.friendCode || '')
      setCodeCopied(true)
      toast.success('Friend code copied!')
      setTimeout(() => setCodeCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
          Profile Settings ⚙️
        </h1>
        <p className="text-warm-600">
          Manage your account information and view your activity
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-xl">
                  {user.avatarUrl ? (
                    <Image 
                      src={user.avatarUrl} 
                      alt={user.name}
                      width={96}
                      height={96}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                {/* Note: Avatar upload removed since backend doesn't support file upload */}
              </div>
              <h2 className="text-2xl font-lato font-bold text-warm-800">
                {user.name}
              </h2>
              <p className="text-warm-600">@{user.friendCode}</p>
            </div>

            {/* Profile Information (Read Only) */}
            <div className="space-y-6">
              <div className="pb-4 border-b border-warm-200">
                <h3 className="text-lg font-lato font-bold text-warm-800">
                  Account Information
                </h3>
                <p className="text-sm text-warm-600 mt-1">
                  Your account details are managed securely
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={user.name}
                  leftIcon={<User size={18} />}
                  disabled
                />

                <Input
                  type="email"
                  label="Email Address"
                  value={user.email}
                  leftIcon={<Mail size={18} />}
                  disabled
                />

                <Input
                  type="text"
                  label="Friend Code"
                  value={user.friendCode}
                  leftIcon={<Hash size={18} />}
                  disabled
                  rightIcon={
                    <button 
                      onClick={handleCopyCode}
                      className="text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      {codeCopied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  }
                />

                <Input
                  type="text"
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                  leftIcon={<Calendar size={18} />}
                  disabled
                />
              </div>

              {/* Note about profile updates */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Settings className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Profile Updates</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Profile editing features are coming soon! Contact support if you need to update your information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          
          {/* Activity Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-lato font-bold text-warm-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-brand-500" />
              Your Activity
            </h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 bg-warm-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-warm-200 rounded animate-pulse w-8"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-warm-600 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Events Created
                  </span>
                  <span className="font-bold text-warm-800">{stats.eventsCreated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-warm-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Friends
                  </span>
                  <span className="font-bold text-warm-800">{stats.friendsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-warm-600 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Gifts Given
                  </span>
                  <span className="font-bold text-warm-800">{stats.giftsGiven}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-warm-600 flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Gifts Received
                  </span>
                  <span className="font-bold text-warm-800">{stats.giftsReceived}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Settings Menu */}
          <Card className="p-6">
            <h3 className="text-lg font-lato font-bold text-warm-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-brand-500" />
              Settings
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 text-left text-warm-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Notifications</span>
                <span className="ml-auto text-xs text-warm-500">Coming Soon</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left text-warm-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Privacy</span>
                <span className="ml-auto text-xs text-warm-500">Coming Soon</span>
              </button>
            </div>
          </Card>

          {/* Friend Code Card */}
          <Card className="p-6 text-center bg-gradient-to-br from-brand-50 to-ocean-50 border-2 border-brand-200">
            <Hash className="w-8 h-8 text-brand-500 mx-auto mb-3" />
            <h3 className="font-lato font-bold text-warm-800 mb-2">
              Your Friend Code
            </h3>
            <div className="bg-white rounded-xl p-3 mb-4">
              <code className="text-2xl font-mono font-bold text-brand-600">
                {user.friendCode}
              </code>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full"
              onClick={handleCopyCode}
              leftIcon={codeCopied ? <Check size={16} /> : <Copy size={16} />}
            >
              {codeCopied ? 'Copied!' : 'Copy Code'}
            </Button>
            <p className="text-xs text-warm-500 mt-2">
              Share this code with friends to connect
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}