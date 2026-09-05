import { create } from "zustand"

import { createPreviewSession } from "@/features/auth/constants/preview-sessions"
import { authStorage } from "@/services/storage/auth-storage"
import type { AuthSession, AuthStatus, UserRole } from "@/types/auth"

interface AuthStore {
  status: AuthStatus
  isHydrated: boolean
  session: AuthSession | null
  bootstrap: () => void
  setSession: (session: AuthSession) => void
  clearSession: () => void
  signInPreview: (input: { email: string; role: UserRole }) => AuthSession
}

function anonymousState() {
  return {
    status: "anonymous" as const,
    session: null,
    isHydrated: true,
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: "checking",
  isHydrated: false,
  session: null,
  bootstrap: () => {
    const session = authStorage.getSession()

    if (!session) {
      set(anonymousState())
      return
    }

    set({
      status: "authenticated",
      session,
      isHydrated: true,
    })
  },
  setSession: (session) => {
    authStorage.setSession(session)
    set({
      status: "authenticated",
      session,
      isHydrated: true,
    })
  },
  clearSession: () => {
    authStorage.clearSession()
    set(anonymousState())
  },
  signInPreview: ({ email, role }) => {
    const session = createPreviewSession(role, email)
    authStorage.setSession(session)
    set({
      status: "authenticated",
      session,
      isHydrated: true,
    })
    return session
  },
}))

export const authSelectors = {
  session: (state: AuthStore) => state.session,
  role: (state: AuthStore) => state.session?.user.role ?? null,
  user: (state: AuthStore) => state.session?.user ?? null,
  isAuthenticated: (state: AuthStore) => state.status === "authenticated",
}
