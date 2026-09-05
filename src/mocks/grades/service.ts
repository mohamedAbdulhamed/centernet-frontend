import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type {
  GradeStudentRecordItem,
  SaveGradeInput,
  StudentGradeHistory,
} from "@/mocks/types"

export interface TeacherGradesFilter {
  groupId?: string
  assessmentType?: string
  searchQuery?: string
  dateFrom?: string
  dateTo?: string
}

function buildGradeRow(record: (typeof database.gradeRecords)[number]): GradeStudentRecordItem {
  const student = database.students.find((item) => item.id === record.studentId)!
  const group = database.groups.find((item) => item.id === record.groupId)!

  return {
    studentId: student.id,
    studentName: student.name,
    subject: record.subject,
    groupName: group.name,
    groupId: group.id,
    assessmentTitle: record.assessmentTitle,
    assessmentType: record.assessmentType,
    score: record.score,
    maxScore: record.maxScore,
    percentage: record.percentage,
    date: record.date,
  }
}

function filterTeacherRecords(teacherId: string, filters?: TeacherGradesFilter) {
  let records = database.gradeRecords.filter((record) => record.teacherId === teacherId)

  if (filters?.groupId && filters.groupId !== "all") {
    records = records.filter((record) => record.groupId === filters.groupId)
  }

  if (filters?.assessmentType && filters.assessmentType !== "all") {
    records = records.filter((record) => record.assessmentType === filters.assessmentType)
  }

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    records = records.filter((record) => {
      const student = database.students.find((item) => item.id === record.studentId)
      return student?.name.includes(query)
    })
  }

  if (filters?.dateFrom) {
    records = records.filter((record) => record.date >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    records = records.filter((record) => record.date <= filters.dateTo!)
  }

  return records
}

let nextGradeSequence = database.gradeRecords.length + 1

export const mockGradeService = {
  async getAdminGradesSummary() {
    const gradeRows = database.gradeRecords
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 18)
      .map(buildGradeRow)

    return resolveMock({
      averageGrade:
        database.gradeRecords.reduce((sum, record) => sum + record.percentage, 0) /
        Math.max(1, database.gradeRecords.length),
      records: gradeRows,
    })
  },
  async getTeacherGradesSummary(teacherId: string, filters?: TeacherGradesFilter) {
    const filtered = filterTeacherRecords(teacherId, filters)
      .sort((left, right) => right.date.localeCompare(left.date))

    const gradeRows = filtered.map(buildGradeRow)
    const highScores = gradeRows.filter((record) => record.percentage >= 85).length
    const supportCount = gradeRows.filter((record) => record.percentage < 65).length

    return resolveMock({
      records: gradeRows,
      totalCount: gradeRows.length,
      highScores,
      supportCount,
      completionRate: 93 + (teacherId.length % 4),
    })
  },
  async getStudentGradeHistory(studentId: string, teacherId: string): Promise<StudentGradeHistory> {
    const records = database.gradeRecords
      .filter((record) => record.studentId === studentId && record.teacherId === teacherId)
      .sort((left, right) => right.date.localeCompare(left.date))

    const student = database.students.find((item) => item.id === studentId)!
    const group = database.groups.find((item) => item.id === records[0]?.groupId)

    const averagePercentage =
      records.length > 0
        ? Math.round(
            records.reduce((sum, record) => sum + record.percentage, 0) / records.length
          )
        : 0

    return resolveMock({
      studentName: student.name,
      academicYear: student.academicYear,
      groupName: group?.name ?? "",
      averagePercentage,
      records: records.map(buildGradeRow),
    })
  },
  async saveTeacherGrade(input: SaveGradeInput) {
    const percentage = Math.round((input.score / input.maxScore) * 100)

    const existingIndex = input.id
      ? database.gradeRecords.findIndex((record) => record.id === input.id)
      : -1

    if (existingIndex >= 0) {
      const existing = database.gradeRecords[existingIndex]
      existing.score = input.score
      existing.maxScore = input.maxScore
      existing.percentage = percentage
      existing.assessmentTitle = input.assessmentTitle
      existing.assessmentType = input.assessmentType
      existing.date = input.date

      return resolveMock({
        id: existing.id,
        record: buildGradeRow(existing),
      })
    }

    const newId = `teacher-grade-${nextGradeSequence++}`
    const newRecord = {
      id: newId,
      groupId: input.groupId,
      studentId: input.studentId,
      teacherId: input.teacherId,
      subject: input.subject,
      assessmentType: input.assessmentType,
      assessmentTitle: input.assessmentTitle,
      maxScore: input.maxScore,
      score: input.score,
      percentage,
      date: input.date,
    }

    database.gradeRecords.unshift(newRecord)

    return resolveMock({
      id: newId,
      record: buildGradeRow(newRecord),
    })
  },
  async getParentGradesSummary(studentId: string) {
    const records = database.gradeRecords
      .filter((record) => record.studentId === studentId)
      .sort((left, right) => right.date.localeCompare(left.date))
      .map(buildGradeRow)

    const averageGrade =
      records.reduce((sum, record) => sum + record.percentage, 0) / Math.max(1, records.length)

    return resolveMock({
      averageGrade,
      records: records.slice(0, 12),
    })
  },
}
