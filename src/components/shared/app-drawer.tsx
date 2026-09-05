import type { PropsWithChildren, ReactNode } from "react"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface AppDrawerProps extends PropsWithChildren {
  trigger?: ReactNode
  title: string
  description?: string
  footer?: ReactNode
}

export function AppDrawer({
  trigger,
  title,
  description,
  footer,
  children,
}: AppDrawerProps) {
  return (
    <Drawer>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent className="rounded-t-[var(--radius-xl-token)] border-border bg-card shadow-none">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? <DrawerDescription>{description}</DrawerDescription> : null}
        </DrawerHeader>
        <div className="px-4 pb-4">{children}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  )
}
