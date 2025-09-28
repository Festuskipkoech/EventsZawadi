'use client'

import React, { InputHTMLAttributes, forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'floating'
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      variant = 'default',
      helperText,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const isPasswordType = type === 'password'
    const actualType = isPasswordType && showPassword ? 'text' : type

    const baseClasses = 'w-full transition-all duration-300 focus:outline-none bg-white/80 backdrop-blur-sm'
    
    const variantClasses = {
      default: 'px-4 py-3 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20',
      floating: 'px-4 pt-6 pb-2 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20',
    }

    const errorClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
      : ''
    
    const successClasses = success 
      ? 'border-nature-500 focus:border-nature-500 focus:ring-nature-500/20' 
      : ''

    const disabledClasses = disabled 
      ? 'opacity-60 cursor-not-allowed bg-warm-50' 
      : ''

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      if (props.onChange) props.onChange(e)
    }

    return (
      <div className="relative">
        {/* Traditional Label */}
        {label && variant === 'default' && (
          <motion.label 
            className="block text-sm font-medium text-warm-700 mb-2 font-inter"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500 z-10">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={ref}
            type={actualType}
            className={cn(
              baseClasses,
              variantClasses[variant],
              errorClasses,
              successClasses,
              disabledClasses,
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType || error || success) && 'pr-12',
              className
            )}
            placeholder={variant === 'floating' ? ' ' : placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {/* Floating Label */}
          {label && variant === 'floating' && (
            <motion.label
              className={cn(
                'absolute left-4 transition-all duration-200 pointer-events-none font-inter',
                leftIcon ? 'left-10' : 'left-4',
                isFocused || hasValue
                  ? 'top-4 text-xs text-brand-600 font-medium'
                  : 'top-5 -translate-y-1/2 text-sm text-warm-500'
              )}
              animate={{
                scale: isFocused || hasValue ? 0.85 : 1,
                y: isFocused || hasValue ? -8 : 0,
              }}
            >
              {label}
            </motion.label>
          )}

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Success Icon */}
            {success && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-nature-500"
              >
                <Check size={18} />
              </motion.div>
            )}

            {/* Error Icon */}
            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <AlertCircle size={18} />
              </motion.div>
            )}

            {/* Password Toggle */}
            {isPasswordType && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-warm-500 hover:text-brand-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !error && !success && (
              <div className="text-warm-500">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text, Error, or Success Message */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                'mt-2 text-sm font-inter',
                error && 'text-red-500',
                success && 'text-nature-500',
                !error && !success && 'text-warm-600'
              )}
            >
              {error || success || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input