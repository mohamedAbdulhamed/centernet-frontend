import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconCalendarCheck, IconUsers, IconUsersGroup } from "@tabler/icons-react"

import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { database, mockGroupService } from "@/mocks"
import type { GroupListItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const columns: AppTableColumn<GroupListItem>[] = [
  { id: "name", header: "المجموعة", cell: (row) => row.name },
  { id: "teacher", header: "المدرس", cell: (row) => row.teacherName },
  { id: "room", header: "القاعة", cell: (row) => row.room },
  { id: "schedule", header: "الموعد", cell: (row) => row.scheduleLabel },
  {
    id: "students",
    header: "الطلاب",
    cell: (row) => <span className="font-mono">{row.studentCount}</span>,
  },
  {
    id: "attendance",
    header: "الحضور",
    cell: (row) => <span className="font-mono">{row.attendanceRate}%</span>,
  },
  {
    id: "grade",
    header: "الأداء",
    cell: (row) => (
      <Badge variant={row.averageGrade >= 85 ? "success" : row.averageGrade >= 70 ? "info" : "warning"}>
        {row.averageGrade}%
      </Badge>
    ),
  },
]

export function GroupsPage() {
  const session = useAuthStore(authSelectors.session)
  const teacherId =
    session?.user.role === "teacher"
      ? (database.teachers.find((teacher) => teacher.name === session.user.name)?.id ?? database.teachers[0]?.id)
      : undefined

  const { data = [] } = useQuery({
    queryKey: queryKeys.groups.list(teacherId ?? "all"),
    queryFn: () => mockGroupService.getGroups(teacherId),
  })

  const totalStudents = data.reduce((sum, item) => sum + item.studentCount, 0)
  const averageAttendance = data.length
    ? (data.reduce((sum, item) => sum + item.attendanceRate, 0) / data.length).toFixed(1)
    : "0"
  const averageGrade = data.length
    ? (data.reduce((sum, item) => sum + item.averageGrade, 0) / data.length).toFixed(1)
    : "0"

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / المجموعات"
        title="المجموعات"
        description="جميع المجموعات الدراسية الحالية مع الربط بين المدرسين والطلاب والمؤشرات الأكاديمية."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="عدد المجموعات"
          value={`${data.length}`}
          description="المجموعات الدراسية الفعالة حالياً."
          icon={IconUsersGroup}
          tone="primary"
        />
        <MetricCard
          label="إجمالي المقاعد المشغولة"
          value={`${totalStudents}`}
          description="إجمالي التسجيلات الحالية عبر المجموعات."
          icon={IconUsers}
          tone="accent"
        />
        <MetricCard
          label="متوسط الحضور"
          value={`${averageAttendance}%`}
          description="متوسط الحضور لجميع المجموعات النشطة."
          icon={IconCalendarCheck}
          tone="surface"
        />
        <MetricCard
          label="متوسط الأداء"
          value={`${averageGrade}%`}
          description="متوسط نتائج الطلاب عبر جميع المجموعات."
          icon={IconBook2}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data} rowKey={(row) => row.id} />
    </PageContainer>
  )
}
