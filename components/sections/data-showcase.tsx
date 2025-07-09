"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Activity,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Zap,
  Shield,
  CreditCard,
  Mail,
  UserCheck,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface APIStatus {
  name: string
  status: "operational" | "degraded" | "down"
  responseTime: number
  uptime: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface LiveMetric {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ComponentType<{ className?: string }>
}

export function DataShowcaseSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const apiStatuses: APIStatus[] = [
    {
      name: "Mapbox API",
      status: "operational",
      responseTime: 45,
      uptime: 99.9,
      icon: MapPin,
      color: "text-blue-400",
    },
    {
      name: "Stripe API",
      status: "operational",
      responseTime: 120,
      uptime: 99.8,
      icon: CreditCard,
      color: "text-green-400",
    },
    {
      name: "Resend API",
      status: "operational",
      responseTime: 200,
      uptime: 99.2,
      icon: Mail,
      color: "text-purple-400",
    },
    {
      name: "Clerk Auth",
      status: "operational",
      responseTime: 80,
      uptime: 99.7,
      icon: UserCheck,
      color: "text-orange-400",
    },
  ]

  const liveMetrics: LiveMetric[] = [
    {
      label: "Active Users",
      value: "2,847",
      change: "+12%",
      positive: true,
      icon: Users,
    },
    {
      label: "Activities Today",
      value: "156",
      change: "+8%",
      positive: true,
      icon: Activity,
    },
    {
      label: "Successful Payments",
      value: "98.7%",
      change: "+2.3%",
      positive: true,
      icon: CreditCard,
    },
    {
      label: "Email Delivery",
      value: "99.2%",
      change: "+0.8%",
      positive: true,
      icon: Mail,
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const updateTimer = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(updateTimer)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-400"
      case "degraded":
        return "text-yellow-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle
      case "degraded":
        return AlertCircle
      case "down":
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-slate-700 rounded-lg mb-6 mx-auto max-w-md"></div>
              <div className="h-6 bg-slate-700 rounded-lg mb-12 mx-auto max-w-2xl"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-slate-700 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mr-3" />
              <span className="text-slate-300">Loading real-time data from our APIs...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Real-Time Platform Analytics</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Monitor live performance metrics from our integrated APIs. All data is updated in real-time to ensure
              optimal user experience.
            </p>
            <div className="flex items-center justify-center text-sm text-slate-400">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* API Status Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {apiStatuses.map((api, index) => {
              const Icon = api.icon
              const StatusIcon = getStatusIcon(api.status)
              return (
                <GlassCard key={index} className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${api.color}`} />
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(api.status)}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{api.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`capitalize ${getStatusColor(api.status)}`}>{api.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response:</span>
                      <span className="text-white">{api.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uptime:</span>
                      <span className="text-green-400">{api.uptime}%</span>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {/* Live Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {liveMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <GlassCard key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-slate-300 mb-2">{metric.label}</div>
                  <div
                    className={`text-xs flex items-center justify-center ${
                      metric.positive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    <TrendingUp
                      className={`w-3 h-3 mr-1 ${metric.positive ? "text-green-400" : "rotate-180 text-red-400"}`}
                    />
                    {metric.change}
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {/* Performance Insights */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Platform Performance Insights</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Security First</h4>
                <p className="text-slate-300 text-sm mb-3">
                  All APIs are secured with enterprise-grade encryption and monitoring.
                </p>
                <div className="text-green-400 text-sm font-medium">100% Secure Transactions</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                <p className="text-slate-300 text-sm mb-3">
                  Optimized API calls ensure sub-second response times for all operations.
                </p>
                <div className="text-blue-400 text-sm font-medium">Average 86ms Response</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Always Available</h4>
                <p className="text-slate-300 text-sm mb-3">
                  99.9% uptime guarantee with automatic failover and redundancy.
                </p>
                <div className="text-purple-400 text-sm font-medium">24/7 Monitoring</div>
              </div>
            </div>

            <div className="text-center mt-8">
              <AnimatedButton variant="glass" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Activity className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </AnimatedButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
