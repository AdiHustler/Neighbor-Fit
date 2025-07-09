"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { LeafletMap } from "@/components/ui/leaflet-map"
import { NeighborhoodMap } from "@/components/ui/neighborhood-map"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MapPin, Filter, Search, Layers } from "lucide-react"
import { HeatmapControls } from "@/components/ui/heatmap-controls"
import { HeatmapAnalytics } from "@/components/ui/heatmap-analytics"

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)

  const [neighborhoods] = useState([
    {
      id: 1,
      name: "Cyber City",
      lat: 28.4949,
      lng: 77.0869,
      matchScore: 94,
      rent: 35000,
      safety: 8,
      walkability: 7,
      schools: 9,
      nightlife: 6,
    },
    {
      id: 2,
      name: "Koramangala",
      lat: 12.9352,
      lng: 77.6245,
      matchScore: 89,
      rent: 28000,
      safety: 7,
      walkability: 8,
      schools: 8,
      nightlife: 9,
    },
    {
      id: 3,
      name: "Bandra West",
      lat: 19.0596,
      lng: 72.8295,
      matchScore: 87,
      rent: 55000,
      safety: 6,
      walkability: 9,
      schools: 7,
      nightlife: 10,
    },
    {
      id: 4,
      name: "Indiranagar",
      lat: 12.9719,
      lng: 77.6412,
      matchScore: 85,
      rent: 32000,
      safety: 8,
      walkability: 8,
      schools: 8,
      nightlife: 8,
    },
    {
      id: 5,
      name: "Powai",
      lat: 19.1176,
      lng: 72.906,
      matchScore: 83,
      rent: 42000,
      safety: 9,
      walkability: 6,
      schools: 9,
      nightlife: 5,
    },
  ])

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<any>(null)

  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapType, setHeatmapType] = useState<"rent" | "safety" | "amenities">("rent")

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location)
    console.log("Selected location:", location)
  }

  const handleNeighborhoodSelect = (neighborhood: any) => {
    setSelectedNeighborhood(neighborhood)
    console.log("Selected neighborhood:", neighborhood)
  }

  const handleHeatmapToggle = (enabled: boolean) => {
    setShowHeatmap(enabled)
  }

  const handleHeatmapTypeChange = (type: "rent" | "safety" | "amenities") => {
    setHeatmapType(type)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive <span className="gradient-text">Maps</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore neighborhoods with our advanced mapping system powered by OpenStreetMap and Leaflet.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Location Search Map */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 gradient-text flex items-center">
                  <Search className="w-6 h-6 mr-2" />
                  Location Search
                </h2>
                <p className="text-white/70 mb-4">
                  Search for any location in India, click on the map, or use your current location.
                </p>
              </GlassCard>

              <LeafletMap
                height="400px"
                onLocationSelect={handleLocationSelect}
                searchEnabled={true}
                showControls={true}
              />

              {selectedLocation && (
                <GlassCard className="p-4 mt-4">
                  <h3 className="font-semibold text-white mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Selected Location
                  </h3>
                  <p className="text-sm text-white/80 mb-2">{selectedLocation.address}</p>
                  <div className="flex space-x-4 text-xs text-white/60">
                    <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                    <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Neighborhood Overview Map */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 gradient-text flex items-center">
                  <Layers className="w-6 h-6 mr-2" />
                  Neighborhood Analysis
                </h2>
                <p className="text-white/70 mb-4">
                  View and compare neighborhoods with color-coded markers and density heatmaps.
                </p>
              </GlassCard>

              <NeighborhoodMap
                neighborhoods={neighborhoods}
                onNeighborhoodSelect={handleNeighborhoodSelect}
                height="400px"
                showHeatmap={showHeatmap}
                heatmapType={heatmapType}
                onHeatmapToggle={handleHeatmapToggle}
                onHeatmapTypeChange={handleHeatmapTypeChange}
              />
            </div>
          </div>

          {/* Heatmap Controls and Analytics */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <HeatmapControls
              onHeatmapToggle={handleHeatmapToggle}
              onHeatmapTypeChange={handleHeatmapTypeChange}
              currentType={heatmapType}
              isEnabled={showHeatmap}
            />

            <HeatmapAnalytics neighborhoods={neighborhoods} currentType={heatmapType} />
          </div>

          {/* Map Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Location Search</h3>
              <p className="text-sm text-white/70">
                Search any location in India with autocomplete suggestions and precise geocoding.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Layers className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Map Styles</h3>
              <p className="text-sm text-white/70">
                Switch between Standard, Satellite, Dark, and Terrain views for better visualization.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Filtering</h3>
              <p className="text-sm text-white/70">
                Filter neighborhoods by match score, rent, safety, and other important metrics.
              </p>
            </GlassCard>
          </div>

          {/* Selected Neighborhood Details */}
          {selectedNeighborhood && (
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Neighborhood Details</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">{selectedNeighborhood.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Match Score:</span>
                      <span className="text-green-400 font-bold">{selectedNeighborhood.matchScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Monthly Rent:</span>
                      <span className="text-blue-400 font-bold">
                        ₹{selectedNeighborhood.rent.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Safety Score:</span>
                      <span className="text-purple-400 font-bold">{selectedNeighborhood.safety}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Walkability:</span>
                      <span className="text-yellow-400 font-bold">{selectedNeighborhood.walkability}/10</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <AnimatedButton variant="glass" className="w-full">
                      View Full Details
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full">
                      Save to Favorites
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full">
                      Compare with Others
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  )
}
