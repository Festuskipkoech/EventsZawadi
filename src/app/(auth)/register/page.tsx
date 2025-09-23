'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { isValidEmail, validatePassword } from '@/lib/utils'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import { Mail, Lock, ArrowRight, Gift, User, CheckCircle, XCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    strength: 'weak' as 'weak' | 'medium' | 'strong'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Validate password in real-time
    if (name === 'password') {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Please fix password requirements'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await register(formData.email, formData.password, formData.name)
    } catch (error) {
        console.error("Error: ", error)
      // Error handled by auth context
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'strong': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStrengthBars = (strength: string) => {
    const bars = 3
    const filled = strength === 'weak' ? 1 : strength === 'medium' ? 2 : 3
    
    return (
      <div className="flex space-x-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full ${
              i < filled 
                ? strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    )
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
            Join GiftWish! 
          </h1>
          <p className="text-warm-600 font-inter">
            Create your account and start making gift-giving magical ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            leftIcon={<User size={18} />}
            variant="floating"
          />

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

          <div className="space-y-3">
            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              leftIcon={<Lock size={18} />}
              variant="floating"
            />
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warm-600">Password strength:</span>
                  <div className="flex items-center space-x-2">
                    {getStrengthBars(passwordValidation.strength)}
                    <span className={`text-sm font-medium capitalize ${getStrengthColor(passwordValidation.strength)}`}>
                      {passwordValidation.strength}
                    </span>
                  </div>
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-1">
                  {[
                    { test: formData.password.length >= 8, text: 'At least 8 characters' },
                    { test: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
                    { test: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                    { test: /\d/.test(formData.password), text: 'One number' },
                    { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: 'One special character' }
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      {requirement.test ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className={requirement.test ? 'text-green-600' : 'text-gray-500'}>
                        {requirement.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            leftIcon={<Lock size={18} />}
            variant="floating"
            success={formData.confirmPassword && formData.password === formData.confirmPassword ? 'Passwords match!' : undefined}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={20} />}
            disabled={!passwordValidation.isValid || formData.password !== formData.confirmPassword}
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-warm-600 font-inter">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Sign in here
            </Link>
          </p>
          
          <div className="text-xs text-warm-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-brand-600 hover:text-brand-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}