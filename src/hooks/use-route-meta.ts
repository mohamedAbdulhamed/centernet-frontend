import { matchPath, useLocation } from "react-router-dom"

import { navigationByRole, standaloneRouteMeta } from "@/constants/navigation"
import type { UserRole } from "@/types/auth"

export function useRouteMeta(role: UserRole | null | undefined) {
  const location = useLocation()
  const navigationGroups = role ? navigationByRole[role] : []
  const navigationItems = navigationGroups.flatMap((group) => group.items)
  const pathname = location.pathname

  const extraMeta = standaloneRouteMeta.find((route) =>
    matchPath({ path: route.pattern, end: true }, pathname)
  )

  const activeItem = navigationItems.find((item) =>
    item.matcher ? item.matcher(pathname) : item.to === pathname
  )

  return {
    title: extraMeta?.title ?? activeItem?.label ?? "المنصة",
    description:
      extraMeta?.description ??
      activeItem?.description ??
      "الواجهة التشغيلية الأساسية لمنصة سنتر نت.",
    activePath: activeItem?.to ?? pathname,
  }
}

