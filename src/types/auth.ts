export type UserRole = "admin" | "teacher" | "parent"

export type AuthStatus = "checking" | "authenticated" | "anonymous"

export interface AuthTokens {
  accessToken: string
  refreshToken?: string | null
  expiresAt?: string | null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  centerName?: string
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
  issuedAt: string
}
