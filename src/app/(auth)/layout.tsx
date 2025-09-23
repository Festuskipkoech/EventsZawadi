
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-brand-400/30 to-ocean-400/30 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-nature-400/30 to-brand-400/30 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-ocean-400/20 to-nature-400/20 rounded-full blur-2xl animate-pulse-slow" />
      
      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}