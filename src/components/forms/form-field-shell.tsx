import type { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

interface FormFieldShellProps extends PropsWithChildren {
  label: string
  hint?: string
  error?: string
  className?: string
}

export function FormFieldShell({
  label,
  hint,
  error,
  className,
  children,
}: FormFieldShellProps) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-app-text-primary">{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-app-status-error-text">{error}</span>
      ) : hint ? (
        <span className="text-sm text-app-text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
