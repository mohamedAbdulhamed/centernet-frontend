export type AcademicYear =
  | "الصف الأول الثانوي"
  | "الصف الثاني الثانوي"
  | "الصف الثالث الثانوي"

export type Subject =
  | "رياضيات"
  | "فيزياء"
  | "كيمياء"
  | "أحياء"
  | "لغة عربية"
  | "لغة إنجليزية"

export type StudentPerformanceBand = "excellent" | "good" | "average" | "struggling"

export type AttendanceStatus = "present" | "absent" | "late"

export type AssessmentType = "quiz" | "monthly" | "final"

export type NotificationType = "warning" | "success" | "info"

export type MessageCategory =
  | "absence"
  | "performance"
  | "appreciation"
  | "follow_up"

export interface DemoCenterProfile {
  id: string
  name: string
  branch: string
  city: string
}

export interface DemoParentProfile {
  id: string
  name: string
  phone: string
  relation: "الأب" | "الأم"
  studentId: string
}

export interface DemoStudent {
  id: string
  name: string
  gender: "ذكر" | "أنثى"
  academicYear: AcademicYear
  performanceBand: StudentPerformanceBand
  parentId: string
  enrolledGroupIds: string[]
  notes: string
}

export interface DemoTeacher {
  id: string
  name: string
  subject: Subject
  phone: string
  email: string
  assignedGroupIds: string[]
  bio: string
}

export interface DemoGroup {
  id: string
  name: string
  subject: Subject
  academicYear: AcademicYear
  teacherId: string
  room: string
  scheduleLabel: string
  capacity: number
  studentIds: string[]
}

export interface DemoAttendanceSession {
  id: string
  groupId: string
  teacherId: string
  date: string
  submittedAt: string
}

export interface DemoAttendanceRecord {
  id: string
  sessionId: string
  groupId: string
  studentId: string
  teacherId: string
  date: string
  status: AttendanceStatus
}

export interface DemoGradeRecord {
  id: string
  groupId: string
  studentId: string
  teacherId: string
  subject: Subject
  assessmentType: AssessmentType
  assessmentTitle: string
  maxScore: number
  score: number
  percentage: number
  date: string
}

export interface DemoParentMessage {
  id: string
  studentId: string
  parentId: string
  category: MessageCategory
  subject: string
  body: string
  createdAt: string
  direction: "incoming" | "outgoing"
}

export interface DemoNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string
  studentId?: string
  teacherId?: string
  groupId?: string
}

export interface StudentListItem {
  id: string
  name: string
  academicYear: AcademicYear
  parentName: string
  attendanceRate: number
  averageGrade: number
  groups: string[]
  statusLabel: string
}

export interface StudentDetails extends StudentListItem {
  notes: string
  phone: string
  relation: string
  recentAttendance: Array<{
    date: string
    groupName: string
    status: AttendanceStatus
  }>
  recentGrades: Array<{
    subject: Subject
    assessmentTitle: string
    percentage: number
    date: string
  }>
}

export interface TeacherListItem {
  id: string
  name: string
  subject: Subject
  groupNames: string[]
  studentCount: number
  attendanceCompletionRate: number
  averageStudentPerformance: number
}

export interface TeacherDetails extends TeacherListItem {
  email: string
  phone: string
  bio: string
  roster: Array<{
    groupName: string
    studentCount: number
    attendanceRate: number
    averageGrade: number
  }>
}

export interface GroupListItem {
  id: string
  name: string
  teacherName: string
  subject: Subject
  academicYear: AcademicYear
  scheduleLabel: string
  room: string
  studentCount: number
  attendanceRate: number
  averageGrade: number
}

export interface AttendanceStudentRecordItem {
  studentId: string
  studentName: string
  groupName: string
  academicYear: AcademicYear
  date: string
  status: AttendanceStatus
}

export interface TeacherAttendanceStudentRow {
  studentId: string
  studentName: string
  academicYear: AcademicYear
  status: AttendanceStatus
}

export interface TeacherAttendanceGroupOption {
  id: string
  name: string
  academicYear: AcademicYear
  scheduleLabel: string
  room: string
  studentCount: number
  latestSession: string | null
}

export interface TeacherAttendanceSessionItem {
  id: string
  date: string
  submittedAt: string
  totals: Record<AttendanceStatus, number>
  rows: TeacherAttendanceStudentRow[]
}

export interface TeacherAttendanceWorkspace {
  groups: TeacherAttendanceGroupOption[]
  selectedGroup: TeacherAttendanceGroupOption | null
  draftSession: {
    date: string
    totals: Record<AttendanceStatus, number>
    rows: TeacherAttendanceStudentRow[]
  } | null
  sessions: TeacherAttendanceSessionItem[]
}

export interface GradeStudentRecordItem {
  studentId: string
  studentName: string
  subject: Subject
  groupName: string
  groupId: string
  assessmentTitle: string
  assessmentType: AssessmentType
  score: number
  maxScore: number
  percentage: number
  date: string
}

export interface StudentGradeHistory {
  studentName: string
  academicYear: AcademicYear
  groupName: string
  averagePercentage: number
  records: GradeStudentRecordItem[]
}

export interface SaveGradeInput {
  id?: string
  studentId: string
  groupId: string
  teacherId: string
  subject: Subject
  assessmentType: AssessmentType
  assessmentTitle: string
  score: number
  maxScore: number
  date: string
}

export interface ParentListItem {
  id: string
  parentName: string
  relation: "الأب" | "الأم"
  phone: string
  studentName: string
  academicYear: AcademicYear
  attendanceRate: number
  averageGrade: number
  latestMessageSubject: string
  latestMessageDate: string
}

export interface DashboardOverview {
  totalStudents: number
  attendanceRate: number
  averageGrade: number
  teacherCount: number
}

export interface DashboardActivityItem {
  title: string
  description: string
  timestamp: string
  tone: "primary" | "accent" | "success"
}

export interface DashboardAlertItem {
  title: string
  description: string
  severity: "warning" | "error" | "info"
}
