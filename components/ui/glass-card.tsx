"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border border-white/10 bg-white/10 backdrop-blur-md shadow-lg", className)}
      {...props}
    />
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
