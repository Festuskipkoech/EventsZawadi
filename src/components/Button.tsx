
'use client'

import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-inter font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      primary: 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl hover:shadow-brand-500/25 focus:ring-brand-500/30 active:scale-95',
      secondary: 'bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 text-white shadow-lg hover:shadow-xl hover:shadow-ocean-500/25 focus:ring-ocean-500/30 active:scale-95',
      accent: 'bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-600 hover:to-nature-700 text-white shadow-lg hover:shadow-xl hover:shadow-nature-500/25 focus:ring-nature-500/30 active:scale-95',
      outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white hover:shadow-lg hover:shadow-brand-500/25 focus:ring-brand-500/30 active:scale-95',
      ghost: 'text-brand-600 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-500/30 active:scale-95',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl min-h-[36px]',
      md: 'px-6 py-3 text-base rounded-2xl min-h-[44px]',
      lg: 'px-8 py-4 text-lg rounded-2xl min-h-[52px]',
      xl: 'px-10 py-5 text-xl rounded-3xl min-h-[60px]',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        <div className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
          {leftIcon && <span className="text-lg">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="text-lg">{rightIcon}</span>}
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
