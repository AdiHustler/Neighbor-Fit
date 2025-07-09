import { Header } from "@/components/layout/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentationLoading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-slate-800" />
            <Skeleton className="h-6 w-[600px] mx-auto bg-slate-800" />
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-full bg-slate-800" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <Skeleton className="h-8 w-64 mb-4 bg-slate-800" />
              <Skeleton className="h-4 w-full mb-2 bg-slate-800" />
              <Skeleton className="h-4 w-3/4 mb-4 bg-slate-800" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 bg-slate-800" />
                <Skeleton className="h-32 bg-slate-800" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <Skeleton className="h-8 w-48 mb-4 bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-5/6 bg-slate-800" />
                <Skeleton className="h-4 w-4/5 bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
