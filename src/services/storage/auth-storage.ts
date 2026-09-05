import { AUTH_SESSION_STORAGE_KEY } from "@/constants/storage"
import type { AuthSession } from "@/types/auth"

function getStorage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

export const authStorage = {
  getSession(): AuthSession | null {
    const storage = getStorage()

    if (!storage) {
      return null
    }

    const rawSession = storage.getItem(AUTH_SESSION_STORAGE_KEY)

    if (!rawSession) {
      return null
    }

    try {
      return JSON.parse(rawSession) as AuthSession
    } catch {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return null
    }
  },
  setSession(session: AuthSession) {
    const storage = getStorage()

    if (!storage) {
      return
    }

    storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
  },
  clearSession() {
    const storage = getStorage()

    if (!storage) {
      return
    }

    storage.removeItem(AUTH_SESSION_STORAGE_KEY)
  },
  getAccessToken() {
    return this.getSession()?.tokens.accessToken ?? null
  },
  getRefreshToken() {
    return this.getSession()?.tokens.refreshToken ?? null
  },
}
