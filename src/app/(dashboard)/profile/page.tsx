
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Bell,
  Gift,
  Users,
  CalendarDays,
  Edit,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [codeCopied, setCodeCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })
  const [stats, setStats] = useState({
    eventsCreated: 0,
    friendsCount: 0,
    giftsGiven: 0,
    giftsReceived: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Initialize form when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true)
        
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
        setStatsLoading(false)
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

  const handleEditClick = () => {
    setIsEditing(true)
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    })
  }

  const handleSaveProfile = async () => {
    if (!user) return

    // Validation
    if (!editForm.name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    if (!editForm.email.trim()) {
      toast.error('Email cannot be empty')
      return
    }

    // Check if anything actually changed
    const hasChanges = editForm.name !== user.name || editForm.email !== user.email
    if (!hasChanges) {
      setIsEditing(false)
      return
    }

    try {
      setIsLoading(true)
      
      const updates: { name?: string; email?: string } = {}
      if (editForm.name !== user.name) updates.name = editForm.name.trim()
      if (editForm.email !== user.email) updates.email = editForm.email.trim()

      await updateProfile(updates)
      setIsEditing(false)
    } catch (error) {
      // Error is already handled by the context
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
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
              </div>
              <h2 className="text-2xl font-lato font-bold text-warm-800">
                {user.name}
              </h2>
              <p className="text-warm-600">@{user.friendCode}</p>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="pb-4 border-b border-warm-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-lato font-bold text-warm-800">
                    Account Information
                  </h3>
                  <p className="text-sm text-warm-600 mt-1">
                    {isEditing ? 'Update your profile information' : 'Your account details'}
                  </p>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    leftIcon={<Edit size={16} />}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      leftIcon={<X size={16} />}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveProfile}
                      leftIcon={<Save size={16} />}
                      disabled={isLoading}
                      loading={isLoading}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={isEditing ? editForm.name : user.name}
                  leftIcon={<User size={18} />}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />

                <Input
                  type="email"
                  label="Email Address"
                  value={isEditing ? editForm.email : user.email}
                  leftIcon={<Mail size={18} />}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
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

              {/* Info about read-only fields */}
              {!isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Profile Information</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        You can update your name and email address. Your friend code is unique and cannot be changed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            {statsLoading ? (
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
              <Link href="/notifications" className="w-full flex items-center space-x-3 p-3 text-left text-warm-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Notifications</span>
              </Link>
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