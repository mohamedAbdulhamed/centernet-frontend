import { IconBuildingCommunity } from "@tabler/icons-react"

import { APP_CONFIG } from "@/constants/app"
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  compact?: boolean
  inverted?: boolean
  className?: string
  subLabel?: string
}

export function BrandMark({
  compact = false,
  inverted = false,
  className,
  subLabel,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-[11px] bg-app-accent text-white",
          inverted ? "ring-1 ring-white/10" : "shadow-none"
        )}
      >
        <IconBuildingCommunity className="size-5" stroke={1.9} />
      </div>
      {!compact ? (
        <div className="group-data-[collapsible=icon]:hidden">
          <div
            className={cn(
              "text-sm font-semibold tracking-[-0.03em]",
              inverted ? "text-white" : "text-app-text-primary"
            )}
          >
            {APP_CONFIG.name}
          </div>
          <div
            className={cn(
              "font-mono text-[0.6rem] uppercase tracking-[0.28em]",
              inverted ? "text-white/35" : "text-app-text-muted"
            )}
          >
            {subLabel || APP_CONFIG.tagLine}
          </div>
        </div>
      ) : null}
    </div>
  )
}
