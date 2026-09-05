import { database } from "@/mocks/core/database"
import { average, percentage } from "@/mocks/core/utils"
import { resolveMock } from "@/mocks/core/service-utils"
import type {
  DashboardActivityItem,
  DashboardAlertItem,
  DashboardOverview,
} from "@/mocks/types"

function attendanceRateForStudent(studentId: string) {
  const records = database.attendanceRecords.filter((record) => record.studentId === studentId)
  const points = records.reduce((sum, record) => {
    if (record.status === "present") return sum + 1
    if (record.status === "late") return sum + 0.5
    return sum
  }, 0)

  return percentage((points / records.length) * 100)
}

function averageGradeForStudent(studentId: string) {
  const grades = database.gradeRecords.filter((record) => record.studentId === studentId)
  return percentage(average(grades.map((record) => record.percentage)))
}

function buildOverview(): DashboardOverview {
  const attendanceValues = database.students.map((student) => attendanceRateForStudent(student.id))
  const gradeValues = database.students.map((student) => averageGradeForStudent(student.id))

  return {
    totalStudents: database.students.length,
    attendanceRate: percentage(average(attendanceValues)),
    averageGrade: percentage(average(gradeValues)),
    teacherCount: database.teachers.length,
  }
}

function formatRelative(isoDate: string) {
  const hours = Math.max(
    1,
    Math.round((Date.now() - new Date(isoDate).getTime()) / (60 * 60 * 1000))
  )

  if (hours < 24) {
    return `منذ ${hours} ساعة`
  }

  return `منذ ${Math.round(hours / 24)} يوم`
}

export const mockDashboardService = {
  async getAdminDashboard() {
    const overview = buildOverview()
    const activities: DashboardActivityItem[] = database.notifications.slice(0, 6).map((item) => ({
      title: item.title,
      description: item.description,
      timestamp: formatRelative(item.createdAt),
      tone: item.type === "warning" ? "accent" : item.type === "success" ? "success" : "primary",
    }))

    const teacherPerformance = database.teachers.slice(0, 5).map((teacher) => {
      const grades = database.gradeRecords
        .filter((record) => record.teacherId === teacher.id)
        .map((record) => record.percentage)

      return {
        name: teacher.name,
        subject: teacher.subject,
        completionRate: percentage(average(grades)),
      }
    })

    const alerts: DashboardAlertItem[] = database.notifications.slice(0, 4).map((item) => ({
      title: item.title,
      description: item.description,
      severity: item.type === "warning" ? "warning" : item.type === "success" ? "info" : "error",
    }))

    const attendanceOverview = database.groups
      .slice(0, 3)
      .map((group) => ({
        label: group.name,
        value: `${percentage(average(group.studentIds.map((studentId) => attendanceRateForStudent(studentId))))}%`,
        progress: percentage(average(group.studentIds.map((studentId) => attendanceRateForStudent(studentId)))),
        tone: (["primary", "accent", "success"] as const)[database.groups.findIndex((item) => item.id === group.id) % 3],
      }))

    const gradeOverview = database.groups.slice(0, 3).map((group, index) => ({
      subject: group.subject,
      score: `${index === 0 ? "A" : index === 1 ? "B+" : "B"} · ${percentage(average(group.studentIds.map((studentId) => averageGradeForStudent(studentId))))}%`,
      status: (["success", "info", "warning"] as const)[index],
    }))

    return resolveMock({
      overview,
      activities,
      teacherPerformance,
      alerts,
      attendanceOverview,
      gradeOverview,
    })
  },
  async getTeacherDashboard(teacherId: string) {
    const teacher = database.teachers.find((item) => item.id === teacherId) ?? database.teachers[0]
    const groups = database.groups.filter((group) => group.teacherId === teacher.id)
    const totalStudents = new Set(groups.flatMap((group) => group.studentIds)).size

    return resolveMock({
      metrics: {
        groups: groups.length,
        sessionsToday: 2,
        gradingTasks: 18,
        students: totalStudents,
      },
      attendanceOverview: groups.slice(0, 3).map((group, index) => ({
        label: group.name,
        value: `${percentage(average(group.studentIds.map((studentId) => attendanceRateForStudent(studentId))))}%`,
        progress: percentage(average(group.studentIds.map((studentId) => attendanceRateForStudent(studentId)))),
        tone: (["success", "accent", "primary"] as const)[index % 3],
      })),
      gradeOverview: database.gradeRecords
        .filter((record) => record.teacherId === teacher.id)
        .slice(0, 3)
        .map((record, index) => ({
          subject: record.assessmentTitle,
          score: `${index === 0 ? "A-" : index === 1 ? "B" : "C+"} · ${record.percentage}%`,
          status: (["success", "info", "warning"] as const)[index % 3],
        })),
      activities: database.notifications
        .filter((notification) => notification.teacherId === teacher.id || notification.groupId && groups.some((group) => group.id === notification.groupId))
        .slice(0, 5)
        .map((item): DashboardActivityItem => ({
          title: item.title,
          description: item.description,
          timestamp: formatRelative(item.createdAt),
          tone: item.type === "warning" ? "accent" : item.type === "success" ? "success" : "primary",
        })),
    })
  },
  async getParentDashboard(studentId: string) {
    const student = database.students.find((item) => item.id === studentId) ?? database.students[0]
    const attendance = attendanceRateForStudent(student.id)
    const grade = averageGradeForStudent(student.id)

    return resolveMock({
      metrics: {
        attendance,
        latestGrade: grade,
        notifications: database.notifications.filter((item) => item.studentId === student.id).length || 3,
      },
      attendanceOverview: [
        { label: "نسبة الشهر", value: `${attendance}%`, progress: attendance, tone: "success" as const },
        { label: "آخر 4 حصص", value: `${attendance > 95 ? 100 : 75}%`, progress: attendance > 95 ? 100 : 75, tone: "accent" as const },
        { label: "الانتظام الصباحي", value: `${Math.max(70, attendance - 4)}%`, progress: Math.max(70, attendance - 4), tone: "primary" as const },
      ],
      gradeOverview: database.gradeRecords
        .filter((record) => record.studentId === student.id)
        .slice(0, 3)
        .map((record, index) => ({
          subject: record.subject,
          score: `${index === 0 ? "A" : index === 1 ? "B+" : "B"} · ${record.percentage}%`,
          status: (["success", "info", "warning"] as const)[index % 3],
        })),
      activities: database.parentMessages
        .filter((message) => message.studentId === student.id)
        .slice(0, 4)
        .map((message, index): DashboardActivityItem => ({
          title: message.subject,
          description: message.body,
          timestamp: formatRelative(message.createdAt),
          tone: (["success", "accent", "primary"] as const)[index % 3],
        })),
    })
  },
}
