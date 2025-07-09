"use client"


export interface PropertyData {
  id: string
  locality: string
  lat: number
  lng: number
  rent: number
  propertyType: string
  bedrooms: number
  area: number
  furnished: string
  amenities: string[]
  source: string
  lastUpdated: string
}

export interface RentAnalytics {
  averageRent: number
  medianRent: number
  pricePerSqft: number
  rentTrend: number
  totalListings: number
  lastUpdated: string
}

export interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

// Mock data generator
const generateMockProperty = (id: string, bounds: Bounds): PropertyData => {
  const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
  const lng = bounds.west + Math.random() * (bounds.east - bounds.west)

  const localities = [
    "Cyber City",
    "DLF Phase 1",
    "DLF Phase 2",
    "Sector 14",
    "MG Road",
    "Koramangala",
    "Indiranagar",
    "Whitefield",
    "Electronic City",
    "HSR Layout",
    "Bandra West",
    "Andheri East",
    "Powai",
    "Lower Parel",
    "Worli",
  ]

  const propertyTypes = ["Apartment", "Villa", "Studio", "Penthouse"]
  const furnishedTypes = ["Fully Furnished", "Semi Furnished", "Unfurnished"]
  const amenitiesList = [
    "Parking",
    "Gym",
    "Swimming Pool",
    "Security",
    "Power Backup",
    "Elevator",
    "Garden",
    "Club House",
    "Children's Play Area",
    "Wi-Fi",
  ]

  const bedrooms = Math.floor(Math.random() * 4) + 1
  const area = 500 + Math.random() * 2000
  const baseRent = bedrooms * 8000 + area * 15
  const rent = Math.floor(baseRent + (Math.random() - 0.5) * baseRent * 0.3)

  return {
    id,
    locality: localities[Math.floor(Math.random() * localities.length)],
    lat,
    lng,
    rent,
    propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    bedrooms,
    area: Math.floor(area),
    furnished: furnishedTypes[Math.floor(Math.random() * furnishedTypes.length)],
    amenities: amenitiesList.slice(0, Math.floor(Math.random() * 5) + 3),
    source: ["99acres", "magicbricks", "housing"][Math.floor(Math.random() * 3)],
    lastUpdated: new Date().toISOString(),
  }
}


const MOCK_PROPERTY_DATA: PropertyData[] = [
  // Gurgaon Properties
  {
    id: "ggn_001",
    locality: "Cyber City",
    lat: 28.4595,
    lng: 77.0266,
    rent: 35000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 1200,
    furnished: "Semi Furnished",
    amenities: ["Parking", "Gym", "Security", "Wi-Fi", "Power Backup"],
    source: "99acres",
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "ggn_002",
    locality: "DLF Phase 2",
    lat: 28.4692,
    lng: 77.0347,
    rent: 42000,
    propertyType: "Apartment",
    bedrooms: 3,
    area: 1500,
    furnished: "Fully Furnished",
    amenities: ["Parking", "Swimming Pool", "Security", "Club House", "Garden", "Children's Play Area"],
    source: "magicbricks",
    lastUpdated: "2024-01-15T09:15:00Z",
  },
  {
    id: "ggn_003",
    locality: "Sector 14",
    lat: 28.4743,
    lng: 77.0513,
    rent: 28000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 1000,
    furnished: "Unfurnished",
    amenities: ["Parking", "Security", "Elevator", "Power Backup"],
    source: "housing",
    lastUpdated: "2024-01-15T11:45:00Z",
  },
  // Bangalore Properties
  {
    id: "blr_001",
    locality: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    rent: 32000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 1100,
    furnished: "Fully Furnished",
    amenities: ["Parking", "Gym", "Security", "Wi-Fi", "Power Backup"],
    source: "99acres",
    lastUpdated: "2024-01-15T08:20:00Z",
  },
  {
    id: "blr_002",
    locality: "Indiranagar",
    lat: 12.9719,
    lng: 77.6412,
    rent: 38000,
    propertyType: "Apartment",
    bedrooms: 3,
    area: 1400,
    furnished: "Semi Furnished",
    amenities: ["Parking", "Swimming Pool", "Security", "Wi-Fi", "Power Backup"],
    source: "magicbricks",
    lastUpdated: "2024-01-15T07:30:00Z",
  },
  {
    id: "blr_003",
    locality: "Whitefield",
    lat: 12.9698,
    lng: 77.7499,
    rent: 25000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 950,
    furnished: "Unfurnished",
    amenities: ["Parking", "Gym", "Security", "Wi-Fi", "Power Backup"],
    source: "housing",
    lastUpdated: "2024-01-15T12:00:00Z",
  },
  // Mumbai Properties
  {
    id: "mum_001",
    locality: "Bandra West",
    lat: 19.0596,
    lng: 72.8295,
    rent: 65000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 800,
    furnished: "Fully Furnished",
    amenities: ["Parking", "Swimming Pool", "Security", "Wi-Fi", "Power Backup"],
    source: "99acres",
    lastUpdated: "2024-01-15T09:45:00Z",
  },
  {
    id: "mum_002",
    locality: "Andheri West",
    lat: 19.1136,
    lng: 72.8697,
    rent: 55000,
    propertyType: "Apartment",
    bedrooms: 3,
    area: 1200,
    furnished: "Semi Furnished",
    amenities: ["Parking", "Swimming Pool", "Security", "Wi-Fi", "Power Backup"],
    source: "magicbricks",
    lastUpdated: "2024-01-15T10:15:00Z",
  },
  {
    id: "mum_003",
    locality: "Powai",
    lat: 19.1176,
    lng: 72.906,
    rent: 48000,
    propertyType: "Apartment",
    bedrooms: 2,
    area: 1000,
    furnished: "Fully Furnished",
    amenities: ["Parking", "Swimming Pool", "Security", "Wi-Fi", "Power Backup"],
    source: "housing",
    lastUpdated: "2024-01-15T11:30:00Z",
  },
]


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class PropertyDataAPI {
  private static instance: PropertyDataAPI
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): PropertyDataAPI {
    if (!PropertyDataAPI.instance) {
      PropertyDataAPI.instance = new PropertyDataAPI()
    }
    return PropertyDataAPI.instance
  }

  private getCacheKey(params: any): string {
    try {
      return JSON.stringify(params)
    } catch (error) {
      return String(params)
    }
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  async fetchPropertiesInBounds(bounds: Bounds): Promise<PropertyData[]> {
    try {
      const cacheKey = this.getCacheKey({ type: "bounds", ...bounds })
      const cached = this.cache.get(cacheKey)

      if (cached && this.isValidCache(cached.timestamp)) {
        return cached.data
      }

      // Simulate API call delay
      await delay(800 + Math.random() * 400)

      // Filter properties within bounds
      const properties = MOCK_PROPERTY_DATA.filter(
        (property) =>
          property.lat >= bounds.south &&
          property.lat <= bounds.north &&
          property.lng >= bounds.west &&
          property.lng <= bounds.east,
      )

      const liveProperties = properties.map((property) => ({
        ...property,
        rent: property.rent + Math.floor((Math.random() - 0.5) * property.rent * 0.1), // ±10% variation
        lastUpdated: new Date().toISOString(),
      }))

      this.cache.set(cacheKey, { data: liveProperties, timestamp: Date.now() })
      return liveProperties
    } catch (error) {
      console.error("Error fetching properties in bounds:", error)
      return []
    }
  }

  async fetchRentAnalytics(city: string): Promise<RentAnalytics> {
    const cacheKey = this.getCacheKey({ type: "analytics", city })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    await delay(600 + Math.random() * 300)

    const baseRent = city === "Mumbai" ? 45000 : city === "Bangalore" ? 35000 : 30000

    const analytics: RentAnalytics = {
      averageRent: Math.floor(baseRent + (Math.random() - 0.5) * baseRent * 0.2),
      medianRent: Math.floor(baseRent * 0.85 + (Math.random() - 0.5) * baseRent * 0.15),
      pricePerSqft: Math.floor(25 + Math.random() * 15),
      rentTrend: Math.floor((Math.random() - 0.5) * 20),
      totalListings: Math.floor(Math.random() * 500) + 200,
      lastUpdated: new Date().toISOString(),
    }

    this.cache.set(cacheKey, { data: analytics, timestamp: Date.now() })
    return analytics
  }

  async searchProperties(query: {
    city?: string
    locality?: string
    minRent?: number
    maxRent?: number
    bedrooms?: number
    propertyType?: string
    furnished?: string
  }): Promise<PropertyData[]> {
    const cacheKey = this.getCacheKey({ type: "search", ...query })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    await delay(700 + Math.random() * 400)

    let results = [...MOCK_PROPERTY_DATA]

    if (query.city) {
      results = results.filter((p) => p.city.toLowerCase().includes(query.city!.toLowerCase()))
    }

    if (query.locality) {
      results = results.filter((p) => p.locality.toLowerCase().includes(query.locality!.toLowerCase()))
    }

    if (query.minRent) {
      results = results.filter((p) => p.rent >= query.minRent!)
    }

    if (query.maxRent) {
      results = results.filter((p) => p.rent <= query.maxRent!)
    }

    if (query.bedrooms) {
      results = results.filter((p) => p.bedrooms === query.bedrooms)
    }

    if (query.propertyType) {
      results = results.filter((p) => p.propertyType === query.propertyType)
    }

    if (query.furnished) {
      results = results.filter((p) => p.furnished === query.furnished)
    }

    // Add randomization for live feel
    const liveResults = results.map((property) => ({
      ...property,
      rent: property.rent + Math.floor((Math.random() - 0.5) * property.rent * 0.05), // ±5% variation
      lastUpdated: new Date().toISOString(),
    }))

    this.cache.set(cacheKey, { data: liveResults, timestamp: Date.now() })
    return liveResults
  }

  async fetch99AcresData(bounds: any): Promise<PropertyData[]> {
    await delay(1000)
    return MOCK_PROPERTY_DATA.filter((p) => p.source === "99acres").slice(0, 3)
  }

  async fetchMagicBricksData(bounds: any): Promise<PropertyData[]> {
    await delay(1200)
    return MOCK_PROPERTY_DATA.filter((p) => p.source === "magicbricks").slice(0, 3)
  }

  async fetchHousingData(bounds: any): Promise<PropertyData[]> {
    await delay(900)
    return MOCK_PROPERTY_DATA.filter((p) => p.source === "housing").slice(0, 3)
  }

  async fetchAllSources(bounds: Bounds): Promise<{
    combined: PropertyData[]
    sources: {
      "99acres": PropertyData[]
      magicbricks: PropertyData[]
      housing: PropertyData[]
    }
  }> {
    const [acres99, magicbricks, housing] = await Promise.all([
      this.fetch99AcresData(bounds),
      this.fetchMagicBricksData(bounds),
      this.fetchHousingData(bounds),
    ])

    return {
      combined: [...acres99, ...magicbricks, ...housing],
      sources: {
        "99acres": acres99,
        magicbricks: magicbricks,
        housing: housing,
      },
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}


export const propertyAPI = PropertyDataAPI.getInstance()
