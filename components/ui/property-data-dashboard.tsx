"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { propertyAPI, type PropertyData, type RentAnalytics } from "@/lib/property-apis"
import {
  Search,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  RefreshCw,
  Download,
  Settings,
  Heart,
  Share2,
  Eye,
} from "lucide-react"

interface PropertyDataDashboardProps {
  onPropertySelect?: (property: PropertyData) => void
}

export function PropertyDataDashboard({ onPropertySelect }: PropertyDataDashboardProps) {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([])
  const [analytics, setAnalytics] = useState<RentAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    city: "",
    minRent: 0,
    maxRent: 100000,
    bedrooms: 0,
    propertyType: "",
    furnished: "",
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, searchQuery, filters])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // Load properties from major cities with error handling
      const propertyPromises = [
        propertyAPI.searchProperties({ city: "Gurgaon" }).catch(() => []),
        propertyAPI.searchProperties({ city: "Bangalore" }).catch(() => []),
        propertyAPI.searchProperties({ city: "Mumbai" }).catch(() => []),
      ]

      const [gurgaonProps, bangaloreProps, mumbaiProps] = await Promise.all(propertyPromises)

      const allProperties = [...gurgaonProps, ...bangaloreProps, ...mumbaiProps]
      setProperties(allProperties)

      // Load analytics for Gurgaon as default
      try {
        const gurgaonAnalytics = await propertyAPI.fetchRentAnalytics("Gurgaon")
        setAnalytics(gurgaonAnalytics)
      } catch (analyticsError) {
        console.warn("Failed to load analytics:", analyticsError)
      }
    } catch (error) {
      console.error("Failed to load property data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter((property) => property.city === filters.city)
    }

    // Rent range filter
    filtered = filtered.filter((property) => property.rent >= filters.minRent && property.rent <= filters.maxRent)

    // Bedrooms filter
    if (filters.bedrooms > 0) {
      filtered = filtered.filter((property) => property.bedrooms === filters.bedrooms)
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter((property) => property.propertyType === filters.propertyType)
    }

    // Furnished filter
    if (filters.furnished) {
      filtered = filtered.filter((property) => property.furnished === filters.furnished)
    }

    setFilteredProperties(filtered)
  }

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const searchResults = await propertyAPI.searchProperties({
        locality: searchQuery,
        ...filters,
      })
      setProperties(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityChange = async (city: string) => {
    setFilters((prev) => ({ ...prev, city }))

    if (city) {
      try {
        const cityAnalytics = await propertyAPI.fetchRentAnalytics(city)
        setAnalytics(cityAnalytics)
      } catch (error) {
        console.error("Failed to load city analytics:", error)
        // Don't break the UI, just log the error
      }
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return "🏢"
      case "house":
        return "🏠"
      case "pg":
        return "🏨"
      case "studio":
        return "🏬"
      default:
        return "🏘️"
    }
  }

  const getFurnishedColor = (furnished: string) => {
    switch (furnished) {
      case "furnished":
        return "text-green-400"
      case "semi-furnished":
        return "text-yellow-400"
      case "unfurnished":
        return "text-gray-400"
      default:
        return "text-white"
    }
  }

  const getPropertyImage = (property: PropertyData) => {
    // Map localities to actual image files
    const imageMap: { [key: string]: string } = {
      "Cyber City": "/images/cyber-city.png",
      "DLF Phase 2": "/images/dlf-phase2.png",
      "Sector 14": "/images/sector-14.png",
      "Koramangala 5th Block": "/images/koramangala.png",
      Indiranagar: "/images/indiranagar.png",
      Whitefield: "/images/whitefield.png",
      "Bandra West": "/images/bandra-west.png",
      "Andheri West": "/images/andheri-west.png",
      Powai: "/images/powai.png",
    }

    return imageMap[property.locality] || "/images/cyber-city.png"
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by locality or city..."
                className="glass-input w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
            <AnimatedButton variant="glass" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </AnimatedButton>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-6 gap-4">
            <select className="glass-input" value={filters.city} onChange={(e) => handleCityChange(e.target.value)}>
              <option value="">All Cities</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
            </select>

            <select
              className="glass-input"
              value={filters.bedrooms}
              onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: Number.parseInt(e.target.value) }))}
            >
              <option value={0}>Any BHK</option>
              <option value={1}>1 BHK</option>
              <option value={2}>2 BHK</option>
              <option value={3}>3 BHK</option>
              <option value={4}>4+ BHK</option>
            </select>

            <select
              className="glass-input"
              value={filters.propertyType}
              onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
            >
              <option value="">Any Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="pg">PG</option>
              <option value="studio">Studio</option>
            </select>

            <select
              className="glass-input"
              value={filters.furnished}
              onChange={(e) => setFilters((prev) => ({ ...prev, furnished: e.target.value }))}
            >
              <option value="">Any Furnished</option>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>

            <input
              type="number"
              placeholder="Min Rent"
              className="glass-input"
              value={filters.minRent || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, minRent: Number.parseInt(e.target.value) || 0 }))}
            />

            <input
              type="number"
              placeholder="Max Rent"
              className="glass-input"
              value={filters.maxRent === 100000 ? "" : filters.maxRent}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxRent: Number.parseInt(e.target.value) || 100000 }))}
            />
          </div>
        </div>
      </GlassCard>

      {/* Analytics Summary */}
      {analytics && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Market Analytics</h3>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">₹{analytics.averageRent.toLocaleString("en-IN")}</div>
              <div className="text-sm text-white/70">Average Rent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">₹{analytics.medianRent.toLocaleString("en-IN")}</div>
              <div className="text-sm text-white/70">Median Rent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                ₹{analytics.pricePerSqft.toLocaleString("en-IN")}
              </div>
              <div className="text-sm text-white/70">Price/Sq Ft</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold flex items-center justify-center ${
                  analytics.rentTrend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {analytics.rentTrend >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {Math.abs(analytics.rentTrend)}%
              </div>
              <div className="text-sm text-white/70">Market Trend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{analytics.totalListings}</div>
              <div className="text-sm text-white/70">Active Listings</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Properties List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold gradient-text">Live Property Listings</h3>
          <div className="flex space-x-2">
            <AnimatedButton variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </AnimatedButton>
            <AnimatedButton variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </AnimatedButton>
          </div>
        </div>

        <div className="space-y-6">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              {isLoading ? "Loading properties..." : "No properties found matching your criteria"}
            </div>
          ) : (
            filteredProperties.map((property) => (
              <GlassCard
                key={property.id}
                className="p-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => onPropertySelect?.(property)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-80 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={getPropertyImage(property) || "/placeholder.svg"}
                      alt={`${property.locality} property`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300&text=Property+Image"
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {property.source}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-lg font-bold">
                        ₹{property.rent.toLocaleString("en-IN")}/month
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getPropertyTypeIcon(property.propertyType)}</span>
                          <div>
                            <h4 className="text-xl font-bold text-white">{property.locality}</h4>
                            <p className="text-white/70 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {property.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">
                          ₹{Math.round(property.rent / property.area)}
                        </div>
                        <div className="text-xs text-white/60">per sq ft</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white">{property.bedrooms}</div>
                        <div className="text-xs text-white/70">Bedrooms</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white">{property.area}</div>
                        <div className="text-xs text-white/70">Sq Ft</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className={`text-lg font-bold capitalize ${getFurnishedColor(property.furnished)}`}>
                          {property.furnished.split("-")[0]}
                        </div>
                        <div className="text-xs text-white/70">Furnished</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-white capitalize">{property.propertyType}</div>
                        <div className="text-xs text-white/70">Type</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {property.amenities.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-white/80 mb-2">Amenities:</h5>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.slice(0, 6).map((amenity, index) => (
                            <span key={index} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 6 && (
                            <span className="text-xs text-white/60 px-3 py-1">
                              +{property.amenities.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(property.lastUpdated).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 50) + 10} views</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <AnimatedButton variant="outline" size="sm">
                          View Details
                        </AnimatedButton>
                        <AnimatedButton variant="glass" size="sm">
                          Contact Owner
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {filteredProperties.length > 0 && (
          <div className="mt-8 text-center">
            <AnimatedButton variant="outline">Load More Properties</AnimatedButton>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
