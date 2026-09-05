import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockGradeService } from "@/mocks"
import type { AssessmentType, GradeStudentRecordItem } from "@/mocks/types"
import { queryKeys } from "@/services/api/query-keys"

interface GradeEntryDialogProps {
  teacherId: string
  teacherGroups: Array<{ id: string; name: string; subject: string }>
  teacherStudents: Array<{ id: string; name: string }>
  editingGrade: GradeStudentRecordItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function GradeEntryDialog({
  teacherId,
  teacherGroups,
  teacherStudents,
  editingGrade,
  open,
  onOpenChange,
  onSaved,
}: GradeEntryDialogProps) {
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data: Record<string, string> = {}
      formData.forEach((value, key) => {
        data[key] = value.toString()
      })

      return mockGradeService.saveTeacherGrade({
        id: editingGrade ? `${editingGrade.studentId}-${editingGrade.assessmentTitle}` : undefined,
        studentId: data.studentId,
        groupId: data.groupId,
        teacherId,
        subject: data.subject as import("@/mocks/types").Subject,
        assessmentType: data.assessmentType as AssessmentType,
        assessmentTitle: data.assessmentTitle,
        score: Number(data.score),
        maxScore: Number(data.maxScore),
        date: data.date,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.grades.teacher(teacherId),
      })
      toast.success(editingGrade ? "تم تعديل الدرجة بنجاح." : "تم إضافة التقييم بنجاح.")
      onSaved()
      onOpenChange(false)
    },
    onError: () => {
      toast.error("تعذر حفظ التقييم. حاول مرة أخرى.")
    },
  })

  const selectedGroup = editingGrade
    ? teacherGroups.find((g) => g.name === editingGrade.groupName)
    : teacherGroups[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[var(--radius-lg-token)] border border-border bg-card p-0 shadow-none">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{editingGrade ? "تعديل التقييم" : "إضافة تقييم جديد"}</DialogTitle>
          <DialogDescription>
            {editingGrade
              ? "قم بتحديث درجة الطالب في هذا التقييم."
              : "سجل تقييم جديد لأحد طلاب مجموعاتك."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            saveMutation.mutate(new FormData(e.currentTarget))
          }}
        >
          <div className="space-y-4 px-6 pb-6 pt-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">الطالب</p>
              <Select
                name="studentId"
                defaultValue={editingGrade?.studentId ?? teacherStudents[0]?.id}
                disabled={!!editingGrade}
                required
              >
                <SelectTrigger className="h-11 w-full rounded-[11px] bg-card">
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  {teacherStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">المجموعة</p>
              <Select
                name="groupId"
                defaultValue={selectedGroup?.id}
                required
              >
                <SelectTrigger className="h-11 w-full rounded-[11px] bg-card">
                  <SelectValue placeholder="اختر المجموعة" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  {teacherGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <input
              type="hidden"
              name="subject"
              value={selectedGroup?.subject ?? ""}
            />

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">نوع التقييم</p>
              <Select
                name="assessmentType"
                defaultValue={editingGrade?.assessmentType ?? "quiz"}
                required
              >
                <SelectTrigger className="h-11 w-full rounded-[11px] bg-card">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent className="rounded-[14px] border border-border bg-card">
                  <SelectItem value="quiz">كويز</SelectItem>
                  <SelectItem value="monthly">اختبار شهري</SelectItem>
                  <SelectItem value="final">اختبار نهائي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">عنوان التقييم</p>
              <Input
                name="assessmentTitle"
                defaultValue={editingGrade?.assessmentTitle ?? ""}
                placeholder="مثال: كويز الوحدة الثانية"
                required
                className="h-11 rounded-[11px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-app-text-secondary">الدرجة</p>
                <Input
                  name="score"
                  type="number"
                  min={0}
                  defaultValue={editingGrade?.score ?? 0}
                  required
                  className="h-11 rounded-[11px]"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-app-text-secondary">الدرجة القصوى</p>
                <Input
                  name="maxScore"
                  type="number"
                  min={1}
                  defaultValue={editingGrade?.maxScore ?? 100}
                  required
                  className="h-11 rounded-[11px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-app-text-secondary">التاريخ</p>
              <Input
                name="date"
                type="date"
                defaultValue={
                  editingGrade
                    ? new Date(editingGrade.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                required
                className="h-11 rounded-[11px]"
              />
            </div>
          </div>

          <DialogFooter className="rounded-b-[var(--radius-lg-token)] border-t border-app-divider bg-app-surface-soft/50 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? "جارٍ الحفظ..."
                : editingGrade
                  ? "حفظ التعديلات"
                  : "إضافة التقييم"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
