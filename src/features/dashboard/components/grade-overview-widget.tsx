import { DashboardWidget } from "@/components/shared/dashboard-widget"
import { Badge } from "@/components/ui/badge"

interface GradeOverviewItem {
  subject: string
  score: string
  status: "success" | "info" | "warning"
}

interface GradeOverviewWidgetProps {
  title?: string
  description?: string
  items: GradeOverviewItem[]
}

const statusLabels = {
  success: "ممتاز",
  info: "مستقر",
  warning: "يحتاج متابعة",
} as const

export function GradeOverviewWidget({
  title = "ملخص الدرجات",
  description = "بطاقات درجات مختصرة وسهلة القراءة.",
  items,
}: GradeOverviewWidgetProps) {
  return (
    <DashboardWidget title={title} description={description}>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.subject}
            className="flex items-center justify-between gap-3 rounded-[14px] border border-app-divider bg-app-surface-soft/60 px-4 py-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-app-text-primary">{item.subject}</p>
              <p className="text-xs text-app-text-muted">آخر مستوى تقريري</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={item.status}>{statusLabels[item.status]}</Badge>
              <span className="font-mono text-sm font-semibold text-app-text-primary">
                {item.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}
