import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  IconCalendarCheck,
  IconChecklist,
  IconClock,
  IconDeviceFloppy,
  IconUsersGroup,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/feedback/empty-state"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { MetricCard } from "@/components/shared/metric-card"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { database, mockAttendanceService } from "@/mocks"
import type { AttendanceStatus, TeacherAttendanceStudentRow } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

function formatAttendanceDate(value: string) {
  return new Date(value).toLocaleDateString("ar-EG-u-nu-latn", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function statusLabel(status: AttendanceStatus) {
  if (status === "present") return "حاضر"
  if (status === "late") return "متأخر"
  return "غائب"
}

function statusBadgeVariant(status: AttendanceStatus) {
  if (status === "present") return "success" as const
  if (status === "late") return "warning" as const
  return "error" as const
}

function statusButtonVariant(status: AttendanceStatus, isSelected: boolean) {
  if (!isSelected) {
    return "outline" as const
  }

  if (status === "present") return "accent" as const
  if (status === "late") return "secondary" as const
  return "destructive" as const
}

function statusButtonClassName(status: AttendanceStatus, isSelected: boolean) {
  if (!isSelected) {
    return ""
  }

  if (status === "late") {
    return "border-amber-500 bg-amber-500 text-white hover:bg-amber-500/90 hover:text-white focus-visible:ring-amber-200"
  }

  return ""
}

function summarizeRows(rows: TeacherAttendanceStudentRow[]) {
  return rows.reduce<Record<AttendanceStatus, number>>(
    (accumulator, row) => {
      accumulator[row.status] += 1
      return accumulator
    },
    { present: 0, absent: 0, late: 0 }
  )
}

export function TeacherAttendancePage() {
  const queryClient = useQueryClient()
  const session = useAuthStore(authSelectors.session)
  const fallbackTeacherId = database.teachers[0]?.id ?? ""
  const teacherId =
    session?.user.role === "teacher"
      ? (database.teachers.find((teacher) => teacher.name === session.user.name)?.id ??
        fallbackTeacherId)
      : fallbackTeacherId

  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined)
  const [editableRows, setEditableRows] = useState<TeacherAttendanceStudentRow[]>([])

  const { data } = useQuery({
    queryKey: queryKeys.attendance.teacherGroup(teacherId, selectedGroupId ?? "auto"),
    queryFn: () => mockAttendanceService.getTeacherAttendanceWorkspace(teacherId, selectedGroupId),
    enabled: Boolean(teacherId),
  })

  useEffect(() => {
    if (!data?.selectedGroup) {
      return
    }

    setSelectedGroupId((currentValue) => currentValue ?? data.selectedGroup?.id)
  }, [data?.selectedGroup])

  useEffect(() => {
    if (!data) {
      return
    }

    const availableSessionIds = new Set(data.sessions.map((item) => item.id))

    setSelectedSessionId((currentValue) => {
      if (currentValue === "draft") {
        return "draft"
      }

      if (currentValue && availableSessionIds.has(currentValue)) {
        return currentValue
      }

      return data.sessions[0]?.id ?? "draft"
    })
  }, [data])

  const activeSession =
    !data || !selectedSessionId
      ? null
      : selectedSessionId === "draft"
        ? data.draftSession
        : data.sessions.find((item) => item.id === selectedSessionId) ?? null

  useEffect(() => {
    setEditableRows(activeSession?.rows ?? [])
  }, [activeSession])

  const totals = summarizeRows(editableRows)

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!data?.selectedGroup) {
        throw new Error("No group selected")
      }

      return mockAttendanceService.saveTeacherAttendance({
        teacherId,
        groupId: data.selectedGroup.id,
        sessionId: selectedSessionId === "draft" ? undefined : selectedSessionId,
        rows: editableRows,
      })
    },
    onSuccess: async (result) => {
      setSelectedSessionId(result.sessionId)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.teacherGroup(teacherId, data?.selectedGroup?.id ?? "auto"),
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.teacher(teacherId),
      })
      toast.success(
        selectedSessionId === "draft" ? "تم تسجيل الحضور للمجموعة." : "تم تحديث الحضور بنجاح."
      )
    },
    onError: () => {
      toast.error("تعذر حفظ الحضور. حاول مرة أخرى.")
    },
  })

  if (!data) {
    return <LoadingSkeleton variant="page" />
  }

  if (!data.selectedGroup || !data.draftSession) {
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="المدرس / الحضور"
          title="تسجيل الحضور"
          description="لا توجد مجموعات مرتبطة بهذا المدرس في العرض الحالي."
        />
        <EmptyState
          icon={IconUsersGroup}
          title="لا توجد مجموعات متاحة"
          description="أضف مجموعة لهذا المدرس أو اربط جلسة preview به حتى يظهر تدفق الحضور."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="المدرس / الحضور"
        title="تسجيل الحضور"
        description="اختر المجموعة أولًا، ثم افتح جلسة جديدة لليوم أو راجع جلسة محفوظة لتعديلها قبل الحفظ."
        actions={
          <div className="grid gap-3 md:min-w-[340px]">
            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">المجموعة</p>
              <Select
                value={data.selectedGroup.id}
                onValueChange={(value) => {
                  setSelectedGroupId(value)
                  setSelectedSessionId(undefined)
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-[11px] bg-card">
                  <SelectValue placeholder="اختر المجموعة" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  {data.groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">الجلسة</p>
              <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                <SelectTrigger className="h-11 w-full rounded-[11px] bg-card">
                  <SelectValue placeholder="اختر الجلسة" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  <SelectItem value="draft">جلسة جديدة لليوم</SelectItem>
                  {data.sessions.map((attendanceSession) => (
                    <SelectItem key={attendanceSession.id} value={attendanceSession.id}>
                      {formatAttendanceDate(attendanceSession.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />

      <div className="dashboard-stats-grid">
        <MetricCard
          label="طلاب المجموعة"
          value={`${data.selectedGroup.studentCount}`}
          description="عدد الطلاب داخل المجموعة المحددة حاليًا."
          icon={IconUsersGroup}
          tone="primary"
        />
        <MetricCard
          label="حضور كامل"
          value={`${totals.present}`}
          description="عدد الطلاب المحددين كحاضرين في الجلسة المفتوحة."
          icon={IconCalendarCheck}
          tone="success"
        />
        <MetricCard
          label="تأخير"
          value={`${totals.late}`}
          description="عدد الطلاب المحددين كمتأخرين في الجلسة المفتوحة."
          icon={IconClock}
          tone="surface"
        />
        <MetricCard
          label="غياب"
          value={`${totals.absent}`}
          description="عدد الطلاب المحددين كغائبين قبل الحفظ."
          icon={IconChecklist}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="surface-card rounded-[var(--radius-lg-token)] border border-app-divider p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-base font-semibold text-app-text-primary">
                  {data.selectedGroup.name}
                </p>
                <p className="text-sm text-app-text-secondary">
                  {data.selectedGroup.academicYear}
                </p>
              </div>
              <Badge variant={selectedSessionId === "draft" ? "accent" : "info"}>
                {selectedSessionId === "draft" ? "جلسة جديدة" : "جلسة محفوظة"}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-app-text-secondary">
              <p>{data.selectedGroup.scheduleLabel}</p>
              <p>{data.selectedGroup.room}</p>
              <p>
                آخر جلسة:{" "}
                {data.selectedGroup.latestSession
                  ? formatAttendanceDate(data.selectedGroup.latestSession)
                  : "لا توجد جلسات سابقة"}
              </p>
            </div>
          </div>

          <div className="surface-card rounded-[var(--radius-lg-token)] border border-app-divider p-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-app-text-primary">إجراءات سريعة</p>
              <p className="text-sm leading-6 text-app-text-secondary">
                استخدمها لتجهيز الحالة الأساسية ثم عدل الحالات الفردية قبل الحفظ.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  setEditableRows((currentRows) =>
                    currentRows.map((row) => ({ ...row, status: "present" }))
                  )
                }}
              >
                تحديد الكل حاضر
              </Button>
              <Button
                variant="soft"
                size="sm"
                onClick={() => {
                  setEditableRows((currentRows) =>
                    currentRows.map((row) => ({ ...row, status: "late" }))
                  )
                }}
              >
                تحديد الكل متأخر
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setEditableRows((currentRows) =>
                    currentRows.map((row) => ({ ...row, status: "absent" }))
                  )
                }}
              >
                تحديد الكل غائب
              </Button>
            </div>

            <Button
              variant="accent"
              size="lg"
              className="mt-4 w-full"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || editableRows.length === 0}
            >
              <IconDeviceFloppy className="size-4" stroke={1.8} />
              {saveMutation.isPending
                ? "جارٍ حفظ الحضور..."
                : selectedSessionId === "draft"
                  ? "تسجيل الحضور"
                  : "حفظ التعديلات"}
            </Button>
          </div>

          <div className="surface-card rounded-[var(--radius-lg-token)] border border-app-divider p-5">
            <p className="text-sm font-semibold text-app-text-primary">الجلسات السابقة</p>
            <div className="mt-4 space-y-3">
              {data.sessions.length === 0 ? (
                <p className="text-sm leading-6 text-app-text-secondary">
                  لا توجد جلسات محفوظة لهذه المجموعة بعد. اختر "جلسة جديدة لليوم" وسجل الحضور.
                </p>
              ) : (
                data.sessions.slice(0, 5).map((attendanceSession) => (
                  <button
                    key={attendanceSession.id}
                    type="button"
                    onClick={() => setSelectedSessionId(attendanceSession.id)}
                    className="w-full rounded-[14px] border border-app-divider px-4 py-3 text-right transition hover:border-app-accent/40 hover:bg-app-surface-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-app-text-primary">
                        {formatAttendanceDate(attendanceSession.date)}
                      </span>
                      <Badge variant="outline">
                        {attendanceSession.totals.present} حاضر
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-app-text-secondary">
                      {attendanceSession.totals.late} متأخر · {attendanceSession.totals.absent} غائب
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="surface-card rounded-[var(--radius-lg-token)] border border-app-divider p-5">
          <div className="flex flex-col gap-3 border-b border-app-divider pb-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold tracking-[-0.03em] text-app-text-primary">
                {selectedSessionId === "draft" ? "تحضير جلسة جديدة" : "مراجعة جلسة محفوظة"}
              </p>
              <p className="text-sm leading-6 text-app-text-secondary">
                التاريخ: {activeSession ? formatAttendanceDate(activeSession.date) : "-"}
              </p>
            </div>
            <Badge variant={selectedSessionId === "draft" ? "accent" : "info"}>
              {editableRows.length} طالب
            </Badge>
          </div>

          <Table className="mt-4">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3 text-right">الطالب</TableHead>
                <TableHead className="py-3 text-right">الصف</TableHead>
                <TableHead className="py-3 text-right">الحالة الحالية</TableHead>
                <TableHead className="py-3 text-right">تعديل الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableRows.map((row) => (
                <TableRow key={row.studentId} className="border-app-divider/80">
                  <TableCell className="py-4 text-right">
                    <div className="space-y-1">
                      <p className="font-medium text-app-text-primary">{row.studentName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right text-app-text-secondary">
                    {row.academicYear}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Badge variant={statusBadgeVariant(row.status)}>{statusLabel(row.status)}</Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {(["present", "late", "absent"] as const).map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={statusButtonVariant(status, row.status === status)}
                          className={statusButtonClassName(status, row.status === status)}
                          onClick={() => {
                            setEditableRows((currentRows) =>
                              currentRows.map((item) =>
                                item.studentId === row.studentId ? { ...item, status } : item
                              )
                            )
                          }}
                        >
                          {statusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}
