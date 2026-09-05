import type { PropsWithChildren } from "react"

import { AuthBootstrap } from "@/app/providers/auth-bootstrap"
import { QueryProvider } from "@/app/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <TooltipProvider delayDuration={120}>
        <AuthBootstrap>
          {children}
          <Toaster position="top-left" closeButton />
        </AuthBootstrap>
      </TooltipProvider>
    </QueryProvider>
  )
}
