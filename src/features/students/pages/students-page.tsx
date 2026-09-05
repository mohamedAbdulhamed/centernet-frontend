import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconCalendarCheck, IconUsers } from "@tabler/icons-react"

import { paths } from "@/app/router/paths"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { queryKeys } from "@/services/api/query-keys"
import { mockStudentService } from "@/mocks"
import type { StudentListItem } from "@/mocks/types"

const columns: AppTableColumn<StudentListItem>[] = [
  {
    id: "name",
    header: "الطالب",
    cell: (row) => (
      <Link
        to={paths.admin.studentDetails(row.id)}
        className="font-medium text-app-text-primary transition-colors hover:text-app-accent"
      >
        {row.name}
      </Link>
    ),
  },
  { id: "year", header: "الصف", cell: (row) => row.academicYear },
  { id: "parent", header: "ولي الأمر", cell: (row) => row.parentName },
  {
    id: "groups",
    header: "المجموعات",
    cell: (row) => (
      <div className="max-w-[360px] truncate text-app-text-secondary">
        {row.groups.slice(0, 2).join("، ")}
        {row.groups.length > 2 ? ` +${row.groups.length - 2}` : ""}
      </div>
    ),
  },
  {
    id: "attendance",
    header: "الحضور",
    cell: (row) => <span className="font-mono text-app-text-primary">{row.attendanceRate}%</span>,
  },
  {
    id: "grade",
    header: "المتوسط",
    cell: (row) => <span className="font-mono text-app-text-primary">{row.averageGrade}%</span>,
  },
  {
    id: "status",
    header: "الحالة",
    cell: (row) => (
      <Badge
        variant={
          row.statusLabel === "متميز"
            ? "success"
            : row.statusLabel === "مستقر"
              ? "info"
              : "warning"
        }
      >
        {row.statusLabel}
      </Badge>
    ),
  },
]

export function StudentsPage() {
  const { data = [] } = useQuery({
    queryKey: queryKeys.students.list,
    queryFn: () => mockStudentService.getStudents(),
  })

  const attendanceAverage = data.length
    ? (data.reduce((sum, item) => sum + item.attendanceRate, 0) / data.length).toFixed(1)
    : "0"
  const gradeAverage = data.length
    ? (data.reduce((sum, item) => sum + item.averageGrade, 0) / data.length).toFixed(1)
    : "0"
  const attentionCount = data.filter((item) => item.statusLabel === "يحتاج متابعة").length

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / الطلاب"
        title="الطلاب"
        description="قائمة كاملة لطلاب مركز النخبة التعليمي مع الربط بين الحضور، الدرجات، وأولياء الأمور."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="إجمالي الطلاب"
          value={`${data.length}`}
          description="إجمالي السجلات النشطة في المركز."
          icon={IconUsers}
          tone="primary"
        />
        <MetricCard
          label="متوسط الحضور"
          value={`${attendanceAverage}%`}
          description="متوسط انتظام الطلاب عبر آخر الأسابيع."
          icon={IconCalendarCheck}
          tone="accent"
        />
        <MetricCard
          label="متوسط الدرجات"
          value={`${gradeAverage}%`}
          description="متوسط الأداء في الاختبارات والواجبات."
          icon={IconBook2}
          tone="surface"
        />
        <MetricCard
          label="يحتاج متابعة"
          value={`${attentionCount}`}
          description="عدد الطلاب الذين يحتاجون إلى تدخل قريب."
          icon={IconUsers}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data} rowKey={(row) => row.id} />
    </PageContainer>
  )
}

