"use client"

import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero"
import { ProblemAnalysisSection } from "@/components/sections/problem-analysis"
import { DataShowcaseSection } from "@/components/sections/data-showcase"
import { QuickStartSection } from "@/components/sections/quick-start"
import { PricingSection } from "@/components/ui/pricing-section"
import { FloatingParticles } from "@/components/ui/floating-particles"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <FloatingParticles />
      <Header />
      <main>
        <HeroSection />
        <ProblemAnalysisSection />
        <DataShowcaseSection />
        <QuickStartSection />
        <PricingSection />
      </main>
    </div>
  )
}
