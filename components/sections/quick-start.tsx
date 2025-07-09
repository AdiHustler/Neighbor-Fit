"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { User, Search, Calendar, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function QuickStartSection() {
  const steps = [
    {
      number: "01",
      icon: User,
      title: "Create Your Profile",
      description:
        "Set up your fitness preferences, goals, and availability. Connect your fitness trackers for personalized matching.",
      features: ["Fitness level assessment", "Goal setting", "Schedule preferences", "Activity interests"],
      cta: "Start Profile",
      href: "/profile",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      number: "02",
      icon: Search,
      title: "Discover Activities",
      description:
        "Browse fitness activities in your neighborhood with smart location matching. Filter by type, difficulty, and distance.",
      features: ["Real-time activity feed", "Location-based search", "Difficulty filtering", "Time slot availability"],
      cta: "Browse Activities",
      href: "/activities",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      number: "03",
      icon: Calendar,
      title: "Join or Host Events",
      description:
        "Participate in existing activities or create your own. Our smart matching algorithm connects you with compatible fitness partners.",
      features: ["Event creation tools", "Smart partner matching", "Calendar integration", "Group messaging"],
      cta: "View Calendar",
      href: "/activities",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      number: "04",
      icon: Users,
      title: "Build Your Network",
      description:
        "Connect with like-minded neighbors, track progress together, and build lasting fitness friendships in your community.",
      features: ["Progress tracking", "Achievement sharing", "Community challenges", "Social connections"],
      cta: "Join Community",
      href: "/live-data",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  const benefits = [
    "AI-powered partner matching based on fitness preferences",
    "Real-time activity tracking and progress monitoring",
    "Local venue discovery with detailed location information",
    "Community challenges and achievement system",
    "In-app messaging and coordination tools",
    "Progress analytics and goal tracking dashboard",
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get Started in 4 Simple Steps</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Join your neighborhood fitness community in minutes. Our platform provides personalized experiences and
            meaningful connections.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <GlassCard key={index} className="p-8 hover:scale-105 transition-transform duration-300">
                <div className="flex items-start space-x-6">
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className={`text-2xl font-bold ${step.color} mr-4`}>{step.number}</span>
                      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    </div>

                    <p className="text-slate-300 mb-6">{step.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link href={step.href}>
                      <AnimatedButton variant="outline" className={`border-slate-600 ${step.color} hover:bg-slate-800`}>
                        {step.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Why Choose NeighborFit?</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <GlassCard className="p-8">
              <h4 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Fitness Journey?</h4>
              <p className="text-slate-300 mb-6">
                Join thousands of neighbors who have found their perfect fitness community through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile">
                  <AnimatedButton size="lg" variant="glass" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <User className="w-5 h-5 mr-2" />
                    Create Profile
                  </AnimatedButton>
                </Link>
                <Link href="/activities">
                  <AnimatedButton
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Explore Activities
                  </AnimatedButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
