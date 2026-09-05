import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type { TeacherDetails, TeacherListItem } from "@/mocks/types"

function attendanceRateForGroup(groupId: string) {
  const records = database.attendanceRecords.filter((record) => record.groupId === groupId)
  const points = records.reduce((sum, record) => {
    if (record.status === "present") return sum + 1
    if (record.status === "late") return sum + 0.5
    return sum
  }, 0)

  return Number(((points / records.length) * 100).toFixed(1))
}

function averageGradeForGroup(groupId: string) {
  const records = database.gradeRecords.filter((record) => record.groupId === groupId)
  return Number(
    (
      records.reduce((sum, record) => sum + record.percentage, 0) / Math.max(1, records.length)
    ).toFixed(1)
  )
}

function buildTeacherListItem(teacherId: string): TeacherListItem {
  const teacher = database.teachers.find((item) => item.id === teacherId)!
  const groups = database.groups.filter((group) => group.teacherId === teacher.id)
  const studentCount = new Set(groups.flatMap((group) => group.studentIds)).size
  const attendanceCompletionRate = Number((92 + (teacher.id.length % 7)).toFixed(1))
  const averageStudentPerformance = Number(
    (
      groups.reduce((sum, group) => sum + averageGradeForGroup(group.id), 0) /
      Math.max(1, groups.length)
    ).toFixed(1)
  )

  return {
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    groupNames: groups.map((group) => group.name),
    studentCount,
    attendanceCompletionRate,
    averageStudentPerformance,
  }
}

export const mockTeacherService = {
  async getTeachers() {
    return resolveMock(database.teachers.map((teacher) => buildTeacherListItem(teacher.id)))
  },
  async getTeacherDetails(teacherId: string): Promise<TeacherDetails | null> {
    const teacher = database.teachers.find((item) => item.id === teacherId)

    if (!teacher) {
      return resolveMock(null)
    }

    const groups = database.groups.filter((group) => group.teacherId === teacherId)

    return resolveMock({
      ...buildTeacherListItem(teacherId),
      email: teacher.email,
      phone: teacher.phone,
      bio: teacher.bio,
      roster: groups.map((group) => ({
        groupName: group.name,
        studentCount: group.studentIds.length,
        attendanceRate: attendanceRateForGroup(group.id),
        averageGrade: averageGradeForGroup(group.id),
      })),
    })
  },
}

