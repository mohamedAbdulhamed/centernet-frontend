import { useQuery } from "@tanstack/react-query"
import {
  IconCalendarCheck,
  IconSchool,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { PageContainer } from "@/components/shared/page-container"
import { MetricCard } from "@/components/shared/metric-card"
import { ActivityFeedWidget } from "@/features/dashboard/components/activity-feed-widget"
import { AlertsWidget } from "@/features/dashboard/components/alerts-widget"
import { AttendanceOverviewWidget } from "@/features/dashboard/components/attendance-overview-widget"
import { GradeOverviewWidget } from "@/features/dashboard/components/grade-overview-widget"
import { TeacherPerformanceWidget } from "@/features/dashboard/components/teacher-performance-widget"
import { mockDashboardService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"

export function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: queryKeys.dashboard.overview("admin"),
    queryFn: () => mockDashboardService.getAdminDashboard(),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <div className="dashboard-stats-grid">
        <MetricCard
          label="إجمالي الطلاب"
          value={`${data.overview.totalStudents}`}
          description="إجمالي الطلاب النشطين في مركز النخبة التعليمي."
          icon={IconUsers}
          tone="primary"
        />
        <MetricCard
          label="نسبة الحضور"
          value={`${data.overview.attendanceRate}%`}
          description="متوسط الحضور التشغيلي عبر كل المجموعات."
          icon={IconCalendarCheck}
          tone="accent"
        />
        <MetricCard
          label="متوسط الدرجات"
          value={`${data.overview.averageGrade}%`}
          description="متوسط الأداء في الاختبارات والواجبات الحالية."
          icon={IconSchool}
          tone="surface"
        />
        <MetricCard
          label="عدد المدرسين"
          value={`${data.overview.teacherCount}`}
          description="إجمالي المدرسين المرتبطين بالمجموعات الحالية."
          icon={IconUserStar}
          tone="success"
        />
      </div>

      <div className="dashboard-main-grid">
        <ActivityFeedWidget
          title="آخر المستجدات"
          description="تغذية حية لأهم الأحداث التشغيلية داخل المركز."
          items={data.activities}
        />
        <AttendanceOverviewWidget items={data.attendanceOverview} />
      </div>

      <div className="dashboard-bottom-grid">
        <TeacherPerformanceWidget items={data.teacherPerformance} />
        <GradeOverviewWidget items={data.gradeOverview} />
      </div>

      <AlertsWidget items={data.alerts} />
    </PageContainer>
  )
}

