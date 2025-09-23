 'use client'

  import React, { useState, useEffect } from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import { apiService, Friend } from '@/services/api'
  import { getInitials } from '@/lib/utils'
  import Card from '@/components/Card'
  import Button from '@/components/Button'
  import Input from '@/components/Input'
  import Modal from '@/components/Modal'
  import { 
    Users, 
    Plus, 
    Search,
    UserPlus,
    Link as LinkIcon,
    Copy,
    Check,
    Mail,
    Calendar
  } from 'lucide-react'
  import toast from 'react-hot-toast'
import Image from 'next/image';

  export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([])
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    // Modals
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [showShareLinkModal, setShowShareLinkModal] = useState(false)
    
    // Forms
    const [friendCode, setFriendCode] = useState('')
    const [shareableLink, setShareableLink] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)

    useEffect(() => {
      loadFriendsData()
    }, [])

    const loadFriendsData = async () => {
      try {
        setLoading(true)
        const [friendsData, requestsData] = await Promise.all([
          apiService.getFriends(),
          apiService.getFriendRequests()
        ])
        setFriends(friendsData)
        setFriendRequests(requestsData)
      } catch (error) {
        console.error('Error loading friends data:', error)
      } finally {
        setLoading(false)
      }
    }

    const handleSendFriendRequest = async () => {
      try {
        await apiService.sendFriendRequest(friendCode)
        setFriendCode('')
        setShowAddFriendModal(false)
        await loadFriendsData()
      } catch (error: any) {
        toast.error(error.message)
      }
    }

    const handleGenerateLink = async () => {
      try {
        const response = await apiService.generateFriendLink()
        setShareableLink(response.shareableLink)
        setShowShareLinkModal(true)
      } catch (error) {
        toast.error('Failed to generate link')
      }
    }

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(shareableLink)
        setLinkCopied(true)
        toast.success('Link copied!')
        setTimeout(() => setLinkCopied(false), 2000)
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }

    const handleAcceptRequest = async (requestId: number) => {
      try {
        await apiService.acceptFriendRequest(requestId)
        await loadFriendsData()
      } catch (error) {
        toast.error('Failed to accept request')
      }
    }

    const filteredFriends = friends.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-lato font-black text-warm-800 mb-2">
              Friends 👥
            </h1>
            <p className="text-warm-600">
              Connect with friends and family to share the joy of gift-giving
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              variant="secondary" 
              onClick={handleGenerateLink}
              leftIcon={<LinkIcon size={18} />}
            >
              Share Link
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setShowAddFriendModal(true)}
              rightIcon={<Plus size={20} />}
            >
              Add Friend
            </Button>
          </div>
        </motion.div>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-lato font-bold text-warm-800 mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-brand-500" />
              Friend Requests ({friendRequests.length})
            </h2>
            <div className="space-y-3">
              {friendRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center text-white font-bold">
                      {getInitials(request.requester.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-800">{request.requester.name}</h3>
                      <p className="text-sm text-warm-600">{request.requester.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                    <Button variant="outline" size="sm">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search */}
        <Card className="p-6">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </Card>

        {/* Friends Grid */}
        {filteredFriends.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-20 h-20 text-warm-300 mx-auto mb-6" />
            <h3 className="text-2xl font-lato font-bold text-warm-600 mb-4">
              {friends.length === 0 ? 'No friends yet' : 'No matching friends'}
            </h3>
            <p className="text-warm-500 mb-8 max-w-md mx-auto">
              {friends.length === 0 
                ? "Start building your gifting circle by adding friends!"
                : "Try adjusting your search terms."
              }
            </p>
            {friends.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" onClick={() => setShowAddFriendModal(true)} rightIcon={<Plus size={20} />}>
                  Add Friend
                </Button>
                <Button variant="secondary" onClick={handleGenerateLink} leftIcon={<LinkIcon size={20} />}>
                  Share Your Link
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-ocean-400 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                    {friend.avatarUrl ? (
                      <Image
                        src={friend.avatarUrl} 
                        alt={friend.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(friend.name)
                    )}
                  </div>
                  <h3 className="font-lato font-bold text-warm-800 mb-1">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-warm-600 mb-2">
                    @{friend.friendCode}
                  </p>
                  <p className="text-xs text-warm-500 mb-4">
                    Friends since {new Date(friend.friendshipDate).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    leftIcon={<Calendar size={16} />}
                  >
                    View Events
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Friend Modal */}
        <Modal
          isOpen={showAddFriendModal}
          onClose={() => {
            setShowAddFriendModal(false)
            setFriendCode('')
          }}
          title="Add Friend"
          size="md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-ocean-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <p className="text-warm-600">
                Enter your friend's unique friend code to send them a request
              </p>
            </div>

            <Input
              type="text"
              label="Friend Code"
              placeholder="e.g., ABC123XY"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              leftIcon={<Users size={18} />}
            />

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddFriendModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleSendFriendRequest}
                disabled={!friendCode.trim()}
                rightIcon={<Mail size={18} />}
              >
                Send Request
              </Button>
            </div>
          </div>
        </Modal>

        {/* Share Link Modal */}
        <Modal
          isOpen={showShareLinkModal}
          onClose={() => {
            setShowShareLinkModal(false)
            setLinkCopied(false)
          }}
          title="Share Friend Link"
          size="md"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nature-500 to-ocean-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-warm-600">
                Share this link with friends to let them send you a friend request instantly
              </p>
            </div>

            <div className="p-4 bg-warm-50 rounded-2xl border border-warm-200">
              <p className="text-sm font-mono text-warm-700 break-all">
                {shareableLink}
              </p>
            </div>

            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleCopyLink}
              leftIcon={linkCopied ? <Check size={18} /> : <Copy size={18} />}
            >
              {linkCopied ? 'Copied!' : 'Copy Link'}
            </Button>

            <p className="text-xs text-warm-500 text-center">
              This link will expire in 7 days for security
            </p>
          </div>
        </Modal>
      </div>
    )
  }