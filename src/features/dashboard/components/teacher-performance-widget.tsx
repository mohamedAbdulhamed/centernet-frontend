import { DashboardWidget } from "@/components/shared/dashboard-widget"

interface TeacherPerformanceItem {
  name: string
  subject: string
  completionRate: number
}

interface TeacherPerformanceWidgetProps {
  title?: string
  description?: string
  items: TeacherPerformanceItem[]
}

export function TeacherPerformanceWidget({
  title = "أداء المدرسين",
  description = "صفوف أساسية لمتابعة التغطية التعليمية ومؤشرات التقدم.",
  items,
}: TeacherPerformanceWidgetProps) {
  return (
    <DashboardWidget title={title} description={description}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-app-text-primary">{item.name}</p>
                <p className="text-xs text-app-text-muted">{item.subject}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-app-accent">
                {item.completionRate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-app-surface-soft">
              <div
                className="h-full rounded-full bg-app-accent"
                style={{ width: `${item.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}
