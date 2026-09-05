import axios, { AxiosHeaders, type AxiosInstance } from "axios"

import { useAuthStore } from "@/features/auth/store/auth.store"
import type { ApiError } from "@/types/api"
import { authStorage } from "@/services/storage/auth-storage"

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      message: "حدث خطأ غير متوقع.",
    }
  }

  return {
    message:
      error.response?.data?.message ||
      error.message ||
      "حدث خطأ أثناء تنفيذ الطلب.",
    status: error.response?.status,
    code: error.code,
  }
}

export function attachInterceptors(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use((config) => {
    const token = authStorage.getAccessToken()

    if (!token) {
      return config
    }

    config.headers = config.headers ?? new AxiosHeaders()
    config.headers.set("Authorization", `Bearer ${token}`)

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // عند انتهاء الجلسة الحالية نقوم بمسح الحالة المحلية لحين إضافة التحديث التلقائي.
        authStorage.clearSession()
        useAuthStore.getState().clearSession()
      }

      return Promise.reject(normalizeApiError(error))
    }
  )
}
