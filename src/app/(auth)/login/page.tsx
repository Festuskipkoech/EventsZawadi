'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { isValidEmail } from '@/lib/utils'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import { Mail, Lock, ArrowRight, Gift } from 'lucide-react'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login(formData.email, formData.password)
    } catch (error) {
      console.error("Error: ", error)
      // Error handled by auth context
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-8" hover={false}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
          >
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
            Welcome Back! 
          </h1>
          <p className="text-warm-600 font-inter">
            Sign in to your magical gift world ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            leftIcon={<Mail size={18} />}
            variant="floating"
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            variant="floating"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={20} />}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-warm-600 font-inter">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Create one here
            </Link>
          </p>
          
          <div className="text-xs text-warm-500">
            By signing in, you agree to our magical terms ✨
          </div>
        </div>
      </Card>
    </motion.div>
  )
}