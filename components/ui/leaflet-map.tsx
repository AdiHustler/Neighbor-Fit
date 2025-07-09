"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MapPin, Search, Navigation } from "lucide-react"

// Leaflet types
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void
  on: (event: string, callback: (e: any) => void) => void
  remove: () => void
}

interface LeafletMarker {
  setLatLng: (latlng: [number, number]) => void
  bindPopup: (content: string) => void
  openPopup: () => void
}

declare global {
  interface Window {
    L: any
  }
}

interface LeafletMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number }
  height?: string
  searchEnabled?: boolean
  showControls?: boolean
}

export function LeafletMap({
  onLocationSelect,
  initialLocation = { lat: 28.6139, lng: 77.209 }, // Delhi coordinates
  height = "400px",
  searchEnabled = true,
  showControls = true,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [marker, setMarker] = useState<LeafletMarker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [mapStyle, setMapStyle] = useState("standard")

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return

    // Initialize map
    const mapInstance = window.L.map(mapRef.current, {
      zoomControl: showControls,
    }).setView([initialLocation.lat, initialLocation.lng], 12)

    // Add tile layers
    const tileLayers = {
      standard: window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }),
      satellite: window.L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri, Maxar, Earthstar Geographics, and the GIS User Community",
          maxZoom: 19,
        },
      ),
      dark: window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }),
      terrain: window.L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
      }),
    }

    // Add default layer
    tileLayers.standard.addTo(mapInstance)

    // Add layer control if controls are enabled
    if (showControls) {
      window.L.control
        .layers(
          {
            Standard: tileLayers.standard,
            Satellite: tileLayers.satellite,
            Dark: tileLayers.dark,
            Terrain: tileLayers.terrain,
          },
          {},
          { position: "topright" },
        )
        .addTo(mapInstance)
    }

    // Create marker
    const markerInstance = window.L.marker([initialLocation.lat, initialLocation.lng], {
      draggable: true,
    }).addTo(mapInstance)

    markerInstance.bindPopup("Selected Location").openPopup()

    // Add click event to map
    mapInstance.on("click", async (e: any) => {
      const { lat, lng } = e.latlng
      markerInstance.setLatLng([lat, lng])

      // Reverse geocoding using Nominatim
      const address = await reverseGeocode(lat, lng)
      setSelectedLocation(address)

      if (onLocationSelect) {
        onLocationSelect({ lat, lng, address })
      }

      markerInstance.bindPopup(`<strong>Selected Location</strong><br/>${address}`).openPopup()
    })

    // Add drag event to marker
    markerInstance.on("dragend", async (e: any) => {
      const { lat, lng } = e.target.getLatLng()
      const address = await reverseGeocode(lat, lng)
      setSelectedLocation(address)

      if (onLocationSelect) {
        onLocationSelect({ lat, lng, address })
      }

      markerInstance.bindPopup(`<strong>Selected Location</strong><br/>${address}`).openPopup()
    })

    setMap(mapInstance)
    setMarker(markerInstance)
    setIsLoaded(true)
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map) return

    setIsSearching(true)
    try {
      // Use Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const lat = Number.parseFloat(result.lat)
        const lng = Number.parseFloat(result.lon)

        map.setView([lat, lng], 15)
        if (marker) {
          marker.setLatLng([lat, lng])
          marker.bindPopup(`<strong>Search Result</strong><br/>${result.display_name}`).openPopup()
        }

        setSelectedLocation(result.display_name)

        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address: result.display_name })
        }
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          map.setView([lat, lng], 15)
          marker.setLatLng([lat, lng])

          const address = await reverseGeocode(lat, lng)
          setSelectedLocation(address)

          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address })
          }

          marker.bindPopup(`<strong>Your Location</strong><br/>${address}`).openPopup()
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchLocation()
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      {searchEnabled && (
        <div className="p-4 border-b border-white/10">
          <div className="flex space-x-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for places in India..."
                className="glass-input w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-50"
                onClick={searchLocation}
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
            <AnimatedButton variant="outline" size="sm" onClick={getCurrentLocation}>
              <Navigation className="w-4 h-4" />
            </AnimatedButton>
          </div>

          {showControls && (
            <div className="flex space-x-2 mb-3">
              <select className="glass-input text-sm" value={mapStyle} onChange={(e) => setMapStyle(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          )}

          {selectedLocation && (
            <div className="text-sm text-white/80 flex items-center">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{selectedLocation}</span>
            </div>
          )}
        </div>
      )}

      <div ref={mapRef} style={{ height }} className="w-full relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="text-white/80 flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              <span>Loading map...</span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
