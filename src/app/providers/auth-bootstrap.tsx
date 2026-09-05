import type { PropsWithChildren } from "react"
import { useEffect } from "react"

import { AppLoader } from "@/components/feedback/app-loader"
import { useAuthStore } from "@/features/auth/store/auth.store"

export function AuthBootstrap({ children }: PropsWithChildren) {
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (!isHydrated) {
    return <AppLoader label="يتم الآن تجهيز البنية الأساسية لمنصة سنتر نت" />
  }

  return children
}
