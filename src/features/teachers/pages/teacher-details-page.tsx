import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { DashboardWidget } from "@/components/shared/dashboard-widget"
import { MetricCard } from "@/components/shared/metric-card"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { queryKeys } from "@/services/api/query-keys"
import { mockTeacherService } from "@/mocks"
import { IconBook2, IconCalendarCheck, IconSchool, IconUsersGroup } from "@tabler/icons-react"

export function TeacherDetailsPage() {
  const { id = "" } = useParams()
  const { data } = useQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: () => mockTeacherService.getTeacherDetails(id),
  })

  const summary = useMemo(() => {
    if (!data) {
      return null
    }

    const averageAttendance =
      data.roster.reduce((sum, item) => sum + item.attendanceRate, 0) /
      Math.max(1, data.roster.length)

    return {
      totalStudents: data.studentCount,
      averageAttendance: Number(averageAttendance.toFixed(1)),
    }
  }, [data])

  if (!data || !summary) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / المدرسون / التفاصيل"
        title={data.name}
        description={`مدرس ${data.subject} يشرف على ${data.groupNames.length} مجموعات داخل مركز النخبة التعليمي.`}
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="المجموعات"
          value={`${data.groupNames.length}`}
          description="عدد المجموعات التعليمية المسندة للمدرس."
          icon={IconUsersGroup}
          tone="primary"
        />
        <MetricCard
          label="عدد الطلاب"
          value={`${summary.totalStudents}`}
          description="إجمالي الطلاب المرتبطين بمجموعاته الحالية."
          icon={IconSchool}
          tone="accent"
        />
        <MetricCard
          label="اكتمال الحضور"
          value={`${data.attendanceCompletionRate}%`}
          description="نسبة رفع جلسات الحضور خلال الأسابيع الأخيرة."
          icon={IconCalendarCheck}
          tone="surface"
        />
        <MetricCard
          label="متوسط الأداء"
          value={`${data.averageStudentPerformance}%`}
          description="متوسط نتائج الطلاب عبر تقييمات المجموعات المسندة."
          icon={IconBook2}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="surface-card p-5 shadow-none">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="section-eyebrow">ملف المدرس</p>
              <h3 className="text-lg font-semibold text-app-text-primary">{data.subject}</h3>
            </div>
            <div className="space-y-3 text-sm text-app-text-secondary">
              <p>{data.bio}</p>
              <div className="rounded-[14px] bg-app-surface-soft/70 p-3">
                <p className="text-app-text-primary">{data.email}</p>
                <p>{data.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.groupNames.map((groupName) => (
                  <Badge key={groupName} variant="outline" className="rounded-md">
                    {groupName}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <DashboardWidget
          title="تفاصيل المجموعات"
          description={`متوسط الحضور العام ${summary.averageAttendance}% عبر جميع المجموعات الحالية.`}
        >
          <div className="space-y-3">
            {data.roster.map((item) => (
              <div
                key={item.groupName}
                className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-app-text-primary">{item.groupName}</p>
                    <p className="text-sm text-app-text-secondary">
                      {item.studentCount} طالب · حضور {item.attendanceRate}% · متوسط درجات{" "}
                      {item.averageGrade}%
                    </p>
                  </div>
                  <Badge variant={item.averageGrade >= 85 ? "success" : item.averageGrade >= 70 ? "info" : "warning"}>
                    {item.averageGrade >= 85
                      ? "أداء قوي"
                      : item.averageGrade >= 70
                        ? "أداء مستقر"
                        : "يحتاج دعم"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DashboardWidget>
      </div>
    </PageContainer>
  )
}
