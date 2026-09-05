import { Navigate, Outlet, useLocation } from "react-router-dom"

import { roleHomePaths, paths } from "@/app/router/paths"
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { hasRequiredRole } from "@/services/auth/role-access"
import type { UserRole } from "@/types/auth"

interface ProtectedRouteProps {
  allowedRoles?: readonly UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated)
  const role = useAuthStore(authSelectors.role)

  if (!isHydrated) {
    return <LoadingSkeleton variant="page" />
  }

  if (!isAuthenticated || !role) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !hasRequiredRole(role, allowedRoles)) {
    return <Navigate to={roleHomePaths[role]} replace />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated)
  const role = useAuthStore(authSelectors.role)

  if (!isHydrated) {
    return <LoadingSkeleton variant="page" />
  }

  if (isAuthenticated && role) {
    return <Navigate to={roleHomePaths[role]} replace />
  }

  return <Outlet />
}
