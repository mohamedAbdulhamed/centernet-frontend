import type { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

interface PageContainerProps extends PropsWithChildren {
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <section className={cn("page-grid", className)}>{children}</section>
}
