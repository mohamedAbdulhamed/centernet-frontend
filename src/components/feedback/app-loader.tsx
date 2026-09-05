import { BrandMark } from "@/components/layout/brand-mark"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"

interface AppLoaderProps {
  label: string
}
// TODO: make it something related to education
export function AppLoader({ label }: AppLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg-main p-4 md:p-6">
      <div className="surface-shell w-full max-w-5xl space-y-8 p-6 md:p-8">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-2xl text-sm leading-6 text-app-text-secondary">{label}</p>
        </div>
        <LoadingSkeleton variant="page" />
      </div>
    </div>
  )
}
