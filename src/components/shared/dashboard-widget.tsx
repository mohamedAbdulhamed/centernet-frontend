import type { PropsWithChildren, ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardWidgetProps extends PropsWithChildren {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  contentClassName?: string
}

export function DashboardWidget({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: DashboardWidgetProps) {
  return (
    <Card className={cn("surface-card shadow-none", className)}>
      <CardHeader className="space-y-3 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold tracking-[-0.03em] text-app-text-primary">
              {title}
            </CardTitle>
            {description ? (
              <CardDescription className="text-sm leading-6 text-app-text-secondary">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn("px-6 pb-6 pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
