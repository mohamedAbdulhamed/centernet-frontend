import { useQuery } from "@tanstack/react-query"
import {
  IconCalendarCheck,
  IconClipboardText,
  IconUsersGroup,
} from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { PageContainer } from "@/components/shared/page-container"
import { MetricCard } from "@/components/shared/metric-card"
import { ActivityFeedWidget } from "@/features/dashboard/components/activity-feed-widget"
import { AttendanceOverviewWidget } from "@/features/dashboard/components/attendance-overview-widget"
import { GradeOverviewWidget } from "@/features/dashboard/components/grade-overview-widget"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { database, mockDashboardService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"

export function TeacherDashboardPage() {
  const session = useAuthStore(authSelectors.session)
  const fallbackTeacherId = database.teachers[0]?.id ?? ""
  const teacherId =
    session?.user.role === "teacher"
      ? (database.teachers.find((teacher) => teacher.name === session.user.name)?.id ??
        fallbackTeacherId)
      : fallbackTeacherId

  const { data } = useQuery({
    queryKey: queryKeys.dashboard.overview("teacher"),
    queryFn: () => mockDashboardService.getTeacherDashboard(teacherId),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <div className="dashboard-stats-grid">
        <MetricCard
          label="عدد المجموعات"
          value={`${data.metrics.groups}`}
          description="المجموعات المسندة للمدرس في العرض الحالي."
          icon={IconUsersGroup}
          tone="primary"
        />
        <MetricCard
          label="حصص اليوم"
          value={`${data.metrics.sessionsToday}`}
          description="عدد الحصص المخطط لها في يوم العرض."
          icon={IconCalendarCheck}
          tone="accent"
        />
        <MetricCard
          label="مهام التصحيح"
          value={`${data.metrics.gradingTasks}`}
          description="عدد عناصر المتابعة والتصحيح المفتوحة حالياً."
          icon={IconClipboardText}
          tone="surface"
        />
      </div>

      <div className="dashboard-main-grid">
        <AttendanceOverviewWidget
          title="حضور المجموعات"
          description="ملخص سريع لحضور المجموعات المرتبطة بالمدرس."
          items={data.attendanceOverview}
        />
        <GradeOverviewWidget
          title="آخر التقييمات"
          description="أحدث النتائج المرفوعة أو التي تمت مراجعتها."
          items={data.gradeOverview}
        />
      </div>

      <ActivityFeedWidget
        title="التحديثات الأخيرة"
        description="أهم الأحداث الخاصة بالحضور والنتائج في مجموعات المدرس."
        items={data.activities}
      />
    </PageContainer>
  )
}

