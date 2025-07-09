"use client"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { TrendingUp, Shield, Home, DollarSign, Coffee } from "lucide-react"

interface HeatmapControlsProps {
  onHeatmapToggle: (enabled: boolean) => void
  onHeatmapTypeChange: (type: "rent" | "safety" | "amenities") => void
  currentType: "rent" | "safety" | "amenities"
  isEnabled: boolean
}

export function HeatmapControls({
  onHeatmapToggle,
  onHeatmapTypeChange,
  currentType,
  isEnabled,
}: HeatmapControlsProps) {
  const heatmapTypes = [
    {
      id: "rent" as const,
      label: "Rent Density",
      icon: DollarSign,
      description: "Areas with higher rental costs",
      gradient: "from-green-500 via-yellow-500 via-orange-500 to-red-500",
      lowLabel: "Affordable",
      highLabel: "Expensive",
    },
    {
      id: "safety" as const,
      label: "Safety Zones",
      icon: Shield,
      description: "Crime and safety risk areas",
      gradient: "from-green-500 via-yellow-500 via-orange-500 to-red-500",
      lowLabel: "Very Safe",
      highLabel: "High Risk",
    },
    {
      id: "amenities" as const,
      label: "Amenity Density",
      icon: Coffee,
      description: "Concentration of facilities and services",
      gradient: "from-red-500 via-orange-500 via-yellow-500 to-green-500",
      lowLabel: "Few Amenities",
      highLabel: "Rich Amenities",
    },
  ]

  const currentHeatmap = heatmapTypes.find((type) => type.id === currentType)

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold gradient-text">Density Heatmaps</h3>
          <button
            onClick={() => onHeatmapToggle(!isEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-white/70">
          Visualize data density patterns across neighborhoods using color-coded heat overlays.
        </p>

        {/* Heatmap Type Selection */}
        {isEnabled && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Select Data Type</h4>
            <div className="grid gap-3">
              {heatmapTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    currentType === type.id
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => onHeatmapTypeChange(type.id)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <type.icon className={`w-5 h-5 ${currentType === type.id ? "text-blue-400" : "text-white/70"}`} />
                    <span className={`font-medium ${currentType === type.id ? "text-white" : "text-white/80"}`}>
                      {type.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mb-3">{type.description}</p>

                  {/* Gradient Preview */}
                  <div className="space-y-2">
                    <div className={`h-2 rounded bg-gradient-to-r ${type.gradient}`}></div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{type.lowLabel}</span>
                      <span>{type.highLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Heatmap Info */}
        {isEnabled && currentHeatmap && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <currentHeatmap.icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Active: {currentHeatmap.label}</span>
            </div>
            <div className="space-y-2">
              <div className={`h-2 rounded bg-gradient-to-r ${currentHeatmap.gradient}`}></div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{currentHeatmap.lowLabel}</span>
                <span>{currentHeatmap.highLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Settings */}
        {isEnabled && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Display Settings</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-white/80 mb-2">Intensity</label>
                <input type="range" min="0.3" max="1" step="0.1" defaultValue="0.7" className="w-full" />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Radius</label>
                <input type="range" min="20" max="100" step="10" defaultValue="50" className="w-full" />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Blur</label>
                <input type="range" min="10" max="50" step="5" defaultValue="35" className="w-full" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <AnimatedButton variant="outline" size="sm" className="flex-1">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </AnimatedButton>
          <AnimatedButton variant="outline" size="sm" className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Export
          </AnimatedButton>
        </div>
      </div>
    </GlassCard>
  )
}
