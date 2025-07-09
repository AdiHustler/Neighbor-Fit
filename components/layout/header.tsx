"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Activity, Users, BarChart3, User, FileText } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/", icon: Activity },
    { name: "Activities", href: "/activities", icon: Users },
    { name: "Live Data", href: "/live-data", icon: BarChart3 },
    { name: "Documentation", href: "/documentation", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NeighborFit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="nav-compact flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-item-compact flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive(item.href)
                        ? "bg-blue-900 text-blue-400"
                        : "text-slate-300 hover:text-blue-400 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/profile">
              <AnimatedButton
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Sign In
              </AnimatedButton>
            </Link>
            <Link href="/profile">
              <AnimatedButton variant="glass" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Join Community
              </AnimatedButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-blue-400 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-900 text-blue-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-blue-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <Link href="/profile">
                <AnimatedButton variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Sign In
                </AnimatedButton>
              </Link>
              <Link href="/profile">
                <AnimatedButton variant="glass" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Join Community
                </AnimatedButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
