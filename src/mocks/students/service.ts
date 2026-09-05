import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type { StudentDetails, StudentListItem } from "@/mocks/types"

function attendanceRateForStudent(studentId: string) {
  const records = database.attendanceRecords.filter((record) => record.studentId === studentId)
  const score = records.reduce((sum, record) => {
    if (record.status === "present") return sum + 1
    if (record.status === "late") return sum + 0.5
    return sum
  }, 0)

  return Number(((score / records.length) * 100).toFixed(1))
}

function averageGradeForStudent(studentId: string) {
  const grades = database.gradeRecords.filter((record) => record.studentId === studentId)
  return Number(
    (
      grades.reduce((sum, record) => sum + record.percentage, 0) / Math.max(1, grades.length)
    ).toFixed(1)
  )
}

function statusLabel(attendanceRate: number, averageGrade: number) {
  if (attendanceRate < 78 || averageGrade < 62) {
    return "يحتاج متابعة"
  }

  if (attendanceRate > 90 && averageGrade > 85) {
    return "متميز"
  }

  return "مستقر"
}

function toStudentListItem(studentId: string): StudentListItem {
  const student = database.students.find((item) => item.id === studentId)!
  const parent = database.parents.find((item) => item.id === student.parentId)!
  const groups = database.groups.filter((group) => student.enrolledGroupIds.includes(group.id))
  const attendanceRate = attendanceRateForStudent(student.id)
  const averageGrade = averageGradeForStudent(student.id)

  return {
    id: student.id,
    name: student.name,
    academicYear: student.academicYear,
    parentName: parent.name,
    attendanceRate,
    averageGrade,
    groups: groups.map((group) => group.name),
    statusLabel: statusLabel(attendanceRate, averageGrade),
  }
}

export const mockStudentService = {
  async getStudents() {
    return resolveMock(database.students.map((student) => toStudentListItem(student.id)))
  },
  async getStudentDetails(studentId: string): Promise<StudentDetails | null> {
    const student = database.students.find((item) => item.id === studentId)

    if (!student) {
      return resolveMock(null)
    }

    const parent = database.parents.find((item) => item.id === student.parentId)!
    const details = toStudentListItem(studentId)
    const recentAttendance = database.attendanceRecords
      .filter((record) => record.studentId === studentId)
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 8)
      .map((record) => ({
        date: record.date,
        groupName: database.groups.find((group) => group.id === record.groupId)?.name ?? "",
        status: record.status,
      }))
    const recentGrades = database.gradeRecords
      .filter((record) => record.studentId === studentId)
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 8)
      .map((record) => ({
        subject: record.subject,
        assessmentTitle: record.assessmentTitle,
        percentage: record.percentage,
        date: record.date,
      }))

    return resolveMock({
      ...details,
      notes: student.notes,
      phone: parent.phone,
      relation: parent.relation,
      recentAttendance,
      recentGrades,
    })
  },
}

