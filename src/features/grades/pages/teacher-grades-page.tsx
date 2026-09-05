import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconBook2,
  IconClipboardText,
  IconEdit,
  IconEye,
  IconPlus,
  IconTargetArrow,
} from "@tabler/icons-react"

import { EmptyState } from "@/components/feedback/empty-state"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { AppTable, type AppTableColumn } from "@/components/tables"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { database, mockGradeService } from "@/mocks"
import type { GradeStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

import { GradeEntryDialog } from "../components/grade-entry-dialog"
import { StudentGradeDetailPanel } from "../components/student-grade-detail-panel"

const PAGE_SIZE = 15

export function TeacherGradesPage() {
  const queryClient = useQueryClient()
  const session = useAuthStore(authSelectors.session)
  const fallbackTeacherId = database.teachers[0]?.id ?? ""
  const teacherId =
    session?.user.role === "teacher"
      ? (database.teachers.find((teacher) => teacher.name === session.user.name)?.id ??
        fallbackTeacherId)
      : fallbackTeacherId

  const teacherGroups = database.groups.filter((g) => g.teacherId === teacherId)
  const teacherStudents = database.students.filter((s) =>
    s.enrolledGroupIds.some((gid) => teacherGroups.some((tg) => tg.id === gid))
  )

  const [selectedGroupId, setSelectedGroupId] = useState("all")
  const [selectedAssessmentType, setSelectedAssessmentType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [editingGrade, setEditingGrade] = useState<GradeStudentRecordItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filters = useMemo(
    () => ({
      groupId: selectedGroupId,
      assessmentType: selectedAssessmentType,
      searchQuery: searchQuery.trim(),
      dateFrom,
      dateTo,
    }),
    [selectedGroupId, selectedAssessmentType, searchQuery, dateFrom, dateTo]
  )

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.grades.teacher(teacherId), filters],
    queryFn: () => mockGradeService.getTeacherGradesSummary(teacherId, filters),
    enabled: Boolean(teacherId),
  })

  const filteredRecords = data?.records ?? []

  const visibleRecords = filteredRecords.slice(0, page * PAGE_SIZE)
  const hasMore = visibleRecords.length < filteredRecords.length

  function handleLoadMore() {
    setPage((prev) => prev + 1)
  }

  function handleSaved() {
    setEditingGrade(null)
    queryClient.invalidateQueries({
      queryKey: queryKeys.grades.teacher(teacherId),
    })
  }

  const columns: AppTableColumn<GradeStudentRecordItem>[] = [
    {
      id: "student",
      header: "الطالب",
      cell: (row) => (
        <button
          type="button"
          onClick={() => setSelectedStudentId(row.studentId)}
          className="cursor-pointer text-sm font-medium text-app-accent underline-offset-2 hover:underline"
        >
          {row.studentName}
        </button>
      ),
    },
    { id: "group", header: "المجموعة", cell: (row) => row.groupName },
    { id: "assessment", header: "التقييم", cell: (row) => row.assessmentTitle },
    {
      id: "score",
      header: "الدرجة",
      cell: (row) => (
        <span className="font-mono text-sm text-app-text-secondary">
          {row.score}/{row.maxScore}
        </span>
      ),
    },
    {
      id: "percentage",
      header: "النسبة",
      cell: (row) => (
        <Badge
          variant={
            row.percentage >= 85
              ? "success"
              : row.percentage >= 70
                ? "info"
                : "warning"
          }
        >
          {row.percentage}%
        </Badge>
      ),
    },
    { id: "date", header: "التاريخ", cell: (row) => new Date(row.date).toLocaleDateString("ar-EG-u-nu-latn") },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setSelectedStudentId(row.studentId)}
            className="flex size-8 items-center justify-center rounded-lg text-app-text-muted transition hover:bg-app-surface-soft hover:text-app-accent"
            title="عرض السجل"
          >
            <IconEye className="size-4" stroke={1.8} />
          </button>
          <button
            type="button"
            onClick={() => setEditingGrade(row)}
            className="flex size-8 items-center justify-center rounded-lg text-app-text-muted transition hover:bg-app-surface-soft hover:text-app-accent"
            title="تعديل"
          >
            <IconEdit className="size-4" stroke={1.8} />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <PageContainer>
      <SectionHeader
        title=""
        actions={
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">المجموعة</p>
              <Select value={selectedGroupId} onValueChange={(v) => { setSelectedGroupId(v); setPage(1) }}>
                <SelectTrigger className="h-11 w-full min-w-[160px] rounded-[11px] bg-card">
                  <SelectValue placeholder="كل المجموعات" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  <SelectItem value="all">كل المجموعات</SelectItem>
                  {teacherGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">نوع التقييم</p>
              <Select value={selectedAssessmentType} onValueChange={(v) => { setSelectedAssessmentType(v); setPage(1) }}>
                <SelectTrigger className="h-11 w-full min-w-[130px] rounded-[11px] bg-card">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="quiz">كويز</SelectItem>
                  <SelectItem value="monthly">اختبار شهري</SelectItem>
                  <SelectItem value="final">اختبار نهائي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">بحث</p>
              <Input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="ابحث عن طالب..."
                className="h-11 min-w-[160px] rounded-[11px]"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">من تاريخ</p>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                className="h-11 min-w-[140px] rounded-[11px]"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">إلى تاريخ</p>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="h-11 min-w-[140px] rounded-[11px]"
              />
            </div>

            <Button
              variant="accent"
              size="default"
              className="h-11"
              onClick={() => {
                setEditingGrade(null)
                setIsAddDialogOpen(true)
              }}
            >
              <IconPlus className="size-4" stroke={1.8} />
              إضافة تقييم
            </Button>
          </div>
        }
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="التقييمات المعروضة"
          value={`${filteredRecords.length}`}
          description="إجمالي التقييمات المطابقة لمعايير البحث."
          icon={IconClipboardText}
          tone="primary"
        />
        <MetricCard
          label="اكتمال الرفع"
          value={`${data?.completionRate ?? 0}%`}
          description="نسبة اكتمال رفع الدرجات في الدورة الحالية."
          icon={IconTargetArrow}
          tone="accent"
        />
        <MetricCard
          label="نتائج قوية"
          value={`${data?.highScores ?? 0}`}
          description="نتائج تجاوزت 85% في السجل المعروض."
          icon={IconBook2}
          tone="surface"
        />
        <MetricCard
          label="يحتاج مراجعة"
          value={`${data?.supportCount ?? 0}`}
          description="طلاب يحتاجون إلى دعم أو متابعة إضافية."
          icon={IconTargetArrow}
          tone="success"
        />
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={IconClipboardText}
          title="لا توجد نتائج"
          description={
            searchQuery
              ? "لا توجد تقييمات تطابق بحثك. حاول تعديل معايير البحث."
              : "لم يتم رفع أي تقييمات بعد للمجموعات المحددة."
          }
        />
      ) : (
        <div className="space-y-4">
          <AppTable
            columns={columns}
            rows={visibleRecords}
            rowKey={(row) => `${row.studentId}-${row.assessmentTitle}-${row.date}`}
          />
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="min-w-[200px]"
              >
                عرض المزيد ({filteredRecords.length - visibleRecords.length})
              </Button>
            </div>
          )}
        </div>
      )}

      <StudentGradeDetailPanel
        studentId={selectedStudentId}
        teacherId={teacherId}
        open={selectedStudentId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
      />

      <GradeEntryDialog
        teacherId={teacherId}
        teacherGroups={teacherGroups.map((g) => ({
          id: g.id,
          name: g.name,
          subject: g.subject,
        }))}
        teacherStudents={teacherStudents.map((s) => ({
          id: s.id,
          name: s.name,
        }))}
        editingGrade={editingGrade}
        open={editingGrade !== null || isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingGrade(null)
            setIsAddDialogOpen(false)
          }
        }}
        onSaved={handleSaved}
      />
    </PageContainer>
  )
}
