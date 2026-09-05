import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconCalendarCheck, IconIdBadge2, IconNotes } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { DashboardWidget } from "@/components/shared/dashboard-widget"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { mockStudentService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"

export function StudentDetailsPage() {
  const { id = "" } = useParams()
  const { data } = useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => mockStudentService.getStudentDetails(id),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  const attendanceColumns: AppTableColumn<(typeof data.recentAttendance)[number]>[] = [
    { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
    { id: "group", header: "المجموعة", cell: (row) => row.groupName },
    {
      id: "status",
      header: "الحالة",
      cell: (row) => (
        <Badge variant={row.status === "present" ? "success" : row.status === "late" ? "warning" : "error"}>
          {row.status === "present" ? "حاضر" : row.status === "late" ? "متأخر" : "غائب"}
        </Badge>
      ),
    },
  ]

  const gradeColumns: AppTableColumn<(typeof data.recentGrades)[number]>[] = [
    { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
    { id: "subject", header: "المادة", cell: (row) => row.subject },
    { id: "assessment", header: "التقييم", cell: (row) => row.assessmentTitle },
    { id: "score", header: "النتيجة", cell: (row) => <span className="font-mono">{row.percentage}%</span> },
  ]

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / الطلاب / التفاصيل"
        title={data.name}
        description={`${data.academicYear} · ولي الأمر: ${data.parentName}`}
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="نسبة الحضور"
          value={`${data.attendanceRate}%`}
          description="متوسط الحضور عبر آخر الجلسات المسجلة."
          icon={IconCalendarCheck}
          tone="primary"
        />
        <MetricCard
          label="متوسط الدرجات"
          value={`${data.averageGrade}%`}
          description="متوسط الدرجات في التقييمات الحالية."
          icon={IconBook2}
          tone="accent"
        />
        <MetricCard
          label="عدد المجموعات"
          value={`${data.groups.length}`}
          description="المجموعات الدراسية المسجل بها الطالب."
          icon={IconIdBadge2}
          tone="surface"
        />
        <MetricCard
          label="الحالة"
          value={data.statusLabel}
          description="تقييم تشغيلي سريع لمستوى الطالب الحالي."
          icon={IconNotes}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="surface-card p-5 shadow-none">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="section-eyebrow">بيانات ولي الأمر</p>
              <h3 className="text-lg font-semibold text-app-text-primary">{data.parentName}</h3>
            </div>
            <div className="space-y-2 text-sm text-app-text-secondary">
              <p>{data.relation}</p>
              <p>{data.phone}</p>
            </div>
            <div className="space-y-2">
              <p className="section-eyebrow">المجموعات الحالية</p>
              <div className="flex flex-wrap gap-2">
                {data.groups.map((group) => (
                  <Badge key={group} variant="outline" className="rounded-md">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-[14px] bg-app-surface-soft/70 p-4">
              <p className="section-eyebrow">ملاحظات المتابعة</p>
              <p className="mt-2 text-sm leading-6 text-app-text-secondary">{data.notes}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <DashboardWidget
            title="آخر سجلات الحضور"
            description="أحدث الجلسات المسجلة للطالب عبر المجموعات المختلفة."
          >
            <AppTable columns={attendanceColumns} rows={data.recentAttendance} />
          </DashboardWidget>

          <DashboardWidget
            title="آخر التقييمات"
            description="نتائج آخر الاختبارات والواجبات المرتبطة بالطالب."
          >
            <AppTable columns={gradeColumns} rows={data.recentGrades} />
          </DashboardWidget>
        </div>
      </div>
    </PageContainer>
  )
}

