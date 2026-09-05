import type { ReactNode } from "react"
import type { TablerIcon } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: TablerIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[var(--radius-lg-token)] bg-app-surface-soft/70 p-6 text-right",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-[14px] bg-white text-app-accent">
        <Icon className="size-6" stroke={1.8} />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-semibold tracking-[-0.03em] text-app-text-primary">
          {title}
        </h3>
        <p className="max-w-xl text-sm leading-6 text-app-text-secondary">
          {description}
        </p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
