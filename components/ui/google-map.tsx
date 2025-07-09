"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MapPin, Search, Navigation } from "lucide-react"

interface GoogleMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number }
  height?: string
  searchEnabled?: boolean
}

export function GoogleMap({
  onLocationSelect,
  initialLocation = { lat: 28.6139, lng: 77.209 }, // Delhi coordinates
  height = "400px",
  searchEnabled = true,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        // Load CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        initializeMap(L)
      }
    }

    loadLeaflet()
  }, [])

  const initializeMap = (L: any) => {
    if (!mapRef.current) return

    // Create map
    const mapInstance = L.map(mapRef.current).setView([initialLocation.lat, initialLocation.lng], 12)

    // Add tile layer (OpenStreetMap - free)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance)

    // Create custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    // Add marker
    const markerInstance = L.marker([initialLocation.lat, initialLocation.lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(mapInstance)

    // Handle map click
    mapInstance.on("click", async (e: any) => {
      const { lat, lng } = e.latlng
      markerInstance.setLatLng([lat, lng])

      const address = await reverseGeocode(lat, lng)
      setSelectedLocation(address)

      if (onLocationSelect) {
        onLocationSelect({ lat, lng, address })
      }
    })

    // Handle marker drag
    markerInstance.on("dragend", async (e: any) => {
      const { lat, lng } = e.target.getLatLng()

      const address = await reverseGeocode(lat, lng)
      setSelectedLocation(address)

      if (onLocationSelect) {
        onLocationSelect({ lat, lng, address })
      }
    })

    setMap(mapInstance)
    setMarker(markerInstance)
    setIsLoaded(true)
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", India")}&limit=1`,
      )
      const data = await response.json()

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const location = { lat: Number.parseFloat(lat), lng: Number.parseFloat(lon), address: display_name }

        map.setView([location.lat, location.lng], 14)
        marker.setLatLng([location.lat, location.lng])
        setSelectedLocation(location.address)

        if (onLocationSelect) {
          onLocationSelect(location)
        }
      }
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const location = { lat: latitude, lng: longitude, address: "" }

          map.setView([latitude, longitude], 14)
          marker.setLatLng([latitude, longitude])

          const address = await reverseGeocode(latitude, longitude)
          location.address = address
          setSelectedLocation(address)

          if (onLocationSelect) {
            onLocationSelect(location)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      {searchEnabled && (
        <div className="p-4 border-b border-white/10">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                placeholder="Search for places in India..."
                className="glass-input w-full pr-10"
              />
              <button onClick={searchLocation} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-white/60 hover:text-white/80" />
              </button>
            </div>
            <AnimatedButton variant="outline" size="sm" onClick={getCurrentLocation}>
              <Navigation className="w-4 h-4" />
            </AnimatedButton>
          </div>
          {selectedLocation && (
            <div className="mt-2 text-sm text-white/80 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {selectedLocation}
            </div>
          )}
        </div>
      )}

      <div ref={mapRef} style={{ height }} className="w-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-white/80">Loading map...</div>
        </div>
      )}

      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </GlassCard>
  )
}
