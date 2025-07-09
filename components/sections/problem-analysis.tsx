"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Users,
  MapPin,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  CreditCard,
  Mail,
  UserCheck,
  ArrowRight,
} from "lucide-react"

export function ProblemAnalysisSection() {
  const [activeTab, setActiveTab] = useState("problems")

  const problems = [
    {
      icon: Users,
      title: "Lack of Fitness Community",
      description: "67% of people struggle to find consistent workout partners in their neighborhood",
      stat: "67%",
      color: "text-red-400",
    },
    {
      icon: MapPin,
      title: "Location Barriers",
      description: "Average person travels 8.5km to find suitable fitness activities",
      stat: "8.5km",
      color: "text-orange-400",
    },
    {
      icon: Clock,
      title: "Schedule Mismatches",
      description: "73% of fitness attempts fail due to incompatible timing with others",
      stat: "73%",
      color: "text-yellow-400",
    },
    {
      icon: TrendingDown,
      title: "Motivation Decline",
      description: "85% of people quit fitness routines within 3 months without social support",
      stat: "85%",
      color: "text-purple-400",
    },
  ]

  const solutions = [
    {
      icon: MapPin,
      title: "Smart Location Matching",
      description: "Mapbox integration provides precise neighborhood-based activity discovery",
      feature: "Real-time proximity matching",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description: "Stripe integration ensures secure, instant payments for activities and subscriptions",
      feature: "PCI-compliant transactions",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Resend API delivers timely updates about activities, bookings, and community events",
      feature: "Intelligent email automation",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: UserCheck,
      title: "Secure Authentication",
      description: "Clerk Auth provides enterprise-grade security for user accounts and data",
      feature: "Multi-factor authentication",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  const metrics = [
    { label: "API Uptime", value: "99.9%", change: "+0.1%", positive: true },
    { label: "Payment Success Rate", value: "98.7%", change: "+2.3%", positive: true },
    { label: "Email Delivery Rate", value: "99.2%", change: "+0.8%", positive: true },
    { label: "Auth Response Time", value: "45ms", change: "-12ms", positive: true },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Fitness Community Challenge</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We analyzed the barriers preventing people from maintaining consistent fitness routines and built a
              technology solution that addresses each challenge.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/50 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab("problems")}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === "problems" ? "bg-red-500/20 text-red-300" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Problems
              </button>
              <button
                onClick={() => setActiveTab("solutions")}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === "solutions" ? "bg-green-500/20 text-green-300" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Our Solution
              </button>
              <button
                onClick={() => setActiveTab("metrics")}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === "metrics" ? "bg-blue-500/20 text-blue-300" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Performance
              </button>
            </div>
          </div>

          {/* Problems Tab */}
          {activeTab === "problems" && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {problems.map((problem, index) => {
                const Icon = problem.icon
                return (
                  <GlassCard key={index} className="p-8 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-6 h-6 ${problem.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
                        <p className="text-slate-300 mb-4">{problem.description}</p>
                        <div className="flex items-center">
                          <div className={`text-3xl font-bold ${problem.color} mr-2`}>{problem.stat}</div>
                          <div className="text-sm text-slate-400">of users affected</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}

          {/* Solutions Tab */}
          {activeTab === "solutions" && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {solutions.map((solution, index) => {
                const Icon = solution.icon
                return (
                  <GlassCard key={index} className="p-8 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 ${solution.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${solution.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3">{solution.title}</h3>
                        <p className="text-slate-300 mb-4">{solution.description}</p>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-sm text-green-300 font-medium">{solution.feature}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === "metrics" && (
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <GlassCard key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-slate-300 mb-2">{metric.label}</div>
                  <div
                    className={`text-xs flex items-center justify-center ${
                      metric.positive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    <TrendingDown
                      className={`w-3 h-3 mr-1 ${metric.positive ? "rotate-180 text-green-400" : "text-red-400"}`}
                    />
                    {metric.change}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Technology Stack Showcase */}
          <GlassCard className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Enterprise-Grade Technology Stack</h3>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Mapbox</h4>
                <p className="text-sm text-slate-300">Location Intelligence</p>
                <div className="text-xs text-blue-400 mt-1">99.9% Uptime</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Stripe</h4>
                <p className="text-sm text-slate-300">Payment Processing</p>
                <div className="text-xs text-green-400 mt-1">PCI Compliant</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Resend</h4>
                <p className="text-sm text-slate-300">Email Delivery</p>
                <div className="text-xs text-purple-400 mt-1">99.2% Delivery</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                  <UserCheck className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Clerk</h4>
                <p className="text-sm text-slate-300">Authentication</p>
                <div className="text-xs text-orange-400 mt-1">SOC 2 Certified</div>
              </div>
            </div>
            <AnimatedButton variant="glass" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Experience Our Solution
              <ArrowRight className="w-4 h-4 ml-2" />
            </AnimatedButton>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
