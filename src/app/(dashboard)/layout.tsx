'use client'

import React from 'react'
import { withAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 overflow-x-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 overflow-x-hidden w-full">
        {children}
      </main>
      
      {/* Mobile Bottom Tab Spacer */}
      <div className="md:hidden h-20" />
    </div>
  )
}

export default withAuth(DashboardLayout)