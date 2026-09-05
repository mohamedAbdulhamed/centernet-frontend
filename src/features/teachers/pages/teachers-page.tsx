import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconCalendarCheck, IconUserStar, IconUsersGroup } from "@tabler/icons-react"

import { paths } from "@/app/router/paths"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { mockTeacherService } from "@/mocks"
import type { TeacherListItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const columns: AppTableColumn<TeacherListItem>[] = [
  {
    id: "name",
    header: "المدرس",
    cell: (row) => (
      <Link
        to={paths.admin.teacherDetails(row.id)}
        className="font-medium text-app-text-primary transition-colors hover:text-app-accent"
      >
        {row.name}
      </Link>
    ),
  },
  { id: "subject", header: "المادة", cell: (row) => row.subject },
  {
    id: "groups",
    header: "المجموعات",
    cell: (row) => <span className="font-mono">{row.groupNames.length}</span>,
  },
  {
    id: "students",
    header: "الطلاب",
    cell: (row) => <span className="font-mono">{row.studentCount}</span>,
  },
  {
    id: "attendance",
    header: "اكتمال الحضور",
    cell: (row) => <span className="font-mono">{row.attendanceCompletionRate}%</span>,
  },
  {
    id: "performance",
    header: "متوسط الأداء",
    cell: (row) => (
      <Badge variant={row.averageStudentPerformance >= 85 ? "success" : row.averageStudentPerformance >= 70 ? "info" : "warning"}>
        {row.averageStudentPerformance}%
      </Badge>
    ),
  },
]

export function TeachersPage() {
  const { data = [] } = useQuery({
    queryKey: queryKeys.teachers.list,
    queryFn: () => mockTeacherService.getTeachers(),
  })

  const averagePerformance = data.length
    ? (data.reduce((sum, item) => sum + item.averageStudentPerformance, 0) / data.length).toFixed(1)
    : "0"
  const totalGroups = data.reduce((sum, item) => sum + item.groupNames.length, 0)
  const averageAttendanceCompletion = data.length
    ? (data.reduce((sum, item) => sum + item.attendanceCompletionRate, 0) / data.length).toFixed(1)
    : "0"

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / المدرسون"
        title="المدرسون"
        description="متابعة المدرسين، المجموعات المسندة، ومؤشرات الأداء داخل المركز."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="عدد المدرسين"
          value={`${data.length}`}
          description="إجمالي المدرسين النشطين في العرض الحالي."
          icon={IconUserStar}
          tone="primary"
        />
        <MetricCard
          label="المجموعات"
          value={`${totalGroups}`}
          description="عدد المجموعات المرتبطة بالطاقم التعليمي."
          icon={IconUsersGroup}
          tone="accent"
        />
        <MetricCard
          label="متوسط الأداء"
          value={`${averagePerformance}%`}
          description="متوسط نتائج الطلاب عبر جميع المدرسين."
          icon={IconBook2}
          tone="surface"
        />
        <MetricCard
          label="اكتمال الحضور"
          value={`${averageAttendanceCompletion}%`}
          description="متوسط انتظام رفع الحضور بين جميع المدرسين."
          icon={IconCalendarCheck}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data} rowKey={(row) => row.id} />
    </PageContainer>
  )
}
