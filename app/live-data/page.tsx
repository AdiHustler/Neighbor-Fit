"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Users,
  Activity,
  TrendingUp,
  Star,
  MapPin,
  Clock,
  Calendar,
  Heart,
  Zap,
  Target,
  Award,
  RefreshCw,
} from "lucide-react"

interface CommunityStats {
  totalMembers: number
  activeToday: number
  weeklyActivities: number
  averageRating: number
  memberGrowth: number
  retentionRate: number
}

interface LiveActivity {
  id: string
  title: string
  type: string
  instructor: string
  location: string
  participants: number
  maxParticipants: number
  price: number
  rating: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  startTime: string
  duration: number
  emoji: string
  isVerified: boolean
}

interface ActivityDetails {
  id: string
  title: string
  description: string
  instructor: string
  instructorRating: number
  location: string
  address: string
  participants: number
  maxParticipants: number
  price: number
  rating: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  startTime: string
  duration: number
  nextSession: string
  amenities: string[]
  reviews: number
}

export default function LiveDataPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalMembers: 2847,
    activeToday: 342,
    weeklyActivities: 156,
    averageRating: 4.8,
    memberGrowth: 12.5,
    retentionRate: 89.3,
  })

  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([
    {
      id: "1",
      title: "Morning Power Yoga",
      type: "Yoga",
      instructor: "Sarah Chen",
      location: "Central Park",
      participants: 12,
      maxParticipants: 15,
      price: 25,
      rating: 4.9,
      difficulty: "Intermediate",
      startTime: "07:00",
      duration: 60,
      emoji: "🧘‍♀️",
      isVerified: true,
    },
    {
      id: "2",
      title: "HIIT Bootcamp",
      type: "HIIT",
      instructor: "Mike Rodriguez",
      location: "Community Gym",
      participants: 8,
      maxParticipants: 12,
      price: 30,
      rating: 4.8,
      difficulty: "Advanced",
      startTime: "18:30",
      duration: 45,
      emoji: "💪",
      isVerified: true,
    },
    {
      id: "3",
      title: "Neighborhood Run",
      type: "Running",
      instructor: "Emma Thompson",
      location: "Riverside Trail",
      participants: 15,
      maxParticipants: 20,
      price: 0,
      rating: 4.7,
      difficulty: "Beginner",
      startTime: "06:30",
      duration: 45,
      emoji: "🏃‍♂️",
      isVerified: false,
    },
    {
      id: "4",
      title: "Aqua Fitness",
      type: "Swimming",
      instructor: "David Kim",
      location: "Community Pool",
      participants: 6,
      maxParticipants: 10,
      price: 35,
      rating: 4.6,
      difficulty: "Intermediate",
      startTime: "19:00",
      duration: 50,
      emoji: "🏊‍♀️",
      isVerified: true,
    },
    {
      id: "5",
      title: "Cycling Adventure",
      type: "Cycling",
      instructor: "Lisa Park",
      location: "Mountain Trail",
      participants: 9,
      maxParticipants: 12,
      price: 20,
      rating: 4.8,
      difficulty: "Intermediate",
      startTime: "16:00",
      duration: 90,
      emoji: "🚴‍♂️",
      isVerified: true,
    },
    {
      id: "6",
      title: "Dance Cardio",
      type: "Dance",
      instructor: "Maria Santos",
      location: "Studio A",
      participants: 14,
      maxParticipants: 16,
      price: 28,
      rating: 4.9,
      difficulty: "Beginner",
      startTime: "17:30",
      duration: 55,
      emoji: "💃",
      isVerified: true,
    },
  ])

  const [activityDetails, setActivityDetails] = useState<ActivityDetails | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      setLastUpdated(new Date())
      // Simulate real-time updates
      setCommunityStats((prev) => ({
        ...prev,
        activeToday: prev.activeToday + Math.floor(Math.random() * 5) - 2,
        weeklyActivities: prev.weeklyActivities + Math.floor(Math.random() * 3) - 1,
      }))
    }, 120000)

    return () => {
      clearTimeout(timer)
      clearInterval(refreshInterval)
    }
  }, [])

  const handleActivityClick = (activityId: string) => {
    const activity = liveActivities.find((a) => a.id === activityId)
    if (activity) {
      setSelectedActivity(activityId)
      // Simulate fetching detailed data from APIs
      setActivityDetails({
        id: activity.id,
        title: activity.title,
        description: `Join ${activity.instructor} for an amazing ${activity.type.toLowerCase()} session. This activity uses smart location matching and secure payment processing.`,
        instructor: activity.instructor,
        instructorRating: activity.rating,
        location: activity.location,
        address: `123 Fitness St, Your Neighborhood`,
        participants: activity.participants,
        maxParticipants: activity.maxParticipants,
        price: activity.price,
        rating: activity.rating,
        difficulty: activity.difficulty,
        startTime: activity.startTime,
        duration: activity.duration,
        nextSession: "Tomorrow at " + activity.startTime,
        amenities: ["Parking Available", "Equipment Provided", "Changing Rooms", "Water Station"],
        reviews: Math.floor(activity.rating * 20),
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-500/20"
      case "Intermediate":
        return "text-yellow-400 bg-yellow-500/20"
      case "Advanced":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-slate-400 bg-slate-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <GlassCard className="p-8 text-center">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-spin" />
                <p className="text-white/80">Loading live community data...</p>
                <p className="text-sm text-slate-400 mt-2">Fetching real-time platform analytics</p>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Real-Time Community Intelligence</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Live data and analytics to give you real-time insights into your neighborhood fitness community.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-green-400" />
                Live Updates
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-400" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="text-2xl font-bold text-white mb-1">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Members</div>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <Activity className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <div className="text-2xl font-bold text-white mb-1">{communityStats.activeToday}</div>
              <div className="text-sm text-slate-400">Active Today</div>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <div className="text-2xl font-bold text-white mb-1">{communityStats.weeklyActivities}</div>
              <div className="text-sm text-slate-400">Weekly Activities</div>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <Star className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <div className="text-2xl font-bold text-white mb-1">{communityStats.averageRating}</div>
              <div className="text-sm text-slate-400">Avg Rating</div>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <div className="text-2xl font-bold text-white mb-1">+{communityStats.memberGrowth}%</div>
              <div className="text-sm text-slate-400">Growth Rate</div>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <Heart className="w-8 h-8 mx-auto mb-3 text-red-400" />
              <div className="text-2xl font-bold text-white mb-1">{communityStats.retentionRate}%</div>
              <div className="text-sm text-slate-400">Retention</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Activities Feed */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Activity className="w-6 h-6 mr-3 text-green-400" />
                    Live Activity Feed
                  </h2>
                  <div className="flex items-center text-sm text-slate-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </div>
                </div>

                <div className="space-y-4">
                  {liveActivities.map((activity) => (
                    <div
                      key={activity.id}
                      onClick={() => handleActivityClick(activity.id)}
                      className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all duration-200 cursor-pointer border border-slate-700 hover:border-blue-500/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{activity.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                              {activity.isVerified && <Award className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {activity.participants}/{activity.maxParticipants}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {activity.location}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {activity.startTime} ({activity.duration}min)
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                {activity.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${getDifficultyColor(activity.difficulty)}`}
                          >
                            {activity.difficulty}
                          </div>
                          <div className="text-lg font-bold text-white">
                            {activity.price === 0 ? "Free" : `$${activity.price}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Activity Details Panel */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-24">
                {activityDetails ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{activityDetails.title}</h3>
                      <button onClick={() => setSelectedActivity(null)} className="text-slate-400 hover:text-white">
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Description</h4>
                        <p className="text-sm text-slate-400">{activityDetails.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-1">Instructor</h4>
                          <p className="text-sm text-white">{activityDetails.instructor}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-slate-400">{activityDetails.instructorRating}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-300 mb-1">Price</h4>
                          <p className="text-lg font-bold text-white">
                            {activityDetails.price === 0 ? "Free" : `$${activityDetails.price}`}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Location</h4>
                        <p className="text-sm text-white">{activityDetails.location}</p>
                        <p className="text-xs text-slate-400">{activityDetails.address}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Next Session</h4>
                        <p className="text-sm text-white">{activityDetails.nextSession}</p>
                        <p className="text-xs text-slate-400">Duration: {activityDetails.duration} minutes</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {activityDetails.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-sm text-slate-300">
                              {activityDetails.participants}/{activityDetails.maxParticipants} joined
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-slate-300">
                              {activityDetails.rating} ({activityDetails.reviews} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <AnimatedButton variant="glass" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Target className="w-4 h-4 mr-2" />
                            Join Activity
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Save for Later
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            Find Similar
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Select an Activity</h3>
                    <p className="text-sm text-slate-500">
                      Click on any activity from the feed to view detailed information and real-time data.
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mt-12">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Platform Features
              </h3>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h4 className="font-semibold text-blue-300 mb-2">Smart Location</h4>
                  <p className="text-slate-400">Intelligent proximity matching for nearby activities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h4 className="font-semibold text-green-300 mb-2">Secure Payments</h4>
                  <p className="text-slate-400">Safe and reliable payment processing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h4 className="font-semibold text-purple-300 mb-2">Smart Notifications</h4>
                  <p className="text-slate-400">Timely updates and activity reminders</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h4 className="font-semibold text-orange-300 mb-2">Secure Access</h4>
                  <p className="text-slate-400">Protected user authentication and privacy</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}
