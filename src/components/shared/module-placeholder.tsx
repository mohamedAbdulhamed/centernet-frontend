import type { TablerIcon } from "@tabler/icons-react"
import { IconCheck } from "@tabler/icons-react"

import { EmptyState } from "@/components/feedback/empty-state"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ModulePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  icon: TablerIcon
  highlights: string[]
  milestones: Array<{
    label: string
    value: string
  }>
}

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  highlights,
  milestones,
}: ModulePlaceholderProps) {
  return (
    <>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_320px]">
        <EmptyState
          icon={icon}
          title={`بنية ${title} الأساسية جاهزة`}
          description="المسارات والتخطيطات والثيم وبنية الجداول ونقاط الربط مع الحالة والواجهة البرمجية أصبحت جاهزة. سيتم توصيل منطق العمل في هذه الطبقة لاحقاً."
        />
        <Card className="surface-card p-5 shadow-none">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="section-eyebrow">جاهز الآن</p>
              <div className="flex flex-wrap gap-2">
                {highlights.map((highlight) => (
                  <Badge
                    key={highlight}
                    variant="outline"
                    className="rounded-md border-border bg-app-surface-soft px-2.5 py-1 text-app-text-secondary"
                  >
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.label}
                  className="flex items-center justify-between rounded-[12px] bg-app-surface-soft/65 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm text-app-text-secondary">
                    <IconCheck className="size-4 text-app-success" stroke={1.8} />
                    <span>{milestone.label}</span>
                  </div>
                  <span className="font-mono text-xs tracking-[0.18em] text-app-text-muted">
                    {milestone.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
