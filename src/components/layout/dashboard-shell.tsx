import type { PropsWithChildren } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopbar } from "@/components/layout/app-topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider className="min-h-screen bg-app-bg-main p-0 md:p-3">
      <AppSidebar />
      <SidebarInset className="min-h-screen border-0 bg-background md:min-h-[calc(100svh-1.5rem)] md:overflow-hidden md:rounded-[var(--radius-xl-token)]">
        <AppTopbar />
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-6 md:pb-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
