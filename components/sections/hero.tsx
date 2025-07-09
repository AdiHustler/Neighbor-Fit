"use client"

import React from "react"

import { useState, useEffect } from "react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Typewriter } from "@/components/ui/typewriter"
import {
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Activity,
  Heart,
  Zap,
  Shield,
  CreditCard,
  Mail,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { label: "Active Members", value: "2,847", icon: Users, color: "text-blue-400" },
    { label: "Cities Covered", value: "12", icon: MapPin, color: "text-green-400" },
    { label: "Activities This Week", value: "156", icon: Calendar, color: "text-purple-400" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-orange-400" },
  ]

  const apiFeatures = [
    {
      icon: MapPin,
      name: "Mapbox",
      description: "Smart location matching",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: CreditCard,
      name: "Stripe",
      description: "Secure payments",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      name: "Resend",
      description: "Smart notifications",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: UserCheck,
      name: "Clerk",
      description: "Secure authentication",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium mb-4">
                  🚀 Now with Stripe Payment Integration
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  <Typewriter
                    words={["Fitness Buddy", "Workout Partner", "Running Mate", "Yoga Friend", "Gym Companion"]}
                    speed={100}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                Connect with neighbors who share your fitness passion. Join activities, build friendships, and achieve
                your wellness goals together with secure payments and smart matching.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/profile">
                  <AnimatedButton size="lg" variant="glass" className="bg-green-600 hover:bg-green-700 text-white">
                    <Users className="w-5 h-5 mr-2" />
                    Join Community
                  </AnimatedButton>
                </Link>
                <Link href="/activities">
                  <AnimatedButton
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Explore Activities
                  </AnimatedButton>
                </Link>
              </div>

              {/* API Integration Showcase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {apiFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className={`p-3 ${feature.bgColor} rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200`}
                    >
                      <Icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                      <div className="text-white text-sm font-medium">{feature.name}</div>
                      <div className="text-slate-400 text-xs">{feature.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column - Interactive Stats */}
            <div className="space-y-6">
              {/* Main Stat Card */}
              <GlassCard className="p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  {React.createElement(stats[currentStat].icon, {
                    className: `w-16 h-16 ${stats[currentStat].color} mx-auto`,
                  })}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stats[currentStat].value}</div>
                <div className="text-slate-300">{stats[currentStat].label}</div>
                <div className="flex justify-center mt-4 space-x-2">
                  {stats.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStat ? "bg-green-400" : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </GlassCard>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-lg font-semibold text-white mb-1">4.9/5</div>
                  <div className="text-sm text-slate-300">User Rating</div>
                </GlassCard>

                <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-lg font-semibold text-white mb-1">24/7</div>
                  <div className="text-sm text-slate-300">Platform Uptime</div>
                </GlassCard>
              </div>

              {/* Payment Security Badge */}
              <GlassCard className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-green-400 mr-2" />
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm font-medium text-white mb-1">Secure Payments</div>
                <div className="text-xs text-slate-400">Powered by Stripe • PCI Compliant</div>
              </GlassCard>

              {/* Social Proof */}
              <GlassCard className="p-6">
                <div className="flex items-center mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`/placeholder.svg?height=32&width=32&text=U${i}`}
                        alt={`User ${i}`}
                        className="w-8 h-8 rounded-full border-2 border-slate-800"
                      />
                    ))}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  "Found my perfect running group within days. The payment system is seamless!"
                </p>
                <p className="text-xs text-slate-400 mt-2">- Priya S., Gurgaon</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
