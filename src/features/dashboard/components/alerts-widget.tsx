import { IconAlertTriangle, IconClock, IconInfoCircle } from "@tabler/icons-react"

import { DashboardWidget } from "@/components/shared/dashboard-widget"
import { Badge } from "@/components/ui/badge"

interface AlertItem {
  title: string
  description: string
  severity: "warning" | "error" | "info"
}

interface AlertsWidgetProps {
  items: AlertItem[]
}

const alertIcons = {
  warning: IconClock,
  error: IconAlertTriangle,
  info: IconInfoCircle,
} as const

const severityLabels = {
  warning: "تنبيه",
  error: "عاجل",
  info: "معلومة",
} as const

const badgeVariants = {
  warning: "warning",
  error: "error",
  info: "info",
} as const

export function AlertsWidget({ items }: AlertsWidgetProps) {
  return (
    <DashboardWidget
      title="التنبيهات"
      description="ملخص تشغيلي لما قد يحتاج إلى تدخل سريع من فريق المتابعة."
    >
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = alertIcons[item.severity]

          return (
            <div
              key={item.title}
              className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-[11px] bg-white text-app-text-primary">
                  <Icon className="size-4" stroke={1.8} />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-app-text-primary">{item.title}</p>
                    <Badge variant={badgeVariants[item.severity]}>{severityLabels[item.severity]}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-app-text-secondary">{item.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardWidget>
  )
}
