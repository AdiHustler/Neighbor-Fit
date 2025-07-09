"use client"

import type React from "react"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CheckCircle, Star, Zap, Crown, Users, Calendar, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  interval: "month" | "year"
  description: string
  features: string[]
  popular?: boolean
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  stripePriceId: string
}

export function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month")

  const plans: PricingPlan[] = [
    {
      id: "community",
      name: "Community",
      price: 0,
      interval: "month",
      description: "Perfect for getting started with neighborhood fitness",
      stripePriceId: "price_free",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      features: [
        "Join up to 5 activities per month",
        "Basic profile and matching",
        "Community chat access",
        "Activity discovery",
        "Progress tracking",
        "Mobile app access",
      ],
    },
    {
      id: "pro",
      name: "Fitness Pro",
      price: billingInterval === "month" ? 499 : 4990,
      originalPrice: billingInterval === "year" ? 5988 : undefined,
      interval: billingInterval,
      description: "For serious fitness enthusiasts who want unlimited access",
      stripePriceId: billingInterval === "month" ? "price_pro_monthly" : "price_pro_yearly",
      popular: true,
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      features: [
        "Unlimited activity participation",
        "Priority booking and matching",
        "Advanced analytics dashboard",
        "Create and host activities",
        "Premium support",
        "Exclusive pro-only events",
        "Nutrition tracking integration",
        "Custom workout plans",
        "Progress sharing with friends",
      ],
    },
    {
      id: "elite",
      name: "Elite Athlete",
      price: billingInterval === "month" ? 999 : 9990,
      originalPrice: billingInterval === "year" ? 11988 : undefined,
      interval: billingInterval,
      description: "Ultimate package for elite athletes and trainers",
      stripePriceId: billingInterval === "month" ? "price_elite_monthly" : "price_elite_yearly",
      icon: Crown,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      features: [
        "Everything in Fitness Pro",
        "Personal trainer matching",
        "1-on-1 coaching sessions",
        "Performance optimization",
        "Elite community access",
        "Priority customer support",
        "Advanced health metrics",
        "Custom meal planning",
        "Injury prevention programs",
        "Competition preparation",
        "Revenue sharing for trainers",
      ],
    },
  ]

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.price === 0) {
      // Free plan - direct signup
      window.location.href = "/profile?plan=free"
    } else {
      // Paid plans - go to payment page
      window.location.href = `/payment?plan=${plan.id}`
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Fitness Journey</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Start free and upgrade anytime. All plans include secure payments via Stripe and instant email
            confirmations.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingInterval === "month" ? "text-white" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setBillingInterval(billingInterval === "month" ? "year" : "month")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingInterval === "year" ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === "year" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`ml-3 ${billingInterval === "year" ? "text-white" : "text-slate-400"}`}>
              Yearly
              <span className="ml-1 text-green-400 text-sm font-semibold">(Save 17%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <GlassCard
                key={plan.id}
                className={`p-8 relative hover:scale-105 transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-green-500/50 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{plan.description}</p>

                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-slate-400 line-through text-lg">₹{plan.originalPrice}</div>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">
                        {plan.price === 0 ? "Free" : `₹${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-400 ml-2">/{billingInterval === "year" ? "year" : "month"}</span>
                      )}
                    </div>
                    {billingInterval === "year" && plan.price > 0 && (
                      <div className="text-sm text-slate-400 mt-1">
                        ₹{Math.round(plan.price / 12)}/month billed annually
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <AnimatedButton
                  onClick={() => handleSelectPlan(plan)}
                  variant={plan.popular ? "glass" : "outline"}
                  size="lg"
                  className={`w-full ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {plan.price === 0 ? (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Get Started Free
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Choose {plan.name}
                    </>
                  )}
                </AnimatedButton>
              </GlassCard>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Why Choose Our Premium Plans?</h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Secure Payments</h4>
                <p className="text-slate-300 text-sm">
                  All transactions secured by Stripe with 256-bit SSL encryption and PCI DSS compliance.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Flexible Billing</h4>
                <p className="text-slate-300 text-sm">
                  Monthly or yearly billing options. Cancel anytime with 30-day money-back guarantee.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Instant Access</h4>
                <p className="text-slate-300 text-sm">
                  Immediate activation after payment with email confirmation via our Resend integration.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-slate-400 text-sm mb-4">
                Have questions about our plans? Our support team is here to help.
              </p>
              <Link href="/contact">
                <AnimatedButton variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Contact Support
                </AnimatedButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
