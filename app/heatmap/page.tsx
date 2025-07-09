"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { NeighborhoodMap } from "@/components/ui/neighborhood-map"
import { HeatmapControls } from "@/components/ui/heatmap-controls"
import { HeatmapAnalytics } from "@/components/ui/heatmap-analytics"
import { HeatmapLegend } from "@/components/ui/heatmap-legend"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { BarChart3, Download, Share2, Settings } from "lucide-react"

export default function HeatmapPage() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [heatmapType, setHeatmapType] = useState<"rent" | "safety" | "amenities">("rent")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<any>(null)

  const neighborhoods = [
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
    {
      id: 6,
      name: "Whitefield",
      lat: 12.9698,
      lng: 77.7499,
      matchScore: 81,
      rent: 26000,
      safety: 7,
      walkability: 5,
      schools: 8,
      nightlife: 4,
    },
    {
      id: 7,
      name: "Andheri West",
      lat: 19.1136,
      lng: 72.8697,
      matchScore: 79,
      rent: 48000,
      safety: 6,
      walkability: 8,
      schools: 7,
      nightlife: 9,
    },
    {
      id: 8,
      name: "Sector 62",
      lat: 28.6271,
      lng: 77.3716,
      matchScore: 77,
      rent: 22000,
      safety: 8,
      walkability: 6,
      schools: 7,
      nightlife: 5,
    },
  ]

  const handleHeatmapToggle = (enabled: boolean) => {
    setShowHeatmap(enabled)
  }

  const handleHeatmapTypeChange = (type: "rent" | "safety" | "amenities") => {
    setHeatmapType(type)
  }

  const handleNeighborhoodSelect = (neighborhood: any) => {
    setSelectedNeighborhood(neighborhood)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Density <span className="gradient-text">Heatmaps</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Visualize neighborhood data patterns with advanced heatmap overlays for rent, safety, and amenities.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{neighborhoods.length}</div>
              <div className="text-sm text-white/70">Neighborhoods</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-sm text-white/70">Heatmap Types</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">15K+</div>
              <div className="text-sm text-white/70">Data Points</div>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Real-time</div>
              <div className="text-sm text-white/70">Updates</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Heatmap Controls */}
            <div className="lg:col-span-1 space-y-6">
              <HeatmapControls
                onHeatmapToggle={handleHeatmapToggle}
                onHeatmapTypeChange={handleHeatmapTypeChange}
                currentType={heatmapType}
                isEnabled={showHeatmap}
              />

              {/* Export Options */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4 gradient-text">Export & Share</h3>
                <div className="space-y-3">
                  <AnimatedButton variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export PNG
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Export Data
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Link
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced
                  </AnimatedButton>
                </div>
              </GlassCard>
            </div>

            {/* Main Map */}
            <div className="lg:col-span-2 space-y-6">
              <NeighborhoodMap
                neighborhoods={neighborhoods}
                onNeighborhoodSelect={handleNeighborhoodSelect}
                height="600px"
                showHeatmap={showHeatmap}
                heatmapType={heatmapType}
                onHeatmapToggle={handleHeatmapToggle}
                onHeatmapTypeChange={handleHeatmapTypeChange}
              />

              <HeatmapAnalytics neighborhoods={neighborhoods} currentType={heatmapType} />
            </div>
          </div>

          {/* Selected Neighborhood Details */}
          {selectedNeighborhood && (
            <GlassCard className="p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Detailed Analysis</h2>
              <div className="grid md:grid-cols-3 gap-8">
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
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Amenity Scores</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Walkability:</span>
                      <span className="text-yellow-400 font-bold">{selectedNeighborhood.walkability}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Schools:</span>
                      <span className="text-green-400 font-bold">{selectedNeighborhood.schools}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Nightlife:</span>
                      <span className="text-pink-400 font-bold">{selectedNeighborhood.nightlife}/10</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <AnimatedButton variant="glass" className="w-full">
                      View Full Report
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full">
                      Save to Favorites
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full">
                      Compare Similar
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </main>

      {/* Floating Legend */}
      <HeatmapLegend type={heatmapType} isVisible={showHeatmap} />
    </div>
  )
}
