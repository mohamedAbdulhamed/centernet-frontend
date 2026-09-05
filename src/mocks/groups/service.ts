import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type { GroupListItem } from "@/mocks/types"

function attendanceRate(groupId: string) {
  const records = database.attendanceRecords.filter((record) => record.groupId === groupId)
  const points = records.reduce((sum, record) => {
    if (record.status === "present") return sum + 1
    if (record.status === "late") return sum + 0.5
    return sum
  }, 0)

  return Number(((points / records.length) * 100).toFixed(1))
}

function averageGrade(groupId: string) {
  const records = database.gradeRecords.filter((record) => record.groupId === groupId)
  return Number(
    (
      records.reduce((sum, record) => sum + record.percentage, 0) / Math.max(1, records.length)
    ).toFixed(1)
  )
}

export const mockGroupService = {
  async getGroups(teacherId?: string): Promise<GroupListItem[]> {
    const result = database.groups
      .filter((group) => !teacherId || group.teacherId === teacherId)
      .map((group) => ({
        id: group.id,
        name: group.name,
        teacherName: database.teachers.find((teacher) => teacher.id === group.teacherId)?.name ?? "",
        subject: group.subject,
        academicYear: group.academicYear,
        scheduleLabel: group.scheduleLabel,
        room: group.room,
        studentCount: group.studentIds.length,
        attendanceRate: attendanceRate(group.id),
        averageGrade: averageGrade(group.id),
      }))

    return resolveMock(result)
  },
}
