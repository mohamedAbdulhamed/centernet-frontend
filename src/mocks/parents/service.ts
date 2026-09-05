import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type { ParentListItem } from "@/mocks/types"

function attendanceRate(studentId: string) {
  const records = database.attendanceRecords.filter((record) => record.studentId === studentId)
  const points = records.reduce((sum, record) => {
    if (record.status === "present") return sum + 1
    if (record.status === "late") return sum + 0.5
    return sum
  }, 0)

  return Number(((points / records.length) * 100).toFixed(1))
}

function averageGrade(studentId: string) {
  const records = database.gradeRecords.filter((record) => record.studentId === studentId)
  return Number(
    (
      records.reduce((sum, record) => sum + record.percentage, 0) / Math.max(1, records.length)
    ).toFixed(1)
  )
}

export const mockParentService = {
  async getParents(): Promise<ParentListItem[]> {
    const result = database.parents.map((parent) => {
      const student = database.students.find((item) => item.id === parent.studentId)!
      const latestMessage = database.parentMessages
        .filter((message) => message.parentId === parent.id)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]

      return {
        id: parent.id,
        parentName: parent.name,
        relation: parent.relation,
        phone: parent.phone,
        studentName: student.name,
        academicYear: student.academicYear,
        attendanceRate: attendanceRate(student.id),
        averageGrade: averageGrade(student.id),
        latestMessageSubject: latestMessage?.subject ?? "لا توجد مراسلات حديثة",
        latestMessageDate: latestMessage?.createdAt ?? "",
      }
    })

    return resolveMock(result)
  },
}

