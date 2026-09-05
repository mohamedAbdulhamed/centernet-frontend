import type { TablerIcon } from "@tabler/icons-react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricTone = "primary" | "accent" | "surface" | "success"
type TrendTone = "positive" | "negative" | "neutral"

interface MetricCardProps {
  label: string
  value: string
  description: string
  icon: TablerIcon
  tone?: MetricTone
  trend?: {
    label: string
    tone: TrendTone
  }
}

const toneClasses: Record<
  MetricTone,
  {
    root: string
    icon: string
    label: string
    description: string
  }
> = {
  primary: {
    root: "border-transparent bg-primary text-primary-foreground",
    icon: "bg-white/10 text-white/75",
    label: "text-white/45",
    description: "text-white/65",
  },
  accent: {
    root: "border-transparent bg-app-accent text-white",
    icon: "bg-white/15 text-white",
    label: "text-white/50",
    description: "text-white/70",
  },
  success: {
    root: "border-transparent bg-app-success text-white",
    icon: "bg-white/10 text-white/75",
    label: "text-white/50",
    description: "text-white/70",
  },
  surface: {
    root: "bg-card text-app-text-primary",
    icon: "bg-app-accent/10 text-app-accent",
    label: "text-app-text-muted",
    description: "text-app-text-secondary",
  },
}

const trendClasses: Record<TrendTone, string> = {
  positive: "text-emerald-200",
  negative: "text-rose-300",
  neutral: "text-app-text-secondary",
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "surface",
  trend,
}: MetricCardProps) {
  const classes = toneClasses[tone]

  return (
    <Card className={cn("rounded-[var(--radius-lg-token)] p-5 shadow-none", classes.root)}>
      <div className="flex h-full flex-col gap-4">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-[11px]",
            classes.icon
          )}
        >
          <Icon className="size-5" stroke={1.8} />
        </div>
        <div className="space-y-2">
          <p className={cn("font-mono text-[0.65rem] uppercase tracking-[0.26em]", classes.label)}>
            {label}
          </p>
          <div className="metric-value leading-none">{value}</div>
          <p className={cn("text-sm", classes.description)}>{description}</p>
        </div>
        {trend ? (
          <div
            className={cn(
              "mt-auto flex items-center gap-2 text-sm font-medium",
              tone === "surface" ? trendClasses[trend.tone] : "text-white/80"
            )}
          >
            {trend.tone === "negative" ? (
              <IconTrendingDown className="size-4" stroke={1.8} />
            ) : (
              <IconTrendingUp className="size-4" stroke={1.8} />
            )}
            <span>{trend.label}</span>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
