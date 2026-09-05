import { DashboardWidget } from "@/components/shared/dashboard-widget"

interface AttendanceOverviewItem {
  label: string
  value: string
  progress: number
  tone: "primary" | "accent" | "success"
}

interface AttendanceOverviewWidgetProps {
  title?: string
  description?: string
  items: AttendanceOverviewItem[]
}

const progressClasses = {
  primary: "bg-app-primary-dark",
  accent: "bg-app-accent",
  success: "bg-app-success",
} as const

export function AttendanceOverviewWidget({
  title = "ملخص الحضور",
  description = "بطاقات قابلة لإعادة الاستخدام لمؤشرات الحضور واتجاهاته.",
  items,
}: AttendanceOverviewWidgetProps) {
  return (
    <DashboardWidget title={title} description={description}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-app-text-secondary">{item.label}</div>
              <div className="font-mono text-sm font-semibold text-app-text-primary">
                {item.value}
              </div>
            </div>
            <div className="h-2 rounded-full bg-app-surface-soft">
              <div
                className={`h-full rounded-full ${progressClasses[item.tone]}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}
