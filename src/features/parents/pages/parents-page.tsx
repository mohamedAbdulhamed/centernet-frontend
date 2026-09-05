import { useQuery } from "@tanstack/react-query"
import { IconMessageCircle, IconPhone, IconUserHeart, IconUsers } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { DashboardWidget } from "@/components/shared/dashboard-widget"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { mockParentMessageService, mockParentService } from "@/mocks"
import type { ParentListItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const columns: AppTableColumn<ParentListItem>[] = [
  { id: "parent", header: "ولي الأمر", cell: (row) => row.parentName },
  { id: "relation", header: "الصفة", cell: (row) => row.relation },
  { id: "phone", header: "الهاتف", cell: (row) => row.phone },
  { id: "student", header: "الطالب", cell: (row) => row.studentName },
  { id: "year", header: "الصف", cell: (row) => row.academicYear },
  { id: "attendance", header: "الحضور", cell: (row) => <span className="font-mono">{row.attendanceRate}%</span> },
  {
    id: "grade",
    header: "المتوسط",
    cell: (row) => (
      <Badge variant={row.averageGrade >= 85 ? "success" : row.averageGrade >= 70 ? "info" : "warning"}>
        {row.averageGrade}%
      </Badge>
    ),
  },
]

export function ParentsPage() {
  const { data: parentsData, isPending: parentsPending } = useQuery({
    queryKey: queryKeys.parents.list,
    queryFn: () => mockParentService.getParents(),
  })
  const { data: messagesData, isPending: messagesPending } = useQuery({
    queryKey: queryKeys.parentMessages.list,
    queryFn: () => mockParentMessageService.getParentMessages(),
  })

  if (parentsPending || messagesPending) {
    return <LoadingSkeleton variant="page" />
  }

  const parents = parentsData ?? []
  const messages = messagesData ?? []

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / أولياء الأمور"
        title="أولياء الأمور"
        description="عرض السجلات المرتبطة بأولياء الأمور وآخر الرسائل والمتابعة المرتبطة بكل طالب."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="عدد أولياء الأمور"
          value={`${parents.length}`}
          description="سجلات أولياء الأمور المرتبطة بالطلاب الحاليين."
          icon={IconUsers}
          tone="primary"
        />
        <MetricCard
          label="رسائل حديثة"
          value={`${messages.length}`}
          description="عدد الرسائل المحفوظة ضمن طبقة العرض الحالية."
          icon={IconMessageCircle}
          tone="accent"
        />
        <MetricCard
          label="قنوات تواصل"
          value={`${parents.filter((parent) => parent.phone).length}`}
          description="سجلات هاتفية جاهزة للمتابعة اليومية."
          icon={IconPhone}
          tone="surface"
        />
        <MetricCard
          label="متابعة نشطة"
          value={`${messages.filter((message) => message.category !== "appreciation").length}`}
          description="رسائل مرتبطة بالغياب أو التحصيل أو طلب المتابعة."
          icon={IconUserHeart}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={parents} rowKey={(row) => row.id} />

      <DashboardWidget
        title="آخر الرسائل"
        description="نماذج حقيقية للمراسلات اليومية بين المركز وأولياء الأمور."
      >
        <div className="space-y-3">
          {messages.slice(0, 6).map((message) => (
            <div
              key={message.id}
              className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-4"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-app-text-primary">{message.subject}</p>
                  <p className="text-sm text-app-text-secondary">
                    {message.parentName} · {message.studentName}
                  </p>
                </div>
                <Badge variant={message.direction === "incoming" ? "info" : "accent"}>
                  {message.direction === "incoming" ? "واردة" : "صادرة"}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-app-text-secondary">{message.body}</p>
            </div>
          ))}
        </div>
      </DashboardWidget>
    </PageContainer>
  )
}

