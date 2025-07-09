"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Calendar,
  Activity,
  Users,
  Target,
  Trophy,
  Edit3,
  Save,
  Camera,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Dumbbell,
  Star,
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  occupation: string
  age: number
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced"
  avatar: string
}

interface FitnessPreferences {
  goals: string[]
  preferredActivities: string[]
  availableTime: string[]
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced"
  preferredIntensity: number
  socialPreference: number
  budgetRange: { min: number; max: number }
  travelDistance: number
}

interface SavedActivity {
  id: number
  title: string
  type: string
  location: string
  date: string
  participants: number
  rating: number
  image: string
}

interface FitnessAnalytics {
  totalActivities: number
  activitiesThisMonth: number
  averageRating: number
  connectionsCount: number
  favoriteActivity: string
  weeklyGoal: number
  weeklyProgress: number
}

export default function ProfilePage() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState("")

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  })

  // Profile state
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Cyber City, Gurgaon",
    occupation: "Software Engineer",
    age: 28,
    fitnessLevel: "Intermediate",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [preferences, setPreferences] = useState<FitnessPreferences>({
    goals: ["Weight Loss", "Strength Building", "Social Connection"],
    preferredActivities: ["Yoga", "HIIT", "Cycling", "Swimming"],
    availableTime: ["Morning", "Evening"],
    fitnessLevel: "Intermediate",
    preferredIntensity: 7,
    socialPreference: 8,
    budgetRange: { min: 500, max: 2000 },
    travelDistance: 5,
  })

  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([
    {
      id: 1,
      title: "Morning Yoga",
      type: "Yoga",
      location: "Central Park",
      date: "2024-01-15",
      participants: 12,
      rating: 4.8,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 2,
      title: "HIIT Training",
      type: "HIIT",
      location: "Community Gym",
      date: "2024-01-12",
      participants: 15,
      rating: 4.9,
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 3,
      title: "Cycling Group",
      type: "Cycling",
      location: "Golf Course Route",
      date: "2024-01-10",
      participants: 20,
      rating: 4.7,
      image: "/placeholder.svg?height=150&width=200",
    },
  ])

  const [analytics, setAnalytics] = useState<FitnessAnalytics>({
    totalActivities: 47,
    activitiesThisMonth: 12,
    averageRating: 4.8,
    connectionsCount: 23,
    favoriteActivity: "Yoga",
    weeklyGoal: 5,
    weeklyProgress: 3,
  })

  // Check authentication status on component mount
  useEffect(() => {
    try {
      const checkAuthStatus = () => {
        const authToken = localStorage.getItem("authToken")
        const userData = localStorage.getItem("userData")

        if (authToken && userData) {
          try {
            const parsedUserData = JSON.parse(userData)
            setUserProfile(parsedUserData)
            setIsLoggedIn(true)
          } catch (error) {
            console.error("Error parsing user data:", error)
            localStorage.removeItem("authToken")
            localStorage.removeItem("userData")
            setIsLoggedIn(false)
          }
        } else {
          setIsLoggedIn(false)
        }
        setIsLoading(false)
      }

      checkAuthStatus()
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsLoading(false)
      setIsLoggedIn(false)
    }
  }, [])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthSuccess("")

    try {
      // Basic validation
      if (!loginForm.email || !loginForm.password) {
        setAuthError("Please fill in all fields")
        return
      }

      if (!loginForm.email.includes("@")) {
        setAuthError("Please enter a valid email address")
        return
      }

      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful login
      const mockUserData = {
        name: "Priya Sharma",
        email: loginForm.email,
        phone: "+91 98765 43210",
        location: "Cyber City, Gurgaon",
        occupation: "Software Engineer",
        age: 28,
        fitnessLevel: "Intermediate" as const,
        avatar: "/placeholder.svg?height=100&width=100",
      }

      // Store auth data
      localStorage.setItem("authToken", "mock-jwt-token-" + Date.now())
      localStorage.setItem("userData", JSON.stringify(mockUserData))

      setUserProfile(mockUserData)
      setIsLoggedIn(true)
      setAuthSuccess("Login successful! Welcome back.")

      // Clear form
      setLoginForm({ email: "", password: "" })
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthSuccess("")

    try {
      // Validation
      if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
        setAuthError("Please fill in all required fields")
        return
      }

      if (!registerForm.email.includes("@")) {
        setAuthError("Please enter a valid email address")
        return
      }

      if (registerForm.password.length < 6) {
        setAuthError("Password must be at least 6 characters long")
        return
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        setAuthError("Passwords do not match")
        return
      }

      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful registration
      const newUserData = {
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone || "+91 00000 00000",
        location: registerForm.location || "India",
        occupation: "Professional",
        age: 25,
        fitnessLevel: "Beginner" as const,
        avatar: "/placeholder.svg?height=100&width=100",
      }

      // Store auth data
      localStorage.setItem("authToken", "mock-jwt-token-" + Date.now())
      localStorage.setItem("userData", JSON.stringify(newUserData))

      setUserProfile(newUserData)
      setIsLoggedIn(true)
      setAuthSuccess("Registration successful! Welcome to NeighborFit.")

      // Clear form
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        location: "",
      })
    } catch (error) {
      console.error("Registration error:", error)
      setAuthError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      setIsLoggedIn(false)
      setUserProfile({
        name: "",
        email: "",
        phone: "",
        location: "",
        occupation: "",
        age: 25,
        fitnessLevel: "Beginner",
        avatar: "/placeholder.svg?height=100&width=100",
      })
      setAuthSuccess("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSaveProfile = () => {
    try {
      setIsEditing(false)
      localStorage.setItem("userData", JSON.stringify(userProfile))
      setAuthSuccess("Profile updated successfully!")
      setTimeout(() => setAuthSuccess(""), 3000)
    } catch (error) {
      console.error("Save profile error:", error)
      setAuthError("Failed to save profile. Please try again.")
    }
  }

  const handlePreferenceChange = (key: string, value: any) => {
    try {
      setPreferences((prev) => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error("Preference change error:", error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <GlassCard className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white/80">Loading your profile...</p>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Authentication forms
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  {authMode === "login" ? "Welcome Back" : "Join NeighborFit"}
                </h1>
                <p className="text-white/80">
                  {authMode === "login"
                    ? "Sign in to connect with your fitness community"
                    : "Create your account to start your fitness journey with neighbors"}
                </p>
              </div>

              <GlassCard className="p-6">
                {/* Auth Mode Toggle */}
                <div className="flex mb-6">
                  <button
                    onClick={() => {
                      setAuthMode("login")
                      setAuthError("")
                      setAuthSuccess("")
                    }}
                    className={`flex-1 py-2 px-4 text-center transition-all duration-200 ${
                      authMode === "login" ? "bg-green-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                    } rounded-l-lg`}
                  >
                    <LogIn className="w-4 h-4 inline mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register")
                      setAuthError("")
                      setAuthSuccess("")
                    }}
                    className={`flex-1 py-2 px-4 text-center transition-all duration-200 ${
                      authMode === "register"
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    } rounded-r-lg`}
                  >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Register
                  </button>
                </div>

                {/* Error/Success Messages */}
                {authError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-red-200 text-sm">{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-green-200 text-sm">{authSuccess}</span>
                  </div>
                )}

                {/* Login Form */}
                {authMode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <AnimatedButton type="submit" variant="glass" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </AnimatedButton>
                  </form>
                )}

                {/* Register Form */}
                {authMode === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={registerForm.location}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your city/area"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                          placeholder="Create a password (min 6 characters)"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    <AnimatedButton type="submit" variant="glass" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </AnimatedButton>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Main profile page for authenticated users
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Success Message */}
          {authSuccess && (
            <div className="mb-6 max-w-4xl mx-auto">
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-200 text-sm">{authSuccess}</span>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <GlassCard className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <img
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full border-4 border-white/20"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile((prev) => ({ ...prev, name: e.target.value }))}
                        className="text-3xl font-bold bg-transparent border-b-2 border-white/30 text-white focus:outline-none focus:border-green-500 transition-colors"
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Email"
                        />
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, phone: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          value={userProfile.location}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, location: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={userProfile.occupation}
                          onChange={(e) => setUserProfile((prev) => ({ ...prev, occupation: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Occupation"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
                      <p className="text-white/80 mb-4">{userProfile.occupation}</p>
                      <div className="space-y-2 text-white/70">
                        <p className="flex items-center justify-center md:justify-start">
                          <Mail className="w-4 h-4 mr-2" />
                          {userProfile.email}
                        </p>
                        <p className="flex items-center justify-center md:justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          {userProfile.phone}
                        </p>
                        <p className="flex items-center justify-center md:justify-start">
                          <MapPin className="w-4 h-4 mr-2" />
                          {userProfile.location}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {isEditing ? (
                    <AnimatedButton variant="glass" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton variant="glass" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </AnimatedButton>
                  )}
                  <AnimatedButton variant="outline" onClick={handleLogout}>
                    Logout
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Analytics Cards */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <GlassCard className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                <div className="text-2xl font-bold text-white mb-1">{analytics.totalActivities}</div>
                <div className="text-sm text-white/70">Total Activities</div>
              </GlassCard>
              <GlassCard className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-2xl font-bold text-white mb-1">{analytics.activitiesThisMonth}</div>
                <div className="text-sm text-white/70">This Month</div>
              </GlassCard>
              <GlassCard className="p-6 text-center">
                <Star className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-2xl font-bold text-white mb-1">{analytics.averageRating}</div>
                <div className="text-sm text-white/70">Avg Rating</div>
              </GlassCard>
              <GlassCard className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <div className="text-2xl font-bold text-white mb-1">{analytics.connectionsCount}</div>
                <div className="text-sm text-white/70">Connections</div>
              </GlassCard>
            </div>
          </div>

          {/* Fitness Preferences */}
          <div className="max-w-4xl mx-auto mb-8">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-400" />
                Fitness Preferences
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Goals</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      "Weight Loss",
                      "Strength Building",
                      "Endurance",
                      "Flexibility",
                      "Social Connection",
                      "Mental Health",
                    ].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          const newGoals = preferences.goals.includes(goal)
                            ? preferences.goals.filter((g) => g !== goal)
                            : [...preferences.goals, goal]
                          handlePreferenceChange("goals", newGoals)
                        }}
                        className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                          preferences.goals.includes(goal)
                            ? "bg-green-500 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-4">Preferred Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Yoga", "HIIT", "Cycling", "Swimming", "Running", "Dancing", "Boxing", "Pilates"].map(
                      (activity) => (
                        <button
                          key={activity}
                          onClick={() => {
                            const newActivities = preferences.preferredActivities.includes(activity)
                              ? preferences.preferredActivities.filter((a) => a !== activity)
                              : [...preferences.preferredActivities, activity]
                            handlePreferenceChange("preferredActivities", newActivities)
                          }}
                          className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                            preferences.preferredActivities.includes(activity)
                              ? "bg-blue-500 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          }`}
                        >
                          {activity}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/80 mb-2">Fitness Level</label>
                      <select
                        value={preferences.fitnessLevel}
                        onChange={(e) => handlePreferenceChange("fitnessLevel", e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2">
                        Preferred Intensity: {preferences.preferredIntensity}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={preferences.preferredIntensity}
                        onChange={(e) => handlePreferenceChange("preferredIntensity", Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2">
                        Social Preference: {preferences.socialPreference}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={preferences.socialPreference}
                        onChange={(e) => handlePreferenceChange("socialPreference", Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2">
                        Travel Distance: {preferences.travelDistance} km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={preferences.travelDistance}
                        onChange={(e) => handlePreferenceChange("travelDistance", Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Recent Activities */}
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-400" />
                Recent Activities
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {savedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">{activity.title}</h3>
                    <div className="space-y-2 text-sm text-white/70">
                      <p className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-2" />
                        {activity.type}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {activity.location}
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {activity.date}
                      </p>
                      <p className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {activity.participants} participants
                      </p>
                      <p className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        {activity.rating} rating
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}
