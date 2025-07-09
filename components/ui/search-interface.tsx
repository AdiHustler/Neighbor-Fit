"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"

interface SearchInterfaceProps {
  onSearch: (query: string) => void
  placeholder?: string
  showFilters?: boolean
  onFiltersChange?: (filters: string[]) => void
}

export function SearchInterface({
  onSearch,
  placeholder = "Search...",
  showFilters = false,
  onFiltersChange,
}: SearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filterOptions = [
    "Beginner Friendly",
    "Outdoor Activities",
    "Indoor Activities",
    "Morning Sessions",
    "Evening Sessions",
    "Weekend Only",
    "High Intensity",
    "Low Impact",
    "Group Activities",
    "One-on-One",
  ]

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterToggle = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter]

    setSelectedFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    setSelectedFilters([])
    onFiltersChange?.([])
  }

  return (
    <div className="space-y-4">
      <GlassCard className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {showFilters && (
            <AnimatedButton
              variant={showFilterPanel ? "glass" : "outline"}
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {selectedFilters.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {selectedFilters.length}
                </span>
              )}
            </AnimatedButton>
          )}
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedFilters.map((filter) => (
              <div
                key={filter}
                className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm"
              >
                <span>{filter}</span>
                <button onClick={() => handleFilterToggle(filter)} className="hover:text-green-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={clearFilters} className="text-white/60 hover:text-white text-sm underline">
              Clear all
            </button>
          </div>
        )}
      </GlassCard>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <GlassCard className="p-4">
          <h3 className="text-white font-semibold mb-4">Filter Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterToggle(filter)}
                className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedFilters.includes(filter)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

export default SearchInterface
