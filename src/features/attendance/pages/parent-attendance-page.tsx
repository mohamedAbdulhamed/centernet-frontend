import { useQuery } from "@tanstack/react-query"
import { IconCalendarCheck, IconCalendarStats, IconClock, IconUserCheck } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { database, mockAttendanceService } from "@/mocks"
import type { AttendanceStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const studentId = database.students[0].id

const columns: AppTableColumn<AttendanceStudentRecordItem>[] = [
  { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
  { id: "group", header: "المجموعة", cell: (row) => row.groupName },
  {
    id: "status",
    header: "الحالة",
    cell: (row) => (
      <Badge
        variant={
          row.status === "present" ? "success" : row.status === "late" ? "warning" : "error"
        }
      >
        {row.status === "present" ? "حاضر" : row.status === "late" ? "متأخر" : "غائب"}
      </Badge>
    ),
  },
]

export function ParentAttendancePage() {
  const { data } = useQuery({
    queryKey: queryKeys.attendance.parent(studentId),
    queryFn: () => mockAttendanceService.getParentAttendanceSummary(studentId),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  const presentCount = data.records.filter((record) => record.status === "present").length
  const lateCount = data.records.filter((record) => record.status === "late").length
  const absentCount = data.records.filter((record) => record.status === "absent").length

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="ولي الأمر / الحضور"
        title="متابعة الحضور"
        description="عرض تفصيلي لحضور الطالب خلال آخر الجلسات مع مؤشرات واضحة لولي الأمر."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="نسبة الحضور"
          value={`${data.attendanceRate.toFixed(1)}%`}
          description="متوسط الحضور العام خلال السجلات المعروضة."
          icon={IconUserCheck}
          tone="primary"
        />
        <MetricCard
          label="عدد الحضور"
          value={`${presentCount}`}
          description="جلسات تم تسجيلها كحضور كامل."
          icon={IconCalendarCheck}
          tone="accent"
        />
        <MetricCard
          label="عدد التأخير"
          value={`${lateCount}`}
          description="حالات تأخير تحتاج إلى متابعة."
          icon={IconClock}
          tone="surface"
        />
        <MetricCard
          label="عدد الغياب"
          value={`${absentCount}`}
          description="إجمالي الغياب في آخر الجلسات المعروضة."
          icon={IconCalendarStats}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data.records} rowKey={(row) => `${row.studentId}-${row.date}-${row.groupName}`} />
    </PageContainer>
  )
}

