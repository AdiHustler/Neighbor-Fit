"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SearchInterface } from "@/components/ui/search-interface"
import {
  Users,
  MapPin,
  Clock,
  Star,
  Activity,
  MessageCircle,
  UserPlus,
  Dumbbell,
  Bike,
  TreePine,
  Waves,
} from "lucide-react"

interface FitnessActivity {
  id: string
  title: string
  type: string
  location: string
  distance: string
  time: string
  date: string
  participants: number
  maxParticipants: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  organizer: {
    name: string
    avatar: string
    rating: number
  }
  description: string
  tags: string[]
  image: string
}

interface FitnessUser {
  id: string
  name: string
  avatar: string
  age: number
  location: string
  distance: string
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced"
  interests: string[]
  bio: string
  rating: number
  activities: number
  matchScore: number
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"activities" | "people">("activities")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activities, setActivities] = useState<FitnessActivity[]>([
    {
      id: "1",
      title: "Morning Yoga in the Park",
      type: "Yoga",
      location: "Central Park, Sector 14",
      distance: "0.5 km",
      time: "7:00 AM - 8:00 AM",
      date: "Tomorrow",
      participants: 8,
      maxParticipants: 15,
      difficulty: "Beginner",
      organizer: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
      },
      description:
        "Start your day with peaceful yoga session surrounded by nature. Perfect for beginners and experienced practitioners alike.",
      tags: ["Outdoor", "Mindfulness", "Flexibility"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "HIIT Workout Session",
      type: "HIIT",
      location: "Community Gym, DLF Phase 2",
      distance: "1.2 km",
      time: "6:30 PM - 7:30 PM",
      date: "Today",
      participants: 12,
      maxParticipants: 20,
      difficulty: "Intermediate",
      organizer: {
        name: "Rahul Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      description:
        "High-intensity interval training to boost your metabolism and build strength. Bring water and a towel!",
      tags: ["Indoor", "Strength", "Cardio"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Cycling Group Ride",
      type: "Cycling",
      location: "Cyber Hub to Golf Course",
      distance: "2.0 km",
      time: "6:00 AM - 8:00 AM",
      date: "This Weekend",
      participants: 15,
      maxParticipants: 25,
      difficulty: "Intermediate",
      organizer: {
        name: "Amit Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.7,
      },
      description: "Scenic cycling route through the city. All fitness levels welcome. Helmets mandatory!",
      tags: ["Outdoor", "Cardio", "Social"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Swimming Club",
      type: "Swimming",
      location: "Aqua Sports Complex",
      distance: "1.8 km",
      time: "5:30 AM - 6:30 AM",
      date: "Daily",
      participants: 20,
      maxParticipants: 30,
      difficulty: "Advanced",
      organizer: {
        name: "Neha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      description: "Professional swimming training with certified instructors. Focus on technique and endurance.",
      tags: ["Indoor", "Technique", "Endurance"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  const [people, setPeople] = useState<FitnessUser[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=60&width=60",
      age: 28,
      location: "Cyber City",
      distance: "0.3 km",
      fitnessLevel: "Intermediate",
      interests: ["Yoga", "Running", "Meditation"],
      bio: "Fitness enthusiast who loves morning runs and yoga. Looking for workout buddies!",
      rating: 4.8,
      activities: 45,
      matchScore: 95,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=60&width=60",
      age: 32,
      location: "DLF Phase 2",
      distance: "0.8 km",
      fitnessLevel: "Advanced",
      interests: ["CrossFit", "Boxing", "Nutrition"],
      bio: "CrossFit coach and nutrition enthusiast. Always up for challenging workouts!",
      rating: 4.9,
      activities: 78,
      matchScore: 88,
    },
    {
      id: "3",
      name: "Ananya Patel",
      avatar: "/placeholder.svg?height=60&width=60",
      age: 25,
      location: "Sector 14",
      distance: "1.1 km",
      fitnessLevel: "Beginner",
      interests: ["Dance", "Pilates", "Walking"],
      bio: "New to fitness journey. Love dancing and looking for supportive community!",
      rating: 4.6,
      activities: 12,
      matchScore: 82,
    },
    {
      id: "4",
      name: "David Kumar",
      avatar: "/placeholder.svg?height=60&width=60",
      age: 35,
      location: "Golf Course Road",
      distance: "1.5 km",
      fitnessLevel: "Intermediate",
      interests: ["Cycling", "Swimming", "Tennis"],
      bio: "Weekend warrior who enjoys outdoor activities. Let's explore the city together!",
      rating: 4.7,
      activities: 56,
      matchScore: 79,
    },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "yoga":
        return TreePine
      case "hiit":
        return Dumbbell
      case "cycling":
        return Bike
      case "swimming":
        return Waves
      default:
        return Activity
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400"
      case "Intermediate":
        return "text-yellow-400"
      case "Advanced":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.interests.some((interest) => interest.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <GlassCard className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white/80">Finding your fitness community...</p>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Your <span className="gradient-text">Fitness Community</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover activities and connect with fitness enthusiasts in your neighborhood.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <SearchInterface
              onSearch={setSearchQuery}
              placeholder={`Search ${activeTab === "activities" ? "activities" : "people"}...`}
              showFilters={true}
              onFiltersChange={setSelectedFilters}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <GlassCard className="p-2 flex">
              <button
                onClick={() => setActiveTab("activities")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "activities" ? "bg-green-500/20 text-green-400" : "text-white/70 hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Activities</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filteredActivities.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("people")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "people" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>People</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filteredPeople.length}</span>
              </button>
            </GlassCard>
          </div>

          {/* Activities Tab */}
          {activeTab === "activities" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <GlassCard key={activity.id} className="p-6 hover:scale-105 transition-all duration-300">
                    <div className="relative mb-4">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className={`text-sm font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white/80">{activity.organizer.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                        <span className="text-green-400">({activity.distance})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>{activity.time}</span>
                        <span className="text-blue-400">• {activity.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <Users className="w-4 h-4" />
                        <span>
                          {activity.participants}/{activity.maxParticipants} participants
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-white/80 mb-4">{activity.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={activity.organizer.avatar || "/placeholder.svg"}
                          alt={activity.organizer.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-white/80">{activity.organizer.name}</span>
                      </div>
                      <AnimatedButton variant="glass" size="sm">
                        Join Activity
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}

          {/* People Tab */}
          {activeTab === "people" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map((person) => (
                <GlassCard key={person.id} className="p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={person.avatar || "/placeholder.svg"}
                      alt={person.name}
                      className="w-16 h-16 rounded-full border-2 border-white/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-white">{person.name}</h3>
                        <div className="text-lg font-bold text-green-400">{person.matchScore}%</div>
                      </div>
                      <p className="text-sm text-white/70">
                        {person.age} years • {person.location}
                      </p>
                      <p className="text-sm text-green-400">{person.distance} away</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Fitness Level:</span>
                      <span className={`font-medium ${getDifficultyColor(person.fitnessLevel)}`}>
                        {person.fitnessLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Activities:</span>
                      <span className="text-white font-medium">{person.activities}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{person.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 mb-4">{person.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {person.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <AnimatedButton variant="glass" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </AnimatedButton>
                    <AnimatedButton variant="outline" size="sm" className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </AnimatedButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === "activities" && filteredActivities.length === 0) ||
            (activeTab === "people" && filteredPeople.length === 0)) && (
            <div className="text-center py-12">
              <GlassCard className="p-8 max-w-md mx-auto">
                <Activity className="w-12 h-12 mx-auto mb-4 text-white/60" />
                <h3 className="text-xl font-semibold text-white mb-2">No {activeTab} found</h3>
                <p className="text-white/70 mb-4">Try adjusting your search or filters to find more results.</p>
                <AnimatedButton variant="glass" onClick={() => setSearchQuery("")}>
                  Clear Search
                </AnimatedButton>
              </GlassCard>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
