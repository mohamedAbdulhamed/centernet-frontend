import { useQuery } from "@tanstack/react-query"
import { IconAlertTriangle, IconCalendarCheck, IconClock, IconUsers } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { mockAttendanceService } from "@/mocks"
import type { AttendanceStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const columns: AppTableColumn<AttendanceStudentRecordItem>[] = [
  { id: "student", header: "الطالب", cell: (row) => row.studentName },
  { id: "group", header: "المجموعة", cell: (row) => row.groupName },
  { id: "year", header: "الصف", cell: (row) => row.academicYear },
  { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
  {
    id: "status",
    header: "الحالة",
    cell: (row) => (
      <Badge variant={row.status === "absent" ? "error" : "warning"}>
        {row.status === "absent" ? "غائب" : "متأخر"}
      </Badge>
    ),
  },
]

export function AdminAttendancePage() {
  const { data } = useQuery({
    queryKey: queryKeys.attendance.overview,
    queryFn: () => mockAttendanceService.getAdminAttendanceSummary(),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / الحضور"
        title="الحضور"
        description="متابعة شاملة للحضور والغياب والتأخير عبر جميع مجموعات مركز النخبة التعليمي."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="حالات الحضور"
          value={`${data.totals.present}`}
          description="إجمالي الجلسات المسجلة كحضور كامل."
          icon={IconUsers}
          tone="primary"
        />
        <MetricCard
          label="حالات التأخير"
          value={`${data.totals.late}`}
          description="طلاب دخلوا بعد بداية الحصة المسجلة."
          icon={IconClock}
          tone="accent"
        />
        <MetricCard
          label="حالات الغياب"
          value={`${data.totals.absent}`}
          description="عدد مرات الغياب خلال الفترة المعروضة."
          icon={IconAlertTriangle}
          tone="surface"
        />
        <MetricCard
          label="الجلسات المرفوعة"
          value={`${data.sessionsSubmitted}`}
          description="عدد جلسات الحضور التي تم اعتمادها حتى الآن."
          icon={IconCalendarCheck}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data.records} rowKey={(row) => `${row.studentId}-${row.date}-${row.groupName}`} />
    </PageContainer>
  )
}

