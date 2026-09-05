import { useQuery } from "@tanstack/react-query"
import { IconClipboardText, IconReportAnalytics, IconStar, IconTrendingDown } from "@tabler/icons-react"

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { mockGradeService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"

interface StudentGradeDetailPanelProps {
  studentId: string | null
  teacherId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentGradeDetailPanel({
  studentId,
  teacherId,
  open,
  onOpenChange,
}: StudentGradeDetailPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.grades.teacherHistory(teacherId, studentId ?? ""),
    queryFn: () => mockGradeService.getStudentGradeHistory(studentId!, teacherId),
    enabled: Boolean(studentId && teacherId),
  })

  const sortedRecords = data
    ? [...data.records].sort((a, b) => b.date.localeCompare(a.date))
    : []

  const highestScore = sortedRecords.length
    ? Math.max(...sortedRecords.map((r) => r.percentage))
    : 0

  const lowestScore = sortedRecords.length
    ? Math.min(...sortedRecords.map((r) => r.percentage))
    : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{data?.studentName ?? "..."}</SheetTitle>
          <SheetDescription>
            {data?.groupName} · {data?.academicYear}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : !data || sortedRecords.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <IconClipboardText className="size-10 text-app-text-muted" stroke={1.5} />
            <p className="text-sm text-app-text-secondary">لا توجد درجات مسجلة لهذا الطالب.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-3 text-center">
                <div className="flex justify-center">
                  <IconReportAnalytics className="size-4 text-app-accent" stroke={1.8} />
                </div>
                <p className="mt-2 font-mono text-lg font-semibold text-app-text-primary">
                  {data.averagePercentage}%
                </p>
                <p className="text-xs text-app-text-muted">المتوسط</p>
              </div>
              <div className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-3 text-center">
                <div className="flex justify-center">
                  <IconStar className="size-4 text-app-status-success-text" stroke={1.8} />
                </div>
                <p className="mt-2 font-mono text-lg font-semibold text-app-text-primary">
                  {highestScore}%
                </p>
                <p className="text-xs text-app-text-muted">الأعلى</p>
              </div>
              <div className="rounded-[14px] border border-app-divider bg-app-surface-soft/60 p-3 text-center">
                <div className="flex justify-center">
                  <IconTrendingDown className="size-4 text-app-status-warning-text" stroke={1.8} />
                </div>
                <p className="mt-2 font-mono text-lg font-semibold text-app-text-primary">
                  {lowestScore}%
                </p>
                <p className="text-xs text-app-text-muted">الأدنى</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-app-text-primary">
                السجل الكامل ({sortedRecords.length})
              </p>
              <div className="space-y-2">
                {sortedRecords.map((record) => (
                  <div
                    key={`${record.studentId}-${record.assessmentTitle}-${record.date}`}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-app-divider bg-card px-4 py-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-app-text-primary">
                        {record.assessmentTitle}
                      </p>
                      <div className="flex gap-2 text-xs text-app-text-muted">
                        <span>{record.subject}</span>
                        <span>·</span>
                        <span>
                          {new Date(record.date).toLocaleDateString("ar-EG-u-nu-latn")}
                        </span>
                      </div>
                      <span className="text-xs text-app-text-muted">
                        {record.score}/{record.maxScore}
                      </span>
                    </div>
                    <Badge
                      variant={
                        record.percentage >= 85
                          ? "success"
                          : record.percentage >= 70
                            ? "info"
                            : "warning"
                      }
                    >
                      {record.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
