import { useQuery } from "@tanstack/react-query"
import { IconAward, IconBook2, IconChartHistogram, IconClipboardText } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { mockGradeService } from "@/mocks"
import type { GradeStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const columns: AppTableColumn<GradeStudentRecordItem>[] = [
  { id: "student", header: "الطالب", cell: (row) => row.studentName },
  { id: "subject", header: "المادة", cell: (row) => row.subject },
  { id: "group", header: "المجموعة", cell: (row) => row.groupName },
  { id: "assessment", header: "التقييم", cell: (row) => row.assessmentTitle },
  { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
  {
    id: "score",
    header: "النتيجة",
    cell: (row) => (
      <Badge variant={row.percentage >= 85 ? "success" : row.percentage >= 70 ? "info" : "warning"}>
        {row.percentage}%
      </Badge>
    ),
  },
]

export function AdminGradesPage() {
  const { data } = useQuery({
    queryKey: queryKeys.grades.overview,
    queryFn: () => mockGradeService.getAdminGradesSummary(),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  const excellentCount = data.records.filter((item) => item.percentage >= 85).length
  const supportCount = data.records.filter((item) => item.percentage < 65).length

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="التشغيل / الدرجات"
        title="الدرجات"
        description="متابعة نتائج الاختبارات والواجبات الشهرية والنهائية عبر جميع المجموعات."
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="متوسط الدرجات"
          value={`${data.averageGrade.toFixed(1)}%`}
          description="متوسط الأداء في كل التقييمات المسجلة."
          icon={IconChartHistogram}
          tone="primary"
        />
        <MetricCard
          label="التقييمات المعروضة"
          value={`${data.records.length}`}
          description="آخر التقييمات التي تم رفعها على النظام."
          icon={IconClipboardText}
          tone="accent"
        />
        <MetricCard
          label="نتائج قوية"
          value={`${excellentCount}`}
          description="عدد النتائج التي تجاوزت مستوى 85%."
          icon={IconAward}
          tone="surface"
        />
        <MetricCard
          label="يحتاج دعم"
          value={`${supportCount}`}
          description="نتائج تحتاج إلى تدخل أو مراجعة إضافية."
          icon={IconBook2}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data.records} rowKey={(row) => `${row.studentId}-${row.assessmentTitle}-${row.date}`} />
    </PageContainer>
  )
}

