export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  dashboard: {
    overview: (role: string) => ["dashboard", "overview", role] as const,
  },
  students: {
    list: ["students", "list"] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
  teachers: {
    list: ["teachers", "list"] as const,
    detail: (id: string) => ["teachers", "detail", id] as const,
  },
  groups: {
    list: (scope = "all") => ["groups", "list", scope] as const,
  },
  attendance: {
    overview: ["attendance", "overview"] as const,
    teacher: (id: string) => ["attendance", "teacher", id] as const,
    teacherGroup: (teacherId: string, groupId: string) =>
      ["attendance", "teacher", teacherId, groupId] as const,
    parent: (id: string) => ["attendance", "parent", id] as const,
  },
  grades: {
    overview: ["grades", "overview"] as const,
    teacher: (id: string) => ["grades", "teacher", id] as const,
    teacherHistory: (teacherId: string, studentId: string) =>
      ["grades", "teacher", teacherId, "history", studentId] as const,
    parent: (id: string) => ["grades", "parent", id] as const,
  },
  parents: {
    list: ["parents", "list"] as const,
  },
  notifications: {
    list: (role: string) => ["notifications", role] as const,
  },
  parentMessages: {
    list: ["parentMessages"] as const,
  },
  settings: {
    root: ["settings"] as const,
  },
}
