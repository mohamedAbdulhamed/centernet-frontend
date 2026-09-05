import { useQuery } from "@tanstack/react-query"
import { IconBook2, IconReportAnalytics, IconStar, IconTargetArrow } from "@tabler/icons-react"

import { database, mockGradeService } from "@/mocks"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import type { GradeStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

const studentId = database.students[0].id

const columns: AppTableColumn<GradeStudentRecordItem>[] = [
  { id: "subject", header: "المادة", cell: (row) => row.subject },
  { id: "assessment", header: "التقييم", cell: (row) => row.assessmentTitle },
  { id: "group", header: "المجموعة", cell: (row) => row.groupName },
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

export function ParentGradesPage() {
  const { data } = useQuery({
    queryKey: queryKeys.grades.parent(studentId),
    queryFn: () => mockGradeService.getParentGradesSummary(studentId),
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  // !! needs attention: computing is done locally not on the server.
  const bestScore = Math.max(...data.records.map((item) => item.percentage))
  const supportCount = data.records.filter((item) => item.percentage < 65).length

  return (
    <PageContainer>
      <div className="dashboard-stats-grid">
        <MetricCard
          label="متوسط الدرجات"
          value={`${data.averageGrade.toFixed(1)}%`}
          description="متوسط الطالب في التقييمات الحالية."
          icon={IconReportAnalytics}
          tone="primary"
        />
        <MetricCard
          label="أفضل نتيجة"
          value={`${bestScore}%`}
          description="أعلى نتيجة ضمن السجلات المعروضة."
          icon={IconStar}
          tone="accent"
        />
        <MetricCard
          label="عدد التقييمات"
          value={`${data.records.length}`}
          description="التقييمات التي ظهرت لولي الأمر في هذه الصفحة."
          icon={IconBook2}
          tone="surface"
        />
        <MetricCard
          label="يحتاج متابعة"
          value={`${supportCount}`}
          description="نتائج أقل من المستوى المستهدف حالياً."
          icon={IconTargetArrow}
          tone="success"
        />
      </div>

      <AppTable columns={columns} rows={data.records} rowKey={(row) => `${row.studentId}-${row.assessmentTitle}-${row.date}`} />
    </PageContainer>
  )
}

