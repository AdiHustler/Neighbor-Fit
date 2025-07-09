"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { SearchInterface } from "@/components/ui/search-interface"
import { MapboxActivityMap } from "@/components/ui/mapbox-activity-map"
import {
  Clock,
  MapPin,
  Users,
  Plus,
  Star,
  Activity,
  Dumbbell,
  Bike,
  TreePine,
  Waves,
  UserPlus,
  MessageCircle,
  Calendar,
  Map,
  List,
  Navigation,
  Crown,
  CheckCircle,
} from "lucide-react"

interface FitnessActivity {
  id: string
  title: string
  type: string
  location: string
  address: string
  coordinates: [number, number] // [lng, lat] for Mapbox
  distance?: string
  time: string
  date: string
  participants: number
  maxParticipants: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  organizer: {
    name: string
    avatar: string
    rating: number
    verified: boolean
  }
  description: string
  tags: string[]
  image: string
  price: number
  isRecurring: boolean
  category: "outdoor" | "indoor" | "water" | "group"
  equipment: string[]
  ageGroup: string
  duration: number
  isJoined?: boolean
  isHosted?: boolean
}

export default function ActivitiesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "hosting">("all")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<FitnessActivity | null>(null)

  // Dynamic activities data with real coordinates
  const [activities, setActivities] = useState<FitnessActivity[]>([
    {
      id: "1",
      title: "Sunrise Yoga at India Gate",
      type: "Yoga",
      location: "India Gate",
      address: "Rajpath, India Gate, New Delhi, Delhi 110001",
      coordinates: [77.2295, 28.6129],
      time: "6:00 AM - 7:30 AM",
      date: "Tomorrow",
      participants: 12,
      maxParticipants: 25,
      difficulty: "Beginner",
      organizer: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        verified: true,
      },
      description:
        "Start your day with peaceful yoga session at the iconic India Gate. Watch the sunrise while practicing mindful breathing and gentle stretches.",
      tags: ["Outdoor", "Mindfulness", "Flexibility", "Sunrise"],
      image: "/placeholder.svg?height=200&width=300",
      price: 0,
      isRecurring: true,
      category: "outdoor",
      equipment: ["Yoga Mat", "Water Bottle"],
      ageGroup: "All Ages",
      duration: 90,
      isJoined: true,
      isHosted: false,
    },
    {
      id: "2",
      title: "HIIT Bootcamp at Lodhi Gardens",
      type: "HIIT",
      location: "Lodhi Gardens",
      address: "Lodhi Road, New Delhi, Delhi 110003",
      coordinates: [77.2219, 28.5918],
      time: "6:30 PM - 7:30 PM",
      date: "Today",
      participants: 18,
      maxParticipants: 30,
      difficulty: "Intermediate",
      organizer: {
        name: "Rahul Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        verified: true,
      },
      description:
        "High-intensity interval training in the beautiful Lodhi Gardens. Build strength, endurance, and burn calories with our certified trainer.",
      tags: ["Outdoor", "Strength", "Cardio", "Fat Burn"],
      image: "/placeholder.svg?height=200&width=300",
      price: 300,
      isRecurring: false,
      category: "outdoor",
      equipment: ["Resistance Bands", "Water Bottle", "Towel"],
      ageGroup: "18-45",
      duration: 60,
      isJoined: false,
      isHosted: false,
    },
    {
      id: "3",
      title: "Cycling Tour: CP to Connaught Place",
      type: "Cycling",
      location: "Connaught Place",
      address: "Connaught Place, New Delhi, Delhi 110001",
      coordinates: [77.2167, 28.6315],
      time: "7:00 AM - 9:00 AM",
      date: "This Weekend",
      participants: 22,
      maxParticipants: 40,
      difficulty: "Intermediate",
      organizer: {
        name: "Amit Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.7,
        verified: true,
      },
      description:
        "Explore Delhi's heritage on wheels! Scenic cycling route through historic areas with stops at famous landmarks. Bikes and helmets provided.",
      tags: ["Outdoor", "Cardio", "Social", "Heritage"],
      image: "/placeholder.svg?height=200&width=300",
      price: 250,
      isRecurring: true,
      category: "outdoor",
      equipment: ["Helmet", "Cycling Gloves", "Water Bottle"],
      ageGroup: "16-60",
      duration: 120,
      isJoined: true,
      isHosted: false,
    },
    {
      id: "4",
      title: "Swimming Training at Siri Fort",
      type: "Swimming",
      location: "Siri Fort Sports Complex",
      address: "Siri Fort Rd, Siri Fort, New Delhi, Delhi 110049",
      coordinates: [77.2167, 28.5355],
      time: "5:30 AM - 6:30 AM",
      date: "Daily",
      participants: 15,
      maxParticipants: 25,
      difficulty: "Advanced",
      organizer: {
        name: "Neha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        verified: true,
      },
      description:
        "Professional swimming training with certified instructors. Focus on technique improvement and endurance building in Olympic-size pool.",
      tags: ["Indoor", "Technique", "Endurance", "Professional"],
      image: "/placeholder.svg?height=200&width=300",
      price: 500,
      isRecurring: true,
      category: "water",
      equipment: ["Swimming Goggles", "Swim Cap", "Towel"],
      ageGroup: "18-50",
      duration: 60,
      isJoined: false,
      isHosted: false,
    },
    {
      id: "5",
      title: "Rock Climbing at Adventure Island",
      type: "Rock Climbing",
      location: "Adventure Island",
      address: "Rithala, Sector 10, Rohini, Delhi 110085",
      coordinates: [77.1025, 28.7041],
      time: "4:00 PM - 6:00 PM",
      date: "This Weekend",
      participants: 8,
      maxParticipants: 15,
      difficulty: "Intermediate",
      organizer: {
        name: "Vikram Yadav",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.6,
        verified: true,
      },
      description:
        "Challenge yourself with indoor rock climbing! Perfect for building upper body strength and mental focus. All safety equipment provided.",
      tags: ["Indoor", "Strength", "Adventure", "Mental Focus"],
      image: "/placeholder.svg?height=200&width=300",
      price: 400,
      isRecurring: false,
      category: "indoor",
      equipment: ["Climbing Shoes", "Harness", "Chalk Bag"],
      ageGroup: "16-45",
      duration: 120,
      isJoined: true,
      isHosted: false,
    },
    {
      id: "6",
      title: "Zumba Dance Fitness",
      type: "Dance",
      location: "Select City Walk Mall",
      address: "A-3, District Centre, Saket, New Delhi, Delhi 110017",
      coordinates: [77.2063, 28.5245],
      time: "7:00 PM - 8:00 PM",
      date: "Every Tuesday & Thursday",
      participants: 25,
      maxParticipants: 35,
      difficulty: "Beginner",
      organizer: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        verified: true,
      },
      description:
        "High-energy Zumba class combining Latin rhythms with easy-to-follow moves. Burn calories while having fun dancing!",
      tags: ["Indoor", "Dance", "Cardio", "Fun"],
      image: "/placeholder.svg?height=200&width=300",
      price: 200,
      isRecurring: true,
      category: "indoor",
      equipment: ["Comfortable Shoes", "Water Bottle", "Towel"],
      ageGroup: "All Ages",
      duration: 60,
      isJoined: false,
      isHosted: false,
    },
    {
      id: "7",
      title: "Morning Run at Rajpath",
      type: "Running",
      location: "Rajpath",
      address: "Rajpath, New Delhi, Delhi 110001",
      coordinates: [77.2273, 28.6118],
      time: "6:00 AM - 7:00 AM",
      date: "Daily",
      participants: 35,
      maxParticipants: 50,
      difficulty: "Beginner",
      organizer: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.5,
        verified: true,
      },
      description:
        "Join our daily morning run group along the scenic Rajpath. Perfect for beginners and experienced runners alike. Free group activity!",
      tags: ["Outdoor", "Cardio", "Social", "Free"],
      image: "/placeholder.svg?height=200&width=300",
      price: 0,
      isRecurring: true,
      category: "outdoor",
      equipment: ["Running Shoes", "Water Bottle"],
      ageGroup: "All Ages",
      duration: 60,
      isJoined: false,
      isHosted: true,
    },
    {
      id: "8",
      title: "Martial Arts Training",
      type: "Martial Arts",
      location: "Jawaharlal Nehru Stadium",
      address: "Lodhi Road, New Delhi, Delhi 110003",
      coordinates: [77.2337, 28.5833],
      time: "5:00 PM - 6:30 PM",
      date: "Monday, Wednesday, Friday",
      participants: 12,
      maxParticipants: 20,
      difficulty: "Intermediate",
      organizer: {
        name: "Sensei Takeshi",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        verified: true,
      },
      description:
        "Learn traditional martial arts techniques focusing on discipline, self-defense, and physical fitness. Suitable for intermediate level practitioners.",
      tags: ["Indoor", "Self Defense", "Discipline", "Technique"],
      image: "/placeholder.svg?height=200&width=300",
      price: 600,
      isRecurring: true,
      category: "indoor",
      equipment: ["Martial Arts Uniform", "Protective Gear"],
      ageGroup: "16-50",
      duration: 90,
      isJoined: false,
      isHosted: false,
    },
  ])

  useEffect(() => {
    setMounted(true)

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
          calculateDistances(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.log("Location access denied:", error)
          // Default to Delhi center
          setUserLocation([77.209, 28.6139])
        },
      )
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const calculateDistances = (userLat: number, userLng: number) => {
    const updatedActivities = activities.map((activity) => {
      const distance = calculateDistance(userLat, userLng, activity.coordinates[1], activity.coordinates[0])
      return {
        ...activity,
        distance: `${distance.toFixed(1)} km`,
      }
    })
    setActivities(updatedActivities)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

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
      case "running":
        return Activity
      case "dance":
        return Users
      case "martial arts":
        return Dumbbell
      case "rock climbing":
        return Activity
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "outdoor":
        return "bg-green-500/20 text-green-400"
      case "indoor":
        return "bg-blue-500/20 text-blue-400"
      case "water":
        return "bg-cyan-500/20 text-cyan-400"
      case "group":
        return "bg-purple-500/20 text-purple-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  // Filter activities based on active tab
  const getActivitiesByTab = () => {
    switch (activeTab) {
      case "joined":
        return activities.filter((activity) => activity.isJoined)
      case "hosting":
        return activities.filter((activity) => activity.isHosted)
      default:
        return activities
    }
  }

  const filteredActivities = getActivitiesByTab().filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some(
        (filter) =>
          activity.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())) ||
          activity.difficulty.toLowerCase().includes(filter.toLowerCase()) ||
          activity.category.toLowerCase().includes(filter.toLowerCase()) ||
          activity.type.toLowerCase().includes(filter.toLowerCase()),
      )

    return matchesSearch && matchesFilters
  })

  const handleActivitySelect = (activity: FitnessActivity) => {
    setSelectedActivity(activity)
  }

  const handleJoinActivity = async (activityId: string) => {
    // Simulate joining activity
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              participants: activity.participants + 1,
              isJoined: !activity.isJoined,
            }
          : activity,
      ),
    )

    // Here you would integrate with Stripe for paid activities
    const activity = activities.find((a) => a.id === activityId)
    if (activity && activity.price > 0) {
      // Redirect to payment page or open payment modal
      console.log(`Processing payment of ₹${activity.price} for ${activity.title}`)
    }
  }

  const getTabCounts = () => {
    return {
      all: activities.length,
      joined: activities.filter((a) => a.isJoined).length,
      hosting: activities.filter((a) => a.isHosted).length,
    }
  }

  const tabCounts = getTabCounts()

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="h-96 bg-white/5 rounded-lg animate-pulse backdrop-blur-sm border border-white/10" />
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <GlassCard className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white/80">Loading activities with Mapbox...</p>
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
              Fitness <span className="gradient-text">Activities</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join activities, meet neighbors, and achieve your fitness goals together. Powered by Mapbox location
              services.
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchInterface
                onSearch={setSearchQuery}
                placeholder="Search activities, locations, or instructors..."
                showFilters={true}
                onFiltersChange={setSelectedFilters}
              />
            </div>
            <div className="flex gap-2">
              <AnimatedButton variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
                <List className="w-4 h-4 mr-2" />
                List
              </AnimatedButton>
              <AnimatedButton variant={viewMode === "map" ? "default" : "outline"} onClick={() => setViewMode("map")}>
                <Map className="w-4 h-4 mr-2" />
                Map
              </AnimatedButton>
              <AnimatedButton className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </AnimatedButton>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <GlassCard className="p-2 flex">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "all" ? "bg-green-500/20 text-green-400" : "text-white/70 hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>All Activities ({tabCounts.all})</span>
              </button>
              <button
                onClick={() => setActiveTab("joined")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "joined" ? "bg-blue-500/20 text-blue-400" : "text-white/70 hover:text-white"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Joined ({tabCounts.joined})</span>
              </button>
              <button
                onClick={() => setActiveTab("hosting")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "hosting" ? "bg-purple-500/20 text-purple-400" : "text-white/70 hover:text-white"
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>Hosting ({tabCounts.hosting})</span>
              </button>
            </GlassCard>
          </div>

          {/* Tab-specific messaging */}
          {activeTab !== "all" && (
            <div className="text-center mb-6">
              <GlassCard className="p-4 max-w-2xl mx-auto">
                {activeTab === "joined" && (
                  <div className="flex items-center justify-center space-x-2 text-blue-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Showing activities you've joined</span>
                  </div>
                )}
                {activeTab === "hosting" && (
                  <div className="flex items-center justify-center space-x-2 text-purple-400">
                    <Crown className="w-5 h-5" />
                    <span>Showing activities you're hosting</span>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* Map View */}
          {viewMode === "map" && (
            <div className="mb-8">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-4 gradient-text flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  Activity Locations
                  {activeTab !== "all" && (
                    <span className="ml-2 text-sm font-normal text-white/60">
                      ({activeTab === "joined" ? "Joined" : "Hosting"})
                    </span>
                  )}
                </h2>
                <MapboxActivityMap
                  activities={filteredActivities}
                  userLocation={userLocation}
                  onActivitySelect={handleActivitySelect}
                  selectedActivity={selectedActivity}
                />
              </GlassCard>
            </div>
          )}

          {/* Activities Grid/List */}
          {viewMode === "list" && (
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
                      <div className="absolute top-2 left-2 flex gap-2">
                        {activity.price > 0 ? (
                          <div className="bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <span className="text-white text-sm font-medium">₹{activity.price}</span>
                          </div>
                        ) : (
                          <div className="bg-blue-500/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <span className="text-white text-sm font-medium">FREE</span>
                          </div>
                        )}
                        <div className={`backdrop-blur-sm px-2 py-1 rounded-lg ${getCategoryColor(activity.category)}`}>
                          <span className="text-sm font-medium capitalize">{activity.category}</span>
                        </div>
                      </div>
                      {activity.organizer.verified && (
                        <div className="absolute bottom-2 right-2 bg-green-500/80 backdrop-blur-sm p-1 rounded-full">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                      {/* Status indicators */}
                      {activity.isJoined && (
                        <div className="absolute bottom-2 left-2 bg-blue-500/80 backdrop-blur-sm p-1 rounded-full">
                          <CheckCircle className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                      {activity.isHosted && (
                        <div className="absolute bottom-2 left-2 bg-purple-500/80 backdrop-blur-sm p-1 rounded-full">
                          <Crown className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
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
                        <span className="truncate">{activity.location}</span>
                        {activity.distance && <span className="text-green-400">({activity.distance})</span>}
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
                        <span className="text-purple-400">• {activity.duration}min</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span>{activity.ageGroup}</span>
                        {activity.isRecurring && <span className="text-yellow-400">• Recurring</span>}
                      </div>
                    </div>

                    <p className="text-sm text-white/80 mb-4 line-clamp-2">{activity.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {activity.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                          +{activity.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={activity.organizer.avatar || "/placeholder.svg"}
                          alt={activity.organizer.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-white/80">{activity.organizer.name}</span>
                        {activity.organizer.verified && <Star className="w-3 h-3 text-green-400 fill-current" />}
                        {activity.isHosted && <Crown className="w-3 h-3 text-purple-400 fill-current ml-1" />}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!activity.isHosted && (
                        <AnimatedButton
                          variant={activity.isJoined ? "outline" : "glass"}
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinActivity(activity.id)}
                        >
                          {activity.isJoined ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Joined
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              {activity.price > 0 ? `Join - ₹${activity.price}` : "Join Free"}
                            </>
                          )}
                        </AnimatedButton>
                      )}
                      {activity.isHosted && (
                        <AnimatedButton variant="glass" size="sm" className="flex-1">
                          <Crown className="w-4 h-4 mr-2" />
                          Manage Event
                        </AnimatedButton>
                      )}
                      <AnimatedButton variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </AnimatedButton>
                      <AnimatedButton variant="outline" size="sm">
                        <Navigation className="w-4 h-4" />
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <GlassCard className="p-8 max-w-md mx-auto">
                {activeTab === "all" && <Activity className="w-12 h-12 mx-auto mb-4 text-white/60" />}
                {activeTab === "joined" && <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-400/60" />}
                {activeTab === "hosting" && <Crown className="w-12 h-12 mx-auto mb-4 text-purple-400/60" />}

                <h3 className="text-xl font-semibold text-white mb-2">
                  {activeTab === "all" && "No activities found"}
                  {activeTab === "joined" && "No joined activities"}
                  {activeTab === "hosting" && "No hosted activities"}
                </h3>

                <p className="text-white/70 mb-4">
                  {activeTab === "all" && "Try adjusting your search or filters to find more activities."}
                  {activeTab === "joined" &&
                    "You haven't joined any activities yet. Browse all activities to get started!"}
                  {activeTab === "hosting" &&
                    "You're not hosting any activities yet. Create your first activity to get started!"}
                </p>

                <div className="flex gap-2 justify-center">
                  {activeTab !== "all" && (
                    <AnimatedButton variant="glass" onClick={() => setActiveTab("all")}>
                      Browse All Activities
                    </AnimatedButton>
                  )}
                  {activeTab === "all" && (
                    <AnimatedButton variant="glass" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </AnimatedButton>
                  )}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-12">
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{tabCounts.all}</div>
              <div className="text-sm text-white/70">Total Activities</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{tabCounts.joined}</div>
              <div className="text-sm text-white/70">Activities Joined</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{tabCounts.hosting}</div>
              <div className="text-sm text-white/70">Activities Hosting</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {activities.filter((a) => a.category === "outdoor").length}
              </div>
              <div className="text-sm text-white/70">Outdoor Activities</div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}
