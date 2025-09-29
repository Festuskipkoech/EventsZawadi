'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { apiService, Event } from '@/services/api'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { Calendar, ArrowLeft, Save, Type } from 'lucide-react'
import toast from 'react-hot-toast'

export async function generateStaticParams() {
  return [];
}
export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.eventId as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'birthday',
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const events = await apiService.getMyEvents()
      const foundEvent = events.find(e => e.id.toString() === eventId)
      
      if (foundEvent) {
        setEvent(foundEvent)
        setFormData({
          title: foundEvent.title,
          description: foundEvent.description || '',
          eventDate: foundEvent.eventDate,
          eventType: foundEvent.eventType,
          isActive: foundEvent.isActive
        })
      } else {
        toast.error('Event not found or you don\'t have permission to edit it')
        router.push('/events')
      }
    } catch (error) {
      console.error('Error loading event:', error)
      toast.error('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
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
      setSaving(true)
      await apiService.updateEvent(parseInt(eventId), formData)
      toast.success('Event updated successfully! ✏️')
      router.push(`/events/${eventId}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return
    
    if (!confirm(`Are you sure you want to delete "${event.title}"? This will also delete all wishlist items and cannot be undone.`)) {
      return
    }

    try {
      await apiService.deleteEvent(parseInt(eventId))
      router.push('/events')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event')
    }
  }

  const eventTypeOptions = [
    { value: 'birthday', label: '🎂 Birthday' },
    { value: 'wedding', label: '💒 Wedding' },
    { value: 'anniversary', label: '💕 Anniversary' },
    { value: 'graduation', label: '🎓 Graduation' },
    { value: 'baby_shower', label: '👶 Baby Shower' },
    { value: 'housewarming', label: '🏠 Housewarming' },
    { value: 'holiday', label: '🎄 Holiday' },
    { value: 'other', label: '🎉 Other Celebration' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin-slow w-12 h-12 text-brand-500">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-lato font-bold text-warm-600 mb-4">
            Event Not Found
          </h2>
          <p className="text-warm-500 mb-6">
            This event doesn't exist or you don't have permission to edit it.
          </p>
          <Button variant="primary" onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </Card>
      </div>
    )
  }

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
          onClick={() => router.push(`/events/${eventId}`)}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back to Event
        </Button>
        <div>
          <h1 className="text-3xl font-lato font-black text-warm-800">
            Edit Event ✏️
          </h1>
          <p className="text-warm-600">
            Update your event details
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

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 text-brand-600 border-2 border-warm-300 rounded focus:ring-brand-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-warm-700">
                Event is active (visible to friends)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-6">
              {/* Save/Cancel */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push(`/events/${eventId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={saving}
                  rightIcon={<Save size={20} />}
                >
                  Save Changes
                </Button>
              </div>
              
              {/* Delete Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                onClick={handleDelete}
              >
                Delete Event
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}