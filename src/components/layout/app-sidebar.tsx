import { matchPath, NavLink, useLocation } from "react-router-dom"

import { BrandMark } from "@/components/layout/brand-mark"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navigationByRole } from "@/constants/navigation"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { getInitials } from "@/utils"

export function AppSidebar() {
  const location = useLocation()
  const session = useAuthStore(authSelectors.session)

  if (!session) {
    return null
  }

  const navigationGroups = navigationByRole[session.user.role]

  return (
    <Sidebar side="right" variant="inset" collapsible="icon" className="border-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <BrandMark
          inverted
          subLabel={
            session.user.role === "admin"
              ? "الإدارة"
              : session.user.role === "teacher"
                ? "المدرس"
                : "ولي الأمر"
          }
          className="group-data-[collapsible=icon]:justify-center"
        />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="gap-2">
            <SidebarGroupLabel className="px-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-sidebar-foreground/30">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.matcher
                    ? item.matcher(location.pathname)
                    : Boolean(matchPath({ path: item.to, end: true }, location.pathname))

                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="h-10 rounded-[10px] px-3 text-sidebar-foreground/70 data-[active=true]:bg-app-accent data-[active=true]:text-white"
                      >
                        <NavLink to={item.to}>
                          <item.icon className="size-4" stroke={1.8} />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge className="text-[10px] text-white">
                          {item.badge}
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-[14px] bg-white/5 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex size-10 items-center justify-center rounded-[11px] bg-app-accent text-sm font-semibold text-white">
            {getInitials(session.user.name)}
          </div>
          <div className="min-w-0 space-y-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-white">{session.user.name}</p>
            <div className="flex items-center gap-2">
              <span className="truncate text-xs text-sidebar-foreground/45">
                {session.user.centerName}
              </span>
              <Badge
                variant="outline"
                className="border-white/10 bg-white/10 text-[10px] text-white/75"
              >
                عرض تجريبي
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

