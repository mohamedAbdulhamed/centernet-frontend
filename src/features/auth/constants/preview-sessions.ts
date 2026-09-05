import type { AuthSession, UserRole } from "@/types/auth"

const previewNames: Record<UserRole, string> = {
  admin: "أحمد حسن",
  teacher: "محمد فاروق",
  parent: "محمد حسن",
}

const previewCenters: Record<UserRole, string> = {
  admin: "مركز النخبة التعليمي",
  teacher: "مركز النخبة التعليمي",
  parent: "مركز النخبة التعليمي",
}

export function createPreviewSession(role: UserRole, email: string): AuthSession {
  const issuedAt = new Date().toISOString()

  return {
    issuedAt,
    user: {
      id: `preview-${role}`,
      name: previewNames[role],
      email,
      role,
      centerName: previewCenters[role],
    },
    tokens: {
      accessToken: `preview-${role}-access-token`,
      refreshToken: `preview-${role}-refresh-token`,
    },
  }
}

