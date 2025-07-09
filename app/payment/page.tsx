"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CreditCard, Check, Star, MapPin, Clock, Users, Smartphone, Wallet, ArrowLeft, Calendar } from "lucide-react"

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  processingFee?: string
}

interface ActivityBooking {
  id: string
  title: string
  location: string
  date: string
  time: string
  price: number
  organizer: string
  participants: number
  maxParticipants: number
}

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("pro")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [bookingMode, setBookingMode] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityBooking | null>(null)

  // Card form state
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, RuPay",
      processingFee: "2.9% + ₹3",
    },
    {
      id: "upi",
      name: "UPI",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Google Pay, PhonePe, Paytm",
      processingFee: "Free",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: <Wallet className="w-5 h-5" />,
      description: "Paytm, Amazon Pay, Mobikwik",
      processingFee: "1.5%",
    },
  ]

  const plans = [
    {
      id: "community",
      name: "Community",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Join free activities",
        "Basic neighborhood insights",
        "Community chat access",
        "Activity notifications",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Fitness Pro",
      price: { monthly: 499, yearly: 4990 },
      features: [
        "All Community features",
        "Premium activity access",
        "Personal fitness tracking",
        "Advanced location analytics",
        "Priority booking",
        "Exclusive events",
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite Athlete",
      price: { monthly: 999, yearly: 9990 },
      features: [
        "All Fitness Pro features",
        "1-on-1 coaching sessions",
        "Custom workout plans",
        "Nutrition guidance",
        "Performance analytics",
        "VIP community access",
      ],
      popular: false,
    },
  ]

  // Sample activity for booking
  const sampleActivity: ActivityBooking = {
    id: "1",
    title: "HIIT Bootcamp at Lodhi Gardens",
    location: "Lodhi Gardens, New Delhi",
    date: "Tomorrow",
    time: "6:30 PM - 7:30 PM",
    price: 300,
    organizer: "Rahul Kumar",
    participants: 18,
    maxParticipants: 30,
  }

  useEffect(() => {
    setMounted(true)

    // Check if coming from activity booking
    const urlParams = new URLSearchParams(window.location.search)
    const activityId = urlParams.get("activity")
    if (activityId) {
      setBookingMode(true)
      setSelectedActivity(sampleActivity)
    }
  }, [])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate Stripe payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setPaymentSuccess(true)

    // Send confirmation email via Resend API
    console.log("Sending confirmation email via Resend API...")
  }

  const getSelectedPlan = () => plans.find((plan) => plan.id === selectedPlan)
  const selectedPlanData = getSelectedPlan()
  const totalAmount = bookingMode ? selectedActivity?.price || 0 : selectedPlanData?.price[billingCycle] || 0

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="h-96 bg-white/5 rounded-lg animate-pulse backdrop-blur-sm border border-white/10" />
          </div>
        </main>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
              <p className="text-white/80 mb-6">
                {bookingMode
                  ? `You've successfully booked "${selectedActivity?.title}". Check your email for confirmation details.`
                  : `Welcome to ${selectedPlanData?.name}! Your subscription is now active.`}
              </p>

              {bookingMode && selectedActivity && (
                <GlassCard className="p-4 mb-6 text-left">
                  <h3 className="font-semibold text-white mb-2">Booking Details</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {selectedActivity.date} • {selectedActivity.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {selectedActivity.participants + 1}/{selectedActivity.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </GlassCard>
              )}

              <div className="flex space-x-4 justify-center">
                <AnimatedButton onClick={() => (window.location.href = bookingMode ? "/activities" : "/profile")}>
                  {bookingMode ? "View Activities" : "Go to Dashboard"}
                </AnimatedButton>
                <AnimatedButton variant="outline" onClick={() => (window.location.href = "/")}>
                  Back to Home
                </AnimatedButton>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {bookingMode ? "Complete Your " : "Choose Your "}
              <span className="gradient-text">{bookingMode ? "Booking" : "Plan"}</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {bookingMode
                ? "Secure payment powered by Stripe with multiple payment options"
                : "Unlock premium features with our flexible subscription plans"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Plan Selection or Activity Details */}
            <div>
              {bookingMode ? (
                // Activity Booking Details
                <GlassCard className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ArrowLeft className="w-5 h-5 text-white/60" />
                    <button onClick={() => window.history.back()} className="text-white/60 hover:text-white text-sm">
                      Back to Activities
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-6">Activity Booking</h2>

                  {selectedActivity && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{selectedActivity.title}</h3>
                        <div className="space-y-2 text-white/80">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedActivity.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{selectedActivity.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{selectedActivity.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {selectedActivity.participants}/{selectedActivity.maxParticipants} participants
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-white/80">Total Amount:</span>
                          <span className="text-2xl font-bold text-green-400">₹{selectedActivity.price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ) : (
                // Plan Selection
                <>
                  {/* Billing Toggle */}
                  <div className="flex justify-center mb-8">
                    <GlassCard className="p-2 flex">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                          billingCycle === "monthly"
                            ? "bg-green-500/20 text-green-400"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                          billingCycle === "yearly"
                            ? "bg-green-500/20 text-green-400"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Yearly
                      </button>
                    </GlassCard>
                  </div>

                  {/* Plan Cards */}
                  {plans.map((plan) => (
                    <GlassCard key={plan.id} className="p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                        {plan.popular && (
                          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Popular</div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Price:</span>
                        <span className="text-2xl font-bold text-green-400">₹{plan.price[billingCycle]}</span>
                      </div>
                      <ul className="space-y-2 text-white/80">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <AnimatedButton onClick={() => setSelectedPlan(plan.id)}>Choose Plan</AnimatedButton>
                      </div>
                    </GlassCard>
                  ))}
                </>
              )}
            </div>

            {/* Right Column - Payment Method Selection */}
            <div>
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{method.name}</h3>
                        <p className="text-white/80">{method.description}</p>
                        {method.processingFee && (
                          <p className="text-white/60 text-sm">Processing Fee: {method.processingFee}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`ml-auto px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? "bg-green-500/20 text-green-400"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Payment Form */}
              {selectedPaymentMethod === "card" && (
                <GlassCard className="p-6 mt-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Credit/Debit Card Details</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="text-white/80">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-full pr-2">
                        <label htmlFor="expiryDate" className="text-white/80">
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                        />
                      </div>
                      <div className="w-full pl-2">
                        <label htmlFor="cvv" className="text-white/80">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardName" className="text-white/80">
                        Cardholder Name
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                      />
                    </div>
                    <div className="mt-6">
                      <AnimatedButton onClick={handlePayment} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </AnimatedButton>
                    </div>
                  </form>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
