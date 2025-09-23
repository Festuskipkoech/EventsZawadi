
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiService } from '@/services/api'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { Calendar, Gift, ArrowLeft, Sparkles, Type} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'birthday'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required'
    } else {
      const selectedDate = new Date(formData.eventDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date must be in the future'
      }
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      const event = await apiService.createEvent(formData)
      toast.success('Event created successfully! 🎉')
      router.push(`/events/${event.id}/wishlist`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const eventTypeOptions = [
    { value: 'birthday', label: '🎂 Birthday', color: 'from-brand-500 to-brand-600' },
    { value: 'wedding', label: '💒 Wedding', color: 'from-pink-500 to-rose-500' },
    { value: 'anniversary', label: '💕 Anniversary', color: 'from-purple-500 to-violet-500' },
    { value: 'graduation', label: '🎓 Graduation', color: 'from-blue-500 to-indigo-500' },
    { value: 'baby_shower', label: '👶 Baby Shower', color: 'from-teal-500 to-cyan-500' },
    { value: 'housewarming', label: '🏠 Housewarming', color: 'from-green-500 to-emerald-500' },
    { value: 'holiday', label: '🎄 Holiday', color: 'from-red-500 to-orange-500' },
    { value: 'other', label: '🎉 Other Celebration', color: 'from-yellow-500 to-amber-500' }
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800">
            Create New Event ✨
          </h1>
          <p className="text-warm-600">
            Set up your celebration and start building your wishlist
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Event Title */}
            <Input
              type="text"
              name="title"
              label="Event Title"
              placeholder="e.g., My 25th Birthday Party"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              leftIcon={<Type size={18} />}
              variant="floating"
            />

            {/* Event Date */}
            <Input
              type="date"
              name="eventDate"
              label="Event Date"
              value={formData.eventDate}
              onChange={handleInputChange}
              error={errors.eventDate}
              leftIcon={<Calendar size={18} />}
              variant="floating"
            />

            {/* Event Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-700 mb-3 font-inter">
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {eventTypeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, eventType: option.value }))}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                      formData.eventType === option.value
                        ? 'border-brand-500 bg-brand-50 shadow-lg scale-105'
                        : 'border-warm-200 hover:border-brand-300 hover:bg-brand-25'
                    }`}
                    whileHover={{ scale: formData.eventType === option.value ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`text-sm font-semibold ${
                      formData.eventType === option.value ? 'text-brand-700' : 'text-warm-700'
                    }`}>
                      {option.label}
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.eventType && (
                <p className="text-sm text-red-500 mt-2">{errors.eventType}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-700 font-inter">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Tell your friends about your special event..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl border-2 border-warm-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                isLoading={loading}
                rightIcon={<Sparkles size={20} />}
              >
                Create Event
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-r from-brand-50 to-ocean-50 border-2 border-brand-200">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-lato font-bold text-warm-800 mb-2">
                Pro Tip
              </h3>
              <p className="text-warm-600 text-sm">
                After creating your event, you'll be able to add items to your wishlist. 
                Your friends will receive notifications and can start pledging gifts!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}