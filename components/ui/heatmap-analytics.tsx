"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface HeatmapAnalyticsProps {
  neighborhoods: any[]
  currentType: "rent" | "safety" | "amenities"
}

export function HeatmapAnalytics({ neighborhoods, currentType }: HeatmapAnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    average: 0,
    highest: { value: 0, name: "" },
    lowest: { value: 0, name: "" },
    trend: 0,
    hotspots: 0,
    distribution: { low: 0, medium: 0, high: 0 },
  })

  useEffect(() => {
    calculateAnalytics()
  }, [neighborhoods, currentType])

  const calculateAnalytics = () => {
    if (!neighborhoods.length) return

    const values: number[] = []
    const neighborhoodValues: { name: string; value: number }[] = []

    neighborhoods.forEach((neighborhood) => {
      let value: number
      switch (currentType) {
        case "rent":
          value = neighborhood.rent
          break
        case "safety":
          value = neighborhood.safety
          break
        case "amenities":
          value = (neighborhood.walkability + neighborhood.schools + neighborhood.nightlife) / 3
          break
        default:
          value = 0
      }
      values.push(value)
      neighborhoodValues.push({ name: neighborhood.name, value })
    })

    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    const sorted = neighborhoodValues.sort((a, b) => b.value - a.value)
    const highest = sorted[0]
    const lowest = sorted[sorted.length - 1]

    // Calculate distribution
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min
    const lowThreshold = min + range * 0.33
    const highThreshold = min + range * 0.67

    const distribution = values.reduce(
      (acc, val) => {
        if (val <= lowThreshold) acc.low++
        else if (val <= highThreshold) acc.medium++
        else acc.high++
        return acc
      },
      { low: 0, medium: 0, high: 0 },
    )

    // Calculate hotspots (areas with high concentration)
    const hotspots = values.filter((val) => val > average + (max - average) * 0.5).length

    // Mock trend calculation (in real app, this would compare with historical data)
    const trend = Math.random() * 20 - 10 // -10 to +10

    setAnalytics({
      average,
      highest,
      lowest,
      trend,
      hotspots,
      distribution,
    })
  }

  const formatValue = (value: number) => {
    switch (currentType) {
      case "rent":
        return `₹${value.toLocaleString("en-IN")}`
      case "safety":
        return `${value.toFixed(1)}/10`
      case "amenities":
        return `${value.toFixed(1)}/10`
      default:
        return value.toString()
    }
  }

  const getTypeLabel = () => {
    switch (currentType) {
      case "rent":
        return "Rental Prices"
      case "safety":
        return "Safety Scores"
      case "amenities":
        return "Amenity Ratings"
      default:
        return "Values"
    }
  }

  const getTrendIcon = () => {
    if (analytics.trend > 2) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (analytics.trend < -2) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <CheckCircle className="w-4 h-4 text-yellow-400" />
  }

  const getTrendColor = () => {
    if (analytics.trend > 2) return "text-green-400"
    if (analytics.trend < -2) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold gradient-text">Heatmap Analytics</h3>
          <span className="text-sm text-white/60">{getTypeLabel()}</span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{formatValue(analytics.average)}</div>
            <div className="text-sm text-white/70">Average {currentType}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{analytics.hotspots}</div>
            <div className="text-sm text-white/70">High Density Areas</div>
          </div>
        </div>

        {/* Highest & Lowest */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div>
              <div className="font-semibold text-white">Highest: {analytics.highest.name}</div>
              <div className="text-sm text-green-400">{formatValue(analytics.highest.value)}</div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div>
              <div className="font-semibold text-white">Lowest: {analytics.lowest.name}</div>
              <div className="text-sm text-blue-400">{formatValue(analytics.lowest.value)}</div>
            </div>
            <TrendingDown className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">Distribution</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Low</span>
              <span className="text-sm text-white">{analytics.distribution.low} areas</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(analytics.distribution.low / neighborhoods.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Medium</span>
              <span className="text-sm text-white">{analytics.distribution.medium} areas</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(analytics.distribution.medium / neighborhoods.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">High</span>
              <span className="text-sm text-white">{analytics.distribution.high} areas</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${(analytics.distribution.high / neighborhoods.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Market Trend</span>
            {getTrendIcon()}
          </div>
          <div className={`text-lg font-bold ${getTrendColor()}`}>
            {analytics.trend > 0 ? "+" : ""}
            {analytics.trend.toFixed(1)}%
          </div>
          <div className="text-xs text-white/60">
            {analytics.trend > 2
              ? "Increasing trend detected"
              : analytics.trend < -2
                ? "Decreasing trend detected"
                : "Stable market conditions"}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-white">Key Insights</h4>
          <div className="space-y-2 text-sm text-white/70">
            {currentType === "rent" && (
              <>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Premium areas show 40% higher rent than average</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Emerging areas offer 25% better value</span>
                </div>
              </>
            )}

            {currentType === "safety" && (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>85% of areas have safety scores above 7/10</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>3 areas require additional safety measures</span>
                </div>
              </>
            )}

            {currentType === "amenities" && (
              <>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Metro-connected areas have 60% more amenities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>New developments improving amenity density</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
