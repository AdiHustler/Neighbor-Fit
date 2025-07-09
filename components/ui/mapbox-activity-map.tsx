"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MapPin, Navigation, Users, Clock } from "lucide-react"

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
}

interface MapboxActivityMapProps {
  activities: FitnessActivity[]
  userLocation: [number, number] | null
  onActivitySelect?: (activity: FitnessActivity) => void
  selectedActivity?: FitnessActivity | null
  height?: string
}

export function MapboxActivityMap({
  activities,
  userLocation,
  onActivitySelect,
  selectedActivity,
  height = "500px",
}: MapboxActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [mapboxgl, setMapboxgl] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [userMarker, setUserMarker] = useState<any>(null)

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      if (typeof window !== "undefined") {
        // Load Mapbox GL JS
        const mapboxModule = await import("mapbox-gl")
        const mapboxgl = mapboxModule.default

        // Set access token (in production, use environment variable)
        // --------------------------------------------------------------------
        // Mapbox access token
        // 1. In production, create an **Environment Variable**
        //    called `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
        // 2. During local development this fallback public-demo key prevents
        //    the invalid-token error you just saw.
        //    (Feel free to replace it with your own “public” key.)
        // --------------------------------------------------------------------
        mapboxgl.accessToken =
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ??
          "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMnoycXAybm40eXM5eWgifQ.2QHNc5H_KQiQdb3gNZc8qA"

        // Load CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
        document.head.appendChild(link)

        setMapboxgl(mapboxgl)
        initializeMap(mapboxgl)
      }
    }

    loadMapbox()
  }, [])

  useEffect(() => {
    if (map && mapboxgl) {
      updateMarkers()
    }
  }, [activities, map, mapboxgl])

  useEffect(() => {
    if (map && userLocation && mapboxgl) {
      updateUserMarker()
    }
  }, [userLocation, map, mapboxgl])

  const initializeMap = (mapboxgl: any) => {
    if (!mapRef.current) return

    // Create map centered on Delhi
    const mapInstance = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11", // Dark theme to match our design
      center: userLocation || [77.209, 28.6139], // Delhi coordinates
      zoom: 11,
      pitch: 45,
      bearing: 0,
    })

    mapInstance.on("load", () => {
      setMap(mapInstance)
      setIsLoaded(true)

      // Add 3D buildings layer
      mapInstance.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
          "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
          "fill-extrusion-opacity": 0.6,
        },
      })
    })

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Add geolocate control
    mapInstance.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right",
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "yoga":
        return "🧘"
      case "hiit":
        return "💪"
      case "cycling":
        return "🚴"
      case "swimming":
        return "🏊"
      case "running":
        return "🏃"
      case "dance":
        return "💃"
      case "martial arts":
        return "🥋"
      case "rock climbing":
        return "🧗"
      default:
        return "🏃"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981" // green
      case "Intermediate":
        return "#f59e0b" // yellow
      case "Advanced":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  const updateMarkers = () => {
    if (!map || !mapboxgl) return

    // Clear existing markers
    markers.forEach((marker) => marker.remove())
    setMarkers([])

    const newMarkers = activities.map((activity) => {
      // Create custom marker element
      const el = document.createElement("div")
      el.className = "activity-marker"
      el.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${getDifficultyColor(activity.difficulty)}, ${getDifficultyColor(activity.difficulty)}aa);
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      transition: transform 0.2s ease;
    `
      el.innerHTML = getActivityIcon(activity.type)

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)"
      })
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)"
      })

      // Create popup content
      const popupContent = `
      <div class="p-4 max-w-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-white">${activity.title}</h3>
          <span class="text-xs px-2 py-1 rounded-full bg-white/20 text-white">${activity.difficulty}</span>
        </div>
        <div class="space-y-1 text-sm text-white/80 mb-3">
          <div class="flex items-center space-x-2">
            <span>📍</span>
            <span>${activity.location}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span>⏰</span>
            <span>${activity.time}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span>👥</span>
            <span>${activity.participants}/${activity.maxParticipants} participants</span>
          </div>
          <div class="flex items-center space-x-2">
            <span>💰</span>
            <span>${activity.price > 0 ? `₹${activity.price}` : "Free"}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img src="${activity.organizer.avatar}" alt="${activity.organizer.name}" class="w-6 h-6 rounded-full">
            <span class="text-sm text-white/80">${activity.organizer.name}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-yellow-400">⭐</span>
            <span class="text-sm text-white/80">${activity.organizer.rating}</span>
          </div>
        </div>
      </div>
    `

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "activity-popup",
      }).setHTML(popupContent)

      // Create marker
      const marker = new mapboxgl.Marker(el).setLngLat(activity.coordinates).setPopup(popup).addTo(map)

      // Add click handler
      el.addEventListener("click", () => {
        if (onActivitySelect) {
          onActivitySelect(activity)
        }
        // Fly to activity location
        map.flyTo({
          center: activity.coordinates,
          zoom: 15,
          duration: 1000,
        })
      })

      return marker
    })

    setMarkers(newMarkers)
  }

  const updateUserMarker = () => {
    if (!map || !mapboxgl || !userLocation) return

    // Remove existing user marker
    if (userMarker) {
      userMarker.remove()
    }

    // Create user marker element
    const el = document.createElement("div")
    el.className = "user-marker"
    el.style.cssText = `
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
    animation: pulse 2s infinite;
  `

    // Add pulsing animation
    const style = document.createElement("style")
    style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
  `
    document.head.appendChild(style)

    const marker = new mapboxgl.Marker(el).setLngLat(userLocation).addTo(map)

    setUserMarker(marker)
  }

  const flyToActivity = (activity: FitnessActivity) => {
    if (map) {
      map.flyTo({
        center: activity.coordinates,
        zoom: 16,
        duration: 1500,
      })
    }
  }

  const fitAllActivities = () => {
    if (map && activities.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()

      activities.forEach((activity) => {
        bounds.extend(activity.coordinates)
      })

      if (userLocation) {
        bounds.extend(userLocation)
      }

      map.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      })
    }
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height }} className="w-full rounded-lg overflow-hidden" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white/80">Loading Mapbox...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <AnimatedButton variant="glass" size="sm" onClick={fitAllActivities} className="backdrop-blur-md">
          <MapPin className="w-4 h-4 mr-2" />
          Show All
        </AnimatedButton>

        {userLocation && (
          <AnimatedButton
            variant="glass"
            size="sm"
            onClick={() => map?.flyTo({ center: userLocation, zoom: 14 })}
            className="backdrop-blur-md"
          >
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </AnimatedButton>
        )}
      </div>

      {/* Activity Info Panel */}
      {selectedActivity && (
        <div className="absolute bottom-4 left-4 right-4">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-white mb-1">{selectedActivity.title}</h3>
                <p className="text-sm text-white/70">{selectedActivity.location}</p>
              </div>
              <button onClick={() => onActivitySelect?.(null as any)} className="text-white/60 hover:text-white">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedActivity.time}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {selectedActivity.participants}/{selectedActivity.maxParticipants}
                  </span>
                </span>
              </div>

              <AnimatedButton size="sm" onClick={() => flyToActivity(selectedActivity)}>
                View Details
              </AnimatedButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4">
        <GlassCard className="p-3 space-y-2">
          <h4 className="text-sm font-semibold text-white mb-2">Difficulty Levels</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white/80">Beginner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-white/80">Intermediate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-white/80">Advanced</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <style jsx>{`
      .activity-popup .mapboxgl-popup-content {
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0;
      }
      .activity-popup .mapboxgl-popup-tip {
        border-top-color: rgba(0, 0, 0, 0.9);
      }
    `}</style>
    </div>
  )
}
