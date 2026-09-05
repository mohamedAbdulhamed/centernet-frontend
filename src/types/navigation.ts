import type { TablerIcon } from "@tabler/icons-react"

import type { UserRole } from "@/types/auth"

export interface NavigationItem {
  label: string
  description: string
  to: string
  icon: TablerIcon
  badge?: string
  matcher?: (pathname: string) => boolean
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export type RoleNavigationMap = Record<UserRole, NavigationGroup[]>

export interface RouteMeta {
  pattern: string
  title: string
  description: string
}
