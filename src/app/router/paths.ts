import type { UserRole } from "@/types/auth"

export const paths = {
  root: "/",
  login: "/login",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    students: "/admin/students",
    studentDetailsPattern: "/admin/students/:id",
    studentDetails: (id: string) => `/admin/students/${id}`,
    teachers: "/admin/teachers",
    teacherDetailsPattern: "/admin/teachers/:id",
    teacherDetails: (id: string) => `/admin/teachers/${id}`,
    groups: "/admin/groups",
    attendance: "/admin/attendance",
    grades: "/admin/grades",
    parents: "/admin/parents",
    settings: "/admin/settings",
  },
  teacher: {
    root: "/teacher",
    dashboard: "/teacher/dashboard",
    groups: "/teacher/groups",
    attendance: "/teacher/attendance",
    grades: "/teacher/grades",
    settings: "/teacher/settings",
  },
  parent: {
    root: "/parent",
    dashboard: "/parent/dashboard",
    attendance: "/parent/attendance",
    grades: "/parent/grades",
    settings: "/parent/settings",
  },
} as const

export const roleHomePaths: Record<UserRole, string> = {
  admin: paths.admin.dashboard,
  teacher: paths.teacher.dashboard,
  parent: paths.parent.dashboard,
}
