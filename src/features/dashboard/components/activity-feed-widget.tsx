import { DashboardWidget } from "@/components/shared/dashboard-widget"

interface ActivityFeedItem {
  title: string
  description: string
  timestamp: string
  tone: "primary" | "accent" | "success"
}

interface ActivityFeedWidgetProps {
  title?: string
  description?: string
  items: ActivityFeedItem[]
}

const toneClasses = {
  primary: "bg-app-primary-dark",
  accent: "bg-app-accent",
  success: "bg-app-success",
} as const

export function ActivityFeedWidget({
  title = "",
  description = "",
  items,
}: ActivityFeedWidgetProps) {
  return (
    <DashboardWidget title={title} description={description}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.title}-${item.timestamp}`} className="flex gap-3 border-b border-app-divider/80 pb-4 last:border-b-0 last:pb-0">
            <div className={`mt-2 size-2 rounded-full ${toneClasses[item.tone]}`} />
            <div className="space-y-1">
              <p className="text-sm font-medium text-app-text-primary">{item.title}</p>
              <p className="text-sm leading-6 text-app-text-secondary">{item.description}</p>
              <p className="font-mono text-[0.65rem] tracking-[0.18em] text-app-text-soft">
                {item.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}
