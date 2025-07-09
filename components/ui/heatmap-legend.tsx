"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { DollarSign, Shield, Coffee, Info } from "lucide-react"

interface HeatmapLegendProps {
  type: "rent" | "safety" | "amenities"
  isVisible: boolean
}

export function HeatmapLegend({ type, isVisible }: HeatmapLegendProps) {
  if (!isVisible) return null

  const legendData = {
    rent: {
      icon: DollarSign,
      title: "Rent Density",
      description: "Color intensity represents rental price levels",
      gradient: "from-green-500 via-yellow-500 via-orange-500 to-red-500",
      scale: [
        { color: "bg-green-500", label: "₹10K-25K", description: "Affordable housing" },
        { color: "bg-yellow-500", label: "₹25K-40K", description: "Mid-range options" },
        { color: "bg-orange-500", label: "₹40K-60K", description: "Premium areas" },
        { color: "bg-red-500", label: "₹60K+", description: "Luxury locations" },
      ],
    },
    safety: {
      icon: Shield,
      title: "Safety Zones",
      description: "Heat intensity shows crime risk levels",
      gradient: "from-green-500 via-yellow-500 via-orange-500 to-red-500",
      scale: [
        { color: "bg-green-500", label: "9-10/10", description: "Very safe areas" },
        { color: "bg-yellow-500", label: "7-8/10", description: "Generally safe" },
        { color: "bg-orange-500", label: "5-6/10", description: "Moderate risk" },
        { color: "bg-red-500", label: "1-4/10", description: "High risk zones" },
      ],
    },
    amenities: {
      icon: Coffee,
      title: "Amenity Density",
      description: "Concentration of facilities and services",
      gradient: "from-red-500 via-orange-500 via-yellow-500 to-green-500",
      scale: [
        { color: "bg-red-500", label: "1-3/10", description: "Limited facilities" },
        { color: "bg-orange-500", label: "4-5/10", description: "Basic amenities" },
        { color: "bg-yellow-500", label: "6-7/10", description: "Good facilities" },
        { color: "bg-green-500", label: "8-10/10", description: "Rich amenities" },
      ],
    },
  }

  const data = legendData[type]

  return (
    <GlassCard className="p-4 fixed bottom-4 right-4 z-50 max-w-xs">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <data.icon className="w-4 h-4 text-blue-400" />
          <h4 className="font-semibold text-white text-sm">{data.title}</h4>
        </div>

        {/* Description */}
        <p className="text-xs text-white/70">{data.description}</p>

        {/* Gradient Bar */}
        <div className="space-y-2">
          <div className={`h-3 rounded bg-gradient-to-r ${data.gradient}`}></div>
          <div className="flex justify-between text-xs text-white/60">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Scale Details */}
        <div className="space-y-2">
          {data.scale.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-white">{item.label}</div>
                <div className="text-xs text-white/60">{item.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-start space-x-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
          <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-300">
            Heatmap shows data density. Darker areas indicate higher concentration.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
