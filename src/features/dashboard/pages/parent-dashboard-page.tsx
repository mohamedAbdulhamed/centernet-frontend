import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconCalendarCheck, IconMessages } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { PageContainer } from "@/components/shared/page-container"
import { MetricCard } from "@/components/shared/metric-card"
import { ActivityFeedWidget } from "@/features/dashboard/components/activity-feed-widget"
import { AttendanceOverviewWidget } from "@/features/dashboard/components/attendance-overview-widget"
import { GradeOverviewWidget } from "@/features/dashboard/components/grade-overview-widget"
import { database, mockDashboardService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"

const studentId = database.students[0].id

export function ParentDashboardPage() {
  const { data } = useQuery({
    queryKey: queryKeys.dashboard.overview("parent"),
    queryFn: () => mockDashboardService.getParentDashboard(studentId),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <div className="dashboard-stats-grid">
        <MetricCard
          label="الحضور"
          value={`${data.metrics.attendance}%`}
          description="متوسط حضور الطالب خلال الفترة الحالية."
          icon={IconCalendarCheck}
          tone="accent"
        />
        <MetricCard
          label="آخر متوسط"
          value={`${data.metrics.latestGrade}%`}
          description="متوسط نتائج الطالب في آخر التقييمات."
          icon={IconBook2}
          tone="surface"
        />
        <MetricCard
          label="التنبيهات"
          value={`${data.metrics.notifications}`}
          description="إشعارات مرتبطة بمتابعة الطالب داخل المركز."
          icon={IconMessages}
          tone="primary"
        />
      </div>

      <div className="dashboard-main-grid">
        <AttendanceOverviewWidget
          title="حضور الطالب"
          description="مؤشرات سريعة تساعد ولي الأمر على متابعة الانتظام."
          items={data.attendanceOverview}
        />
        <GradeOverviewWidget
          title="درجات الطالب"
          description="أحدث مستويات الأداء في التقييمات الحالية."
          items={data.gradeOverview}
        />
      </div>

      <ActivityFeedWidget
        title="آخر الرسائل"
        description="آخر ما تم تسجيله بخصوص الطالب من رسائل أو تحديثات."
        items={data.activities}
      />
    </PageContainer>
  )
}

