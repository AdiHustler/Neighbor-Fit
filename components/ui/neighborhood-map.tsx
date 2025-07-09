"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MapPin, Home, Shield, TrendingUp } from "lucide-react"

interface NeighborhoodData {
  id: number
  name: string
  lat: number
  lng: number
  matchScore: number
  rent: number
  safety: number
  walkability: number
  schools: number
  nightlife: number
}

interface NeighborhoodMapProps {
  neighborhoods: NeighborhoodData[]
  onNeighborhoodSelect?: (neighborhood: NeighborhoodData) => void
  height?: string
  showHeatmap?: boolean
}

export function NeighborhoodMap({
  neighborhoods,
  onNeighborhoodSelect,
  height = "500px",
  showHeatmapProp = false,
}: NeighborhoodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)
  const [filterType, setFilterType] = useState<"matchScore" | "rent" | "safety">("matchScore")
  const [heatmapType, setHeatmapType] = useState<"rent" | "safety" | "amenities">("rent")
  const [heatmapLayer, setHeatmapLayer] = useState<any>(null)
  const [showHeatmap, setShowHeatmap] = useState(showHeatmapProp)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return

    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Dynamic import of Leaflet
        const L = (await import("leaflet")).default

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        initializeMap(L)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()

    return () => {
      if (map && typeof map.remove === "function") {
        try {
          map.remove()
        } catch (error) {
          console.error("Error removing map:", error)
        }
      }
    }
  }, [isMounted])

  useEffect(() => {
    if (map && isLoaded && isMounted && typeof window !== "undefined") {
      updateMarkers()
    }
  }, [neighborhoods, filterType, map, isLoaded, isMounted])

  const initializeMap = (L: any) => {
    if (!mapRef.current || typeof window === "undefined") return

    try {
      // Calculate center from neighborhoods
      const center =
        neighborhoods.length > 0
          ? [
              neighborhoods.reduce((sum, n) => sum + n.lat, 0) / neighborhoods.length,
              neighborhoods.reduce((sum, n) => sum + n.lng, 0) / neighborhoods.length,
            ]
          : [28.6139, 77.209] // Delhi default

      const mapInstance = L.map(mapRef.current).setView(center, 11)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance)

      setMap(mapInstance)
      setIsLoaded(true)
    } catch (error) {
      console.error("Failed to initialize map:", error)
    }
  }

  const getMarkerColor = (neighborhood: NeighborhoodData) => {
    let value: number
    switch (filterType) {
      case "matchScore":
        value = neighborhood.matchScore
        break
      case "rent":
        value = 100 - (neighborhood.rent / 100000) * 100 // Invert for color scale
        break
      case "safety":
        value = neighborhood.safety * 10
        break
      default:
        value = neighborhood.matchScore
    }

    if (value >= 80) return "#10B981" // Green
    if (value >= 60) return "#F59E0B" // Yellow
    if (value >= 40) return "#EF4444" // Red
    return "#6B7280" // Gray
  }

  const getMarkerIcon = (neighborhood: NeighborhoodData, L: any) => {
    const color = getMarkerColor(neighborhood)
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${neighborhood.matchScore}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }

  const updateMarkers = async () => {
    if (!map || typeof window === "undefined") return

    try {
      const L = (await import("leaflet")).default

      // Clear existing markers
      markers.forEach((marker) => {
        if (marker && typeof marker.remove === "function") {
          try {
            map.removeLayer(marker)
          } catch (error) {
            console.error("Error removing marker:", error)
          }
        }
      })

      // Add new markers
      const newMarkers = neighborhoods
        .map((neighborhood) => {
          try {
            const marker = L.marker([neighborhood.lat, neighborhood.lng], {
              icon: getMarkerIcon(neighborhood, L),
            }).addTo(map)

            const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${neighborhood.name}</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><strong>Match:</strong> ${neighborhood.matchScore}%</div>
                <div><strong>Rent:</strong> ₹${neighborhood.rent.toLocaleString("en-IN")}</div>
                <div><strong>Safety:</strong> ${neighborhood.safety}/10</div>
                <div><strong>Walk:</strong> ${neighborhood.walkability}/10</div>
                <div><strong>Schools:</strong> ${neighborhood.schools}/10</div>
                <div><strong>Nightlife:</strong> ${neighborhood.nightlife}/10</div>
              </div>
            </div>
          `

            marker.bindPopup(popupContent)

            marker.on("click", () => {
              setSelectedNeighborhood(neighborhood)
              if (onNeighborhoodSelect) {
                onNeighborhoodSelect(neighborhood)
              }
            })

            return marker
          } catch (error) {
            console.error("Error creating marker:", error)
            return null
          }
        })
        .filter(Boolean)

      setMarkers(newMarkers)

      // Fit map to show all markers
      if (newMarkers.length > 0) {
        try {
          const group = new L.featureGroup(newMarkers)
          map.fitBounds(group.getBounds().pad(0.1))
        } catch (error) {
          console.error("Error fitting bounds:", error)
        }
      }
    } catch (error) {
      console.error("Failed to update markers:", error)
    }
  }

  const getFilterIcon = (type: string) => {
    switch (type) {
      case "matchScore":
        return <TrendingUp className="w-4 h-4" />
      case "rent":
        return <Home className="w-4 h-4" />
      case "safety":
        return <Shield className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  if (!isMounted) {
    return (
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Neighborhood Map</h3>
            <span className="text-sm text-white/60">Loading...</span>
          </div>
        </div>
        <div style={{ height }} className="w-full relative bg-white/5 animate-pulse" />
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden">
      {/* Map Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Neighborhood Map</h3>
          <span className="text-sm text-white/60">{neighborhoods.length} locations</span>
        </div>

        {/* Marker Filter Controls */}
        <div className="flex space-x-2 mb-3">
          {["matchScore", "rent", "safety"].map((type) => (
            <AnimatedButton
              key={type}
              variant={filterType === type ? "glass" : "outline"}
              size="sm"
              onClick={() => setFilterType(type as any)}
            >
              {getFilterIcon(type)}
              <span className="ml-1 capitalize">{type === "matchScore" ? "Match" : type}</span>
            </AnimatedButton>
          ))}
        </div>

        {/* Heatmap Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Density Heatmap</span>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showHeatmap ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showHeatmap ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {showHeatmap && (
            <div className="flex space-x-2">
              {["rent", "safety", "amenities"].map((type) => (
                <AnimatedButton
                  key={type}
                  variant={heatmapType === type ? "glass" : "outline"}
                  size="sm"
                  onClick={() => setHeatmapType(type as any)}
                >
                  <span className="capitalize">{type}</span>
                </AnimatedButton>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ height }} className="w-full relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="text-white/80 flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              <span>Loading neighborhood map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Color Scale:</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white/60">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-white/60">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-white/60">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      {showHeatmap && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="text-sm mb-3">
            <span className="text-white/70">Heatmap: </span>
            <span className="text-white font-medium capitalize">{heatmapType}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">
              {heatmapType === "rent" ? "Low Rent" : heatmapType === "safety" ? "Safe" : "Few Amenities"}
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded"></div>
            </div>
            <span className="text-white/60">
              {heatmapType === "rent" ? "High Rent" : heatmapType === "safety" ? "Dangerous" : "Many Amenities"}
            </span>
          </div>
        </div>
      )}

      {/* Selected Neighborhood Info */}
      {selectedNeighborhood && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <h4 className="font-semibold text-white mb-2">{selectedNeighborhood.name}</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{selectedNeighborhood.matchScore}%</div>
              <div className="text-white/60">Match Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                ₹{selectedNeighborhood.rent.toLocaleString("en-IN")}
              </div>
              <div className="text-white/60">Monthly Rent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{selectedNeighborhood.safety}/10</div>
              <div className="text-white/60">Safety Score</div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
