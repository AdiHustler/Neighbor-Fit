"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { propertyAPI, type PropertyData, type RentAnalytics } from "@/lib/property-apis"
import { RefreshCw, Database, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface LiveRentHeatmapProps {
  onDataUpdate?: (properties: PropertyData[]) => void
  height?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function LiveRentHeatmap({
  onDataUpdate,
  height = "500px",
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
}: LiveRentHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [heatmapLayer, setHeatmapLayer] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [analytics, setAnalytics] = useState<RentAnalytics | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dataSources, setDataSources] = useState({
    "99acres": 0,
    magicbricks: 0,
    housing: 0,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      loadMap()
    }
  }, [isMounted])

  useEffect(() => {
    if (map && isLoaded && isMounted && typeof window !== "undefined") {
      loadLiveData().catch(console.error)
    }
  }, [map, isLoaded, isMounted])

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return

    let interval: NodeJS.Timeout | null = null

    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(() => {
        loadLiveData().catch(console.error)
      }, refreshInterval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, refreshInterval, isMounted])

  const loadMap = async () => {
    if (typeof window === "undefined") return

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

      await loadHeatmapPlugin()
      initializeMap(L)
    } catch (error) {
      console.error("Failed to load map:", error)
    }
  }

  const loadHeatmapPlugin = async () => {
    if (typeof window === "undefined") return

    return new Promise<void>((resolve) => {
      if (typeof window !== "undefined" && (window as any).L && (window as any).L.heatLayer) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"
      script.onload = () => resolve()
      script.onerror = () => resolve() // Continue even if heatmap plugin fails
      document.head.appendChild(script)
    })
  }

  const initializeMap = (L: any) => {
    if (!mapRef.current || typeof window === "undefined") return

    try {
      const mapInstance = L.map(mapRef.current).setView([28.6139, 77.209], 10)

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

  const loadLiveData = async () => {
    if (!map || typeof window === "undefined") return

    setIsLoading(true)
    setError(null)

    try {
      const bounds = map.getBounds()
      if (!bounds) {
        throw new Error("Unable to get map bounds")
      }

      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      }

      // Fetch data from all sources with timeout
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 10000))

      const dataPromise = propertyAPI.fetchAllSources(boundsObj)
      const { combined, sources } = (await Promise.race([dataPromise, timeoutPromise])) as any

      setProperties(combined || [])
      setDataSources({
        "99acres": sources?.["99acres"]?.length || 0,
        magicbricks: sources?.["magicbricks"]?.length || 0,
        housing: sources?.["housing"]?.length || 0,
      })

      // Update heatmap
      if (combined && combined.length > 0) {
        await updateHeatmap(combined)
      }

      // Fetch analytics for the area
      try {
        const cityAnalytics = await propertyAPI.fetchRentAnalytics("Gurgaon")
        setAnalytics(cityAnalytics)
      } catch (analyticsError) {
        console.warn("Failed to load analytics:", analyticsError)
      }

      setLastUpdated(new Date())

      if (onDataUpdate && combined) {
        onDataUpdate(combined)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load property data"
      setError(errorMessage)
      console.error("Error loading live data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateHeatmap = async (propertyData: PropertyData[]) => {
    if (!map || typeof window === "undefined") return

    try {
      const L = (await import("leaflet")).default

      // Remove existing heatmap
      if (heatmapLayer) {
        try {
          map.removeLayer(heatmapLayer)
        } catch (error) {
          console.error("Error removing heatmap layer:", error)
        }
      }

      // Check if heatmap plugin is available
      if (typeof window === "undefined" || !(window as any).L || !(window as any).L.heatLayer) {
        console.warn("Heatmap plugin not available")
        return
      }

      // Create heatmap data points
      const heatmapData = propertyData.map((property) => {
        // Normalize rent to 0-1 scale for intensity
        const maxRent = Math.max(...propertyData.map((p) => p.rent))
        const minRent = Math.min(...propertyData.map((p) => p.rent))
        const intensity = (property.rent - minRent) / (maxRent - minRent)

        return [property.lat, property.lng, Math.max(0.1, intensity)]
      })

      // Create new heatmap layer
      const newHeatmapLayer = (window as any).L.heatLayer(heatmapData, {
        radius: 40,
        blur: 25,
        maxZoom: 17,
        gradient: {
          0.0: "#00ff00", // Green (low rent)
          0.2: "#80ff00",
          0.4: "#ffff00", // Yellow
          0.6: "#ff8000", // Orange
          0.8: "#ff4000",
          1.0: "#ff0000", // Red (high rent)
        },
      }).addTo(map)

      setHeatmapLayer(newHeatmapLayer)

      // Add property markers
      propertyData.forEach((property) => {
        try {
          const marker = L.marker([property.lat, property.lng]).addTo(map)

          const popupContent = `
            <div style="min-width: 250px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">
                ${property.locality}
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 8px;">
                <div><strong>Rent:</strong> ₹${property.rent.toLocaleString("en-IN")}</div>
                <div><strong>Type:</strong> ${property.propertyType}</div>
                <div><strong>Bedrooms:</strong> ${property.bedrooms}BHK</div>
                <div><strong>Area:</strong> ${property.area} sq ft</div>
                <div><strong>Furnished:</strong> ${property.furnished}</div>
                <div><strong>Source:</strong> ${property.source}</div>
              </div>
              <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                <strong>Amenities:</strong> ${property.amenities.join(", ")}
              </div>
              <div style="font-size: 10px; color: #888;">
                Updated: ${new Date(property.lastUpdated).toLocaleString()}
              </div>
            </div>
          `

          marker.bindPopup(popupContent)
        } catch (error) {
          console.error("Error creating marker:", error)
        }
      })
    } catch (error) {
      console.error("Failed to update heatmap:", error)
    }
  }

  const handleRefresh = () => {
    loadLiveData()
  }

  const getDataSourceColor = (source: string) => {
    switch (source) {
      case "99acres":
        return "text-blue-400"
      case "magicbricks":
        return "text-green-400"
      case "housing":
        return "text-purple-400"
      default:
        return "text-white"
    }
  }

  if (!isMounted) {
    return (
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Live Rent Data</h3>
            </div>
          </div>
        </div>
        <div style={{ height }} className="w-full relative bg-white/5 animate-pulse" />
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden">
      {/* Header with Live Data Status */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Live Rent Data</h3>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            )}
          </div>
          <AnimatedButton variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </AnimatedButton>
        </div>

        {/* Data Sources Status */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          {Object.entries(dataSources).map(([source, count]) => (
            <div key={source} className="text-center">
              <div className={`text-lg font-bold ${getDataSourceColor(source)}`}>{count}</div>
              <div className="text-xs text-white/60 capitalize">{source}</div>
            </div>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {error ? (
              <div className="flex items-center space-x-1 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Error loading data</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Live data active</span>
              </div>
            )}
          </div>
          {lastUpdated && (
            <div className="flex items-center space-x-1 text-white/60">
              <Clock className="w-4 h-4" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">{error}</div>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ height }} className="w-full relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="text-white/80 flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              <span>Loading live rent data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Panel */}
      {analytics && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market Analytics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">₹{analytics.averageRent.toLocaleString("en-IN")}</div>
              <div className="text-white/60">Avg Rent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">₹{analytics.medianRent.toLocaleString("en-IN")}</div>
              <div className="text-white/60">Median Rent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">₹{analytics.pricePerSqft.toLocaleString("en-IN")}</div>
              <div className="text-white/60">Per Sq Ft</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${analytics.rentTrend >= 0 ? "text-green-400" : "text-red-400"}`}>
                {analytics.rentTrend >= 0 ? "+" : ""}
                {analytics.rentTrend}%
              </div>
              <div className="text-white/60">Trend</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 text-center">
            Based on {analytics.totalListings} active listings • Updated{" "}
            {new Date(analytics.lastUpdated).toLocaleString()}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/70">Rent Intensity:</span>
          <span className="text-white/60">{properties.length} properties</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Affordable</span>
          <div className="flex-1 mx-3 h-3 rounded bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
          <span className="text-xs text-white/60">Expensive</span>
        </div>
      </div>
    </GlassCard>
  )
}
