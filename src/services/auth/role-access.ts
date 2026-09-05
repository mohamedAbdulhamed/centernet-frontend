import { ROLE_LABELS } from "@/constants/app"
import type { UserRole } from "@/types/auth"

export function hasRequiredRole(
  currentRole: UserRole | null | undefined,
  allowedRoles: readonly UserRole[]
) {
  if (!currentRole) {
    return false
  }

  return allowedRoles.includes(currentRole)
}

export function getRoleLabel(role: UserRole) {
  return ROLE_LABELS[role]
}
