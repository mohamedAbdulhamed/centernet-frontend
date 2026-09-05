export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  dashboard: {
    overview: "/dashboard/overview",
  },
  students: {
    list: "/students",
    detail: (id: string) => `/students/${id}`,
  },
  teachers: {
    list: "/teachers",
  },
  groups: {
    list: "/groups",
  },
  attendance: {
    overview: "/attendance/overview",
  },
  grades: {
    overview: "/grades/overview",
  },
  parents: {
    list: "/parents",
  },
  settings: {
    root: "/settings",
  },
} as const
