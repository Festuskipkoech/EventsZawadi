'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getInitials, formatDate } from '@/lib/utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { 
  User, 
  Mail,
  Calendar,
  Hash,
  Edit3,
  Save,
  X,
  Copy,
  Check,
  Settings,
  Shield,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

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

  const handleSave = async () => {
    try {
      // In real app, this would call API to update profile
      toast.success('Profile updated!')
      setIsEditing(false)
      // await apiService.updateProfile(formData)
      // await refreshUser()
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
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
          Manage your account information and preferences
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
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white hover:bg-brand-600 transition-colors shadow-lg">
                  <Edit3 size={14} />
                </button>
              </div>
              <h2 className="text-2xl font-lato font-bold text-warm-800">
                {user.name}
              </h2>
              <p className="text-warm-600">@{user.friendCode}</p>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-warm-200">
                <h3 className="text-lg font-lato font-bold text-warm-800">
                  Account Information
                </h3>
                {!isEditing ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit3 size={16} />}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancel}
                      leftIcon={<X size={16} />}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={handleSave}
                      leftIcon={<Save size={16} />}
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
                  value={isEditing ? formData.name : user.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  leftIcon={<User size={18} />}
                  disabled={!isEditing}
                />

                <Input
                  type="email"
                  label="Email Address"
                  value={isEditing ? formData.email : user.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  leftIcon={<Mail size={18} />}
                  disabled={!isEditing}
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
            </div>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-lato font-bold text-warm-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-brand-500" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-warm-600">Events Created</span>
                <span className="font-bold text-warm-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-warm-600">Friends</span>
                <span className="font-bold text-warm-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-warm-600">Gifts Given</span>
                <span className="font-bold text-warm-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-warm-600">Gifts Received</span>
                <span className="font-bold text-warm-800">0</span>
              </div>
            </div>
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
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left text-warm-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Privacy</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Delete Account</span>
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