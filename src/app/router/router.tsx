import { createBrowserRouter, Navigate } from "react-router-dom"

import { ProtectedRoute, PublicOnlyRoute } from "@/app/guards/protected-route"
import { AuthLayout } from "@/app/layouts/auth-layout"
import { DashboardLayout } from "@/app/layouts/dashboard-layout"
import { NotFoundPage } from "@/app/router/not-found-page"
import { paths, roleHomePaths } from "@/app/router/paths"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { AdminAttendancePage } from "@/features/attendance/pages/admin-attendance-page"
import { ParentAttendancePage } from "@/features/attendance/pages/parent-attendance-page"
import { TeacherAttendancePage } from "@/features/attendance/pages/teacher-attendance-page"
import { LoginPage } from "@/features/auth/pages/login-page"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { AdminDashboardPage } from "@/features/dashboard/pages/admin-dashboard-page"
import { ParentDashboardPage } from "@/features/dashboard/pages/parent-dashboard-page"
import { TeacherDashboardPage } from "@/features/dashboard/pages/teacher-dashboard-page"
import { ParentGradesPage } from "@/features/grades/pages/parent-grades-page"
import { TeacherGradesPage } from "@/features/grades/pages/teacher-grades-page"
import { AdminGradesPage } from "@/features/grades/pages/admin-grades-page"
import { GroupsPage } from "@/features/groups/pages/groups-page"
import { ParentsPage } from "@/features/parents/pages/parents-page"
import { SettingsPage } from "@/features/settings/pages/settings-page"
import { StudentDetailsPage } from "@/features/students/pages/student-details-page"
import { StudentsPage } from "@/features/students/pages/students-page"
import { TeachersPage } from "@/features/teachers/pages/teachers-page"
import { TeacherDetailsPage } from "@/features/teachers/pages/teacher-details-page"

function RootRedirect() {
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated)
  const role = useAuthStore(authSelectors.role)

  if (!isHydrated) {
    return <LoadingSkeleton variant="page" />
  }

  if (isAuthenticated && role) {
    return <Navigate to={roleHomePaths[role]} replace />
  }

  return <Navigate to={paths.login} replace />
}

export const router = createBrowserRouter([
  {
    path: paths.root,
    element: <RootRedirect />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: paths.admin.root,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "students", element: <StudentsPage /> },
          { path: "students/:id", element: <StudentDetailsPage /> },
          { path: "teachers", element: <TeachersPage /> },
          { path: "teachers/:id", element: <TeacherDetailsPage /> },
          { path: "groups", element: <GroupsPage /> },
          { path: "attendance", element: <AdminAttendancePage /> },
          { path: "grades", element: <AdminGradesPage /> },
          { path: "parents", element: <ParentsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["teacher"]} />,
    children: [
      {
        path: paths.teacher.root,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <TeacherDashboardPage /> },
          { path: "groups", element: <GroupsPage /> },
          { path: "attendance", element: <TeacherAttendancePage /> },
          { path: "grades", element: <TeacherGradesPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["parent"]} />,
    children: [
      {
        path: paths.parent.root,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <ParentDashboardPage /> },
          { path: "attendance", element: <ParentAttendancePage /> },
          { path: "grades", element: <ParentGradesPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
