import axios from "axios"

import { env } from "@/lib/env"
import { attachInterceptors } from "@/services/api/interceptors"

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

attachInterceptors(apiClient)
