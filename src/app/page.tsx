'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Gift, Users, Calendar, Heart, ArrowRight, Star, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

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
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-ocean-400/15 to-nature-400/15 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center transform -rotate-12">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-lato font-black text-gradient-brand">
              Events Zawadi
            </h1>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
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
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-6xl md:text-7xl font-lato font-black text-warm-800 mb-6 leading-tight">
                Make Gift-Giving
                <span className="block text-gradient-celebration">Magical ✨</span>
              </h2>
              <p className="text-xl md:text-2xl text-warm-600 max-w-3xl mx-auto font-inter leading-relaxed">
                Create beautiful wishlists, connect with friends, and never worry about duplicate gifts again. 
                Turn every special moment into a celebration!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/register">
                <Button 
                  variant="primary" 
                  size="xl" 
                  className="min-w-[200px]"
                  rightIcon={<Sparkles size={24} />}
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="min-w-[200px]"
                  rightIcon={<ArrowRight size={24} />}
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
              className="flex flex-wrap justify-center items-center gap-8 text-warm-600 mb-20"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="font-semibold">10K+ Happy Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-brand-500" />
                <span className="font-semibold">50K+ Gifts Given</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-lato font-black text-warm-800 mb-4">
              Why Choose GiftWish?
            </h3>
            <p className="text-xl text-warm-600 max-w-2xl mx-auto">
              We've reimagined gift-giving to be stress-free, joyful, and perfectly coordinated.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="text-center h-full p-8 hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-lato font-bold text-warm-800 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-warm-600 font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-500 via-ocean-500 to-nature-500 py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-5xl font-lato font-black text-white mb-6">
                Ready to Transform Gift-Giving? 🎁
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of happy users who've made their celebrations unforgettable with GiftWish.
              </p>
              <Link href="/register">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="bg-white text-brand-600 border-white hover:bg-brand-50 min-w-[250px]"
                  rightIcon={<Sparkles size={24} />}
                >
                  Start Creating Magic
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-warm-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center transform -rotate-12">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-lato font-black">Events Zawadi</span>
            </div>
            <p className="text-warm-300 font-inter">
              © 2025 Events Zawadi</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
