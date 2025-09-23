'use client'

import React, { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = true,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative rounded-3xl transition-all duration-300'

    const variants = {
      default: 'bg-white/90 backdrop-blur-sm border border-warm-200 shadow-lg',
      elevated: 'bg-white shadow-xl shadow-warm-900/10',
      outlined: 'bg-transparent border-2 border-warm-300',
      glass: 'glass-morphism border border-white/20',
    }

    const hoverClasses = hover 
      ? 'hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer' 
      : ''

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverClasses,
          paddings[padding],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={hover ? { scale: 1.02, y: -8 } : undefined}
        {...props}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-ocean-500/5 rounded-inherit pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card