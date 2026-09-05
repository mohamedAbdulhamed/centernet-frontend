import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  variant?: "page" | "table" | "card"
}

export function LoadingSkeleton({ variant = "card" }: LoadingSkeletonProps) {
  if (variant === "table") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-40 rounded-full" />
        <div className="space-y-2 rounded-[var(--radius-lg-token)] border border-border bg-card p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-[12px]" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "page") {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-full" />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="surface-card p-5 shadow-none">
              <div className="space-y-4">
                <Skeleton className="h-10 w-10 rounded-[11px]" />
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="surface-card p-5 shadow-none">
      <div className="space-y-4">
        <Skeleton className="h-10 w-10 rounded-[11px]" />
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
      </div>
    </Card>
  )
}
