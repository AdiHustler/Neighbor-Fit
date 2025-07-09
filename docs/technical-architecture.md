# NeighborFit: Technical Architecture Documentation

## System Overview

NeighborFit is a full-stack web application built with Next.js 15, integrating multiple APIs to solve neighborhood fitness community matching. The system uses a microservices-inspired architecture with clear separation of concerns.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks with local state
- **Maps**: Mapbox GL JS for interactive mapping

### Backend & APIs
- **Authentication**: Clerk Auth for secure user management
- **Payments**: Stripe API for transaction processing
- **Email**: Resend API for transactional emails
- **Location Services**: Mapbox API for geocoding and mapping
- **Data Storage**: Mock API with caching layer

### Infrastructure
- **Deployment**: Vercel platform
- **Environment**: Serverless functions
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in performance analytics

## Architecture Patterns

### 1. API-First Design
\`\`\`typescript
// Centralized API management
export class PropertyDataAPI {
  private static instance: PropertyDataAPI
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  
  static getInstance(): PropertyDataAPI {
    if (!PropertyDataAPI.instance) {
      PropertyDataAPI.instance = new PropertyDataAPI()
    }
    return PropertyDataAPI.instance
  }
}
\`\`\`

### 2. Component-Based Architecture
\`\`\`
components/
├── ui/                 # Reusable UI components
├── sections/           # Page sections
├── layout/            # Layout components
└── forms/             # Form components
\`\`\`

### 3. Data Flow Pattern
\`\`\`
User Interaction → Component State → API Call → Cache Check → External API → Response Processing → UI Update
\`\`\`

## Core Algorithms

### Distance Calculation Algorithm
\`\`\`typescript
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
           Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
\`\`\`

### Activity Matching Algorithm
\`\`\`typescript
const getMatchScore = (activity: FitnessActivity, userPrefs: UserPreferences) => {
  let score = 0
  
  // Distance scoring (0-40 points)
  const distance = calculateDistance(userLat, userLng, activity.coordinates[1], activity.coordinates[0])
  score += Math.max(0, 40 - (distance * 8))
  
  // Difficulty match (0-25 points)
  if (activity.difficulty === userPrefs.difficulty) score += 25
  
  // Category preference (0-20 points)
  if (userPrefs.categories.includes(activity.category)) score += 20
  
  // Time compatibility (0-15 points)
  if (isTimeCompatible(activity.time, userPrefs.schedule)) score += 15
  
  return score
}
\`\`\`

## Data Models

### Core Entities
\`\`\`typescript
interface FitnessActivity {
  id: string
  title: string
  type: string
  location: string
  coordinates: [number, number] // [lng, lat]
  time: string
  date: string
  participants: number
  maxParticipants: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  organizer: Organizer
  price: number
  category: "outdoor" | "indoor" | "water" | "group"
  isJoined?: boolean
  isHosted?: boolean
}

interface UserPreferences {
  difficulty: string
  categories: string[]
  schedule: TimeSlot[]
  maxDistance: number
  priceRange: [number, number]
}
\`\`\`

## API Integration Strategy

### 1. Mapbox Integration
\`\`\`typescript
// Dynamic loading with fallback
const loadMapbox = async () => {
  const mapboxModule = await import("mapbox-gl")
  const mapboxgl = mapboxModule.default
  
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ??
    "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMmoycXAybm40eXM5eWgifQ.2QHNc5H_KQiQdb3gNZc8qA"
}
\`\`\`

### 2. Stripe Payment Integration
\`\`\`typescript
// Secure payment processing
const processPayment = async (activityId: string, amount: number) => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, amount })
  })
  
  const { clientSecret } = await response.json()
  return stripe.confirmCardPayment(clientSecret)
}
\`\`\`

### 3. Caching Strategy
\`\`\`typescript
class APICache {
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (entry && Date.now() - entry.timestamp < this.CACHE_DURATION) {
      return entry.data
    }
    this.cache.delete(key)
    return null
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}
\`\`\`

## Performance Optimizations

### 1. Code Splitting
\`\`\`typescript
// Dynamic imports for heavy components
const MapboxActivityMap = dynamic(() => import('./mapbox-activity-map'), {
  loading: () => <MapLoadingSkeleton />,
  ssr: false
})
\`\`\`

### 2. Image Optimization
\`\`\`typescript
// Next.js Image component with optimization
<Image
  src={activity.image || "/placeholder.svg"}
  alt={activity.title}
  width={300}
  height={200}
  className="w-full h-40 object-cover rounded-lg"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

### 3. API Response Optimization
\`\`\`typescript
// Efficient data fetching with bounds
const fetchActivitiesInBounds = async (bounds: Bounds) => {
  const activities = await api.fetchPropertiesInBounds(bounds)
  return activities.map(activity => ({
    ...activity,
    // Only include essential fields for list view
    description: activity.description.substring(0, 100) + '...'
  }))
}
\`\`\`

## Security Considerations

### 1. Environment Variables
\`\`\`bash
# Required environment variables
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
RESEND_API_KEY=re_xxx
\`\`\`

### 2. API Rate Limiting
\`\`\`typescript
const rateLimiter = new Map<string, number[]>()

const checkRateLimit = (ip: string, limit: number = 100) => {
  const now = Date.now()
  const requests = rateLimiter.get(ip) || []
  const recentRequests = requests.filter(time => now - time < 60000) // 1 minute
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded')
  }
  
  rateLimiter.set(ip, [...recentRequests, now])
}
\`\`\`

### 3. Input Validation
\`\`\`typescript
const validateActivityData = (data: any): FitnessActivity => {
  const schema = z.object({
    title: z.string().min(1).max(100),
    coordinates: z.tuple([z.number(), z.number()]),
    price: z.number().min(0).max(10000),
    // ... other validations
  })
  
  return schema.parse(data)
}
\`\`\`

## Monitoring and Analytics

### 1. Performance Metrics
\`\`\`typescript
// Track API response times
const trackAPIPerformance = (endpoint: string, startTime: number) => {
  const duration = Date.now() - startTime
  console.log(`API ${endpoint}: ${duration}ms`)
  
  // In production, send to analytics service
  analytics.track('api_performance', {
    endpoint,
    duration,
    timestamp: new Date().toISOString()
  })
}
\`\`\`

### 2. Error Tracking
\`\`\`typescript
const handleError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error)
  
  // In production, send to error tracking service
  errorTracker.captureException(error, {
    tags: { context },
    extra: { timestamp: new Date().toISOString() }
  })
}
\`\`\`

## Deployment Architecture

### Vercel Configuration
\`\`\`json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
\`\`\`

### Environment Setup
\`\`\`bash
# Development
npm run dev

# Production build
npm run build
npm start

# Deployment
vercel --prod
\`\`\`

This technical architecture provides a solid foundation for the NeighborFit application, with clear patterns for scalability, maintainability, and performance optimization.
