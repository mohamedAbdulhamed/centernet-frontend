import type { PropsWithChildren, ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps extends PropsWithChildren {
  trigger?: ReactNode
  title: string
  description?: string
  footer?: ReactNode
}

export function Modal({ trigger, title, description, footer, children }: ModalProps) {
  return (
    <Dialog>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="rounded-[var(--radius-lg-token)] border border-border bg-card p-0 shadow-none">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="px-6 pb-6 pt-4">{children}</div>
        {footer ? (
          <DialogFooter className="rounded-b-[var(--radius-lg-token)] border-t border-app-divider bg-app-surface-soft/50">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
