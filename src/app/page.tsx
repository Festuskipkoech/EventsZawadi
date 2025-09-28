'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Gift, Users, Calendar, Heart, ArrowRight, Star, Sparkles, Menu, X } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return null
  }

  const features = [
    {
      icon: Gift,
      title: 'Smart Wishlists',
      description: 'Create beautiful wishlists for any occasion. Never receive duplicate gifts again!',
      color: 'from-brand-500 to-brand-600'
    },
    {
      icon: Users,
      title: 'Connect with Friends',
      description: 'Share friend codes or shareable links to build your gifting circle easily.',
      color: 'from-ocean-500 to-ocean-600'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Track birthdays, weddings, and special moments. Never miss an important date!',
      color: 'from-nature-500 to-nature-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-brand-400/20 to-ocean-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-nature-400/20 to-brand-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-2 md:space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl md:rounded-3xl flex items-center justify-center transform -rotate-12">
              <Gift className="w-4 h-4 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-xl md:text-3xl font-lato font-black text-gradient-brand">
              Events Zawadi
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/login">
              <Button variant="ghost" size="md">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={18} />}>
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-warm-600 hover:text-brand-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-warm-200 px-4 py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" size="md" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center" rightIcon={<ArrowRight size={18} />}>
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-20 pb-16 md:pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 md:mb-8"
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-lato font-black text-warm-800 mb-4 md:mb-6 leading-tight">
                Make Gift-Giving
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-brand-500">
                  Magical ✨
                </span>
              </h2>
              <p className="text-base md:text-xl lg:text-2xl text-warm-600 max-w-3xl mx-auto font-inter leading-relaxed px-4">
                Create beautiful wishlists, connect with friends, and never worry about duplicate gifts again. 
                Turn every special moment into a celebration!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:min-w-[200px] h-12 md:h-14"
                  rightIcon={<Sparkles size={20} />}
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:min-w-[200px] h-12 md:h-14"
                  rightIcon={<ArrowRight size={20} />}
                >
                  I Have Account
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 text-warm-600 mb-12 md:mb-20 px-4"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                <span className="font-semibold text-sm md:text-base">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-current" />
                <span className="font-semibold text-sm md:text-base">10K+ Happy Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 md:w-5 md:h-5 text-brand-500" />
                <span className="font-semibold text-sm md:text-base">50K+ Gifts Given</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12 md:mb-16"
          >
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-lato font-black text-warm-800 mb-3 md:mb-4">
              Why Choose Events Zawadi?
            </h3>
            <p className="text-lg md:text-xl text-warm-600 max-w-2xl mx-auto px-4">
              We've reimagined gift-giving to be stress-free, joyful, and perfectly coordinated.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="text-center h-full p-6 md:p-8 hover:scale-105 transition-all duration-300">
                  <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg`}>
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-lato font-bold text-warm-800 mb-3 md:mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-warm-600 font-inter leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-500 via-ocean-500 to-nature-500 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-lato font-black text-white mb-4 md:mb-6">
                Ready to Transform Gift-Giving? 🎁
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
                Join thousands of happy users who've made their celebrations unforgettable with Events Zawadi.
              </p>
              <Link href="/register">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white text-brand-600 border-white hover:bg-brand-50 w-full sm:w-auto sm:min-w-[250px] h-12 md:h-14"
                  rightIcon={<Sparkles size={20} />}
                >
                  Start Creating Magic
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-warm-800 text-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl md:rounded-2xl flex items-center justify-center transform -rotate-12">
                <Gift className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-lato font-black">Events Zawadi</span>
            </div>
            <p className="text-warm-300 font-inter text-sm md:text-base">
              © 2025 Events Zawadi • Making gift-giving magical
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}