"use client"

import { motion } from "framer-motion"
import { Edit3, LogOut, Save, Mail, Phone, MapPin, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

interface UserProfile {
  firstName: string
  lastName: string
  phone: string
  city: string
  pincode: string
  email?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    pincode: "",
  })

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/")
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`http://localhost:4000/api/profile/email/${encodeURIComponent(session.user.email)}`);
          if (res.ok) {
            const user: UserProfile = await res.json();
            setProfile(user);
            return;
          }
        } catch (e) {
        }
       
        const nameParts = session.user.name?.split(" ") || [];
        setProfile({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          phone: "",
          city: "",
          pincode: "",
          email: session.user.email,
        });
      }
    };
    fetchProfile();
  }, [session]);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, email: session && session.user ? session.user.email : '' }),
      });
      if (res.ok) {
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (e) {
      // Optionally handle error
    }
    setIsSaving(false);
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100/80 to-purple-100/80 rounded-lg backdrop-blur-sm border border-gray-200/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-800 font-semibold">Platformatory Labs</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center ring-2 ring-white/20 text-gray-700 font-bold text-lg">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-gray-600 text-sm hidden sm:block">{session.user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 bg-white/60 hover:bg-white/80 border border-gray-200/40 rounded-lg text-gray-600 hover:text-gray-800 text-sm transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 shadow-2xl shadow-gray-200/50">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center ring-2 ring-white/20 text-gray-700 font-bold text-lg">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white/20"></div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{session.user?.email}</p>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100/60 to-purple-100/60 hover:from-blue-200/70 hover:to-purple-200/70 border border-gray-200/50 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-500 text-sm">
                  <Mail className="w-4 h-4 mr-3" />
                  {session.user?.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="w-4 h-4 mr-3" />
                    {profile.phone}
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-3" />
                    {profile.city}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Profile Information</h3>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100/60 to-blue-100/60 hover:from-green-200/70 hover:to-blue-200/70 border border-gray-200/50 rounded-xl text-gray-700 font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/40 border border-gray-200/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-transparent disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/40 border border-gray-200/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-transparent disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/40 border border-gray-200/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-transparent disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/40 border border-gray-200/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-transparent disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium">Pincode</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/40 border border-gray-200/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-transparent disabled:opacity-50 transition-all duration-200"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              {!isEditing && (
                <div className="mt-6 p-4 bg-blue-100/50 border border-blue-200/40 rounded-xl">
                  <p className="text-blue-700 text-sm">
                    Click "Edit Profile" to modify your information. Changes will be synced automatically.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="backdrop-blur-xl bg-green-100/80 border border-green-200/50 rounded-2xl p-4 shadow-2xl shadow-green-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-200/60 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-700 font-medium">Profile saved & synced!</p>
                <p className="text-green-600 text-sm">Your changes have been updated successfully.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
