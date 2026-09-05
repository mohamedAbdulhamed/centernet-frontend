import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type {
  AttendanceStudentRecordItem,
  AttendanceStatus,
  TeacherAttendanceGroupOption,
  TeacherAttendanceSessionItem,
  TeacherAttendanceStudentRow,
  TeacherAttendanceWorkspace,
} from "@/mocks/types"

function buildRow(record: (typeof database.attendanceRecords)[number]): AttendanceStudentRecordItem {
  const student = database.students.find((item) => item.id === record.studentId)!
  const group = database.groups.find((item) => item.id === record.groupId)!

  return {
    studentId: student.id,
    studentName: student.name,
    groupName: group.name,
    academicYear: student.academicYear,
    date: record.date,
    status: record.status,
  }
}

function compareDateDesc(left: string, right: string) {
  return right.localeCompare(left)
}

function summarizeAttendanceStatuses(
  records: Array<{ status: AttendanceStatus }>
): Record<AttendanceStatus, number> {
  return records.reduce<Record<AttendanceStatus, number>>(
    (accumulator, record) => {
      accumulator[record.status] += 1
      return accumulator
    },
    { present: 0, absent: 0, late: 0 }
  )
}

function buildTeacherAttendanceRows(
  groupId: string,
  sessionId?: string
): TeacherAttendanceStudentRow[] {
  const group = database.groups.find((item) => item.id === groupId)!
  const records = sessionId
    ? database.attendanceRecords.filter((record) => record.sessionId === sessionId)
    : []

  return group.studentIds.map((studentId) => {
    const student = database.students.find((item) => item.id === studentId)!
    const record = records.find((item) => item.studentId === studentId)

    return {
      studentId: student.id,
      studentName: student.name,
      academicYear: student.academicYear,
      status: record?.status ?? "present",
    }
  })
}

function buildTeacherGroupOption(groupId: string): TeacherAttendanceGroupOption {
  const group = database.groups.find((item) => item.id === groupId)!
  const latestSession = database.attendanceSessions
    .filter((session) => session.groupId === group.id)
    .sort((left, right) => compareDateDesc(left.date, right.date))[0]

  return {
    id: group.id,
    name: group.name,
    academicYear: group.academicYear,
    scheduleLabel: group.scheduleLabel,
    room: group.room,
    studentCount: group.studentIds.length,
    latestSession: latestSession?.date ?? null,
  }
}

function buildTeacherAttendanceSession(sessionId: string): TeacherAttendanceSessionItem {
  const session = database.attendanceSessions.find((item) => item.id === sessionId)!
  const rows = buildTeacherAttendanceRows(session.groupId, session.id)

  return {
    id: session.id,
    date: session.date,
    submittedAt: session.submittedAt,
    totals: summarizeAttendanceStatuses(rows),
    rows,
  }
}

export const mockAttendanceService = {
  async getAdminAttendanceSummary() {
    const records = database.attendanceRecords
    const recentAbsences = records
      .filter((record) => record.status !== "present")
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 16)
      .map(buildRow)

    const statusCounts = summarizeAttendanceStatuses(records)

    return resolveMock({
      totals: statusCounts,
      records: recentAbsences,
      sessionsSubmitted: database.attendanceSessions.length,
    })
  },
  async getTeacherAttendanceSummary(teacherId: string) {
    const groupIds = database.groups
      .filter((group) => group.teacherId === teacherId)
      .map((group) => group.id)

    const records = database.attendanceRecords.filter((record) => groupIds.includes(record.groupId))

    return resolveMock({
      groups: database.groups
        .filter((group) => groupIds.includes(group.id))
        .map((group) => ({
          id: group.id,
          name: group.name,
          studentCount: group.studentIds.length,
          latestSession: database.attendanceSessions
            .filter((session) => session.groupId === group.id)
            .sort((left, right) => right.date.localeCompare(left.date))[0]?.date,
        })),
      records: records
        .sort((left, right) => right.date.localeCompare(left.date))
        .slice(0, 14)
        .map(buildRow),
    })
  },
  async getTeacherAttendanceWorkspace(
    teacherId: string,
    groupId?: string
  ): Promise<TeacherAttendanceWorkspace> {
    const groups = database.groups
      .filter((group) => group.teacherId === teacherId)
      .map((group) => buildTeacherGroupOption(group.id))

    const selectedGroup = groups.find((group) => group.id === groupId) ?? groups[0] ?? null

    if (!selectedGroup) {
      return resolveMock({
        groups: [],
        selectedGroup: null,
        draftSession: null,
        sessions: [],
      })
    }

    const sessions = database.attendanceSessions
      .filter((session) => session.groupId === selectedGroup.id)
      .sort((left, right) => compareDateDesc(left.date, right.date))
      .map((session) => buildTeacherAttendanceSession(session.id))

    const draftRows = buildTeacherAttendanceRows(selectedGroup.id)

    return resolveMock({
      groups,
      selectedGroup,
      draftSession: {
        date: new Date().toISOString(),
        totals: summarizeAttendanceStatuses(draftRows),
        rows: draftRows,
      },
      sessions,
    })
  },
  async saveTeacherAttendance(input: {
    teacherId: string
    groupId: string
    sessionId?: string
    rows: TeacherAttendanceStudentRow[]
  }) {
    const now = new Date().toISOString()

    if (input.sessionId) {
      const session = database.attendanceSessions.find((item) => item.id === input.sessionId)

      input.rows.forEach((row) => {
        const record = database.attendanceRecords.find(
          (item) => item.sessionId === input.sessionId && item.studentId === row.studentId
        )

        if (record) {
          record.status = row.status
        }
      })

      if (session) {
        session.submittedAt = now
      }

      return resolveMock({
        sessionId: input.sessionId,
      })
    }

    const sessionSequence =
      database.attendanceSessions.filter((session) => session.groupId === input.groupId).length + 1
    const sessionId = `${input.groupId}-session-${sessionSequence}`

    database.attendanceSessions.unshift({
      id: sessionId,
      groupId: input.groupId,
      teacherId: input.teacherId,
      date: now,
      submittedAt: now,
    })

    input.rows.forEach((row) => {
      database.attendanceRecords.unshift({
        id: `${sessionId}-${row.studentId}`,
        sessionId,
        groupId: input.groupId,
        studentId: row.studentId,
        teacherId: input.teacherId,
        date: now,
        status: row.status,
      })
    })

    return resolveMock({
      sessionId,
    })
  },
  async getParentAttendanceSummary(studentId: string) {
    const records = database.attendanceRecords
      .filter((record) => record.studentId === studentId)
      .sort((left, right) => right.date.localeCompare(left.date))

    return resolveMock({
      attendanceRate: Number(
        (
          (records.reduce(
            (sum, record) =>
              sum + (record.status === "present" ? 1 : record.status === "late" ? 0.5 : 0),
            0
          ) /
            Math.max(1, records.length)) *
          100
        ).toFixed(1)
      ),
      records: records.slice(0, 12).map(buildRow),
    })
  },
}
