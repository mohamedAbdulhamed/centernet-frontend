import { useQuery } from "@tanstack/react-query"
import { IconBell, IconChevronDown, IconLogout, IconSparkles } from "@tabler/icons-react"

import { roleHomePaths } from "@/app/router/paths"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ROLE_LABELS, ROLE_QUICK_ACTION_LABELS } from "@/constants/app"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"
import { usePageMeta } from "@/hooks/use-page-meta"
import { useRouteMeta } from "@/hooks/use-route-meta"
import { mockNotificationService } from "@/mocks"
import { queryKeys } from "@/services/api/query-keys"
import { getInitials, formatDashboardDate } from "@/utils"

export function AppTopbar() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const session = useAuthStore(authSelectors.session)
  const routeMeta = useRouteMeta(session?.user.role)

  usePageMeta(routeMeta.title, routeMeta.description)

  const { data: notifications = [] } = useQuery({
    enabled: Boolean(session?.user.role),
    queryKey: queryKeys.notifications.list(session?.user.role ?? "guest"),
    queryFn: () => mockNotificationService.getNotifications(session?.user.role ?? "admin"),
  })

  if (!session) {
    return null
  }

  const currentDate = formatDashboardDate(new Date())

  return (
    <header className="sticky top-0 z-30 border-b border-app-divider/80 bg-background/95 px-4 py-4 backdrop-blur-sm md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-0.5 rounded-[11px] border border-border bg-card shadow-none hover:bg-app-surface-soft" />
          <div className="space-y-1">
            <p className="section-eyebrow">{ROLE_LABELS[session.user.role]}</p>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-app-text-primary">
                {routeMeta.title}
              </h2>
              <p className="text-sm leading-6 text-app-text-secondary">
                {routeMeta.description}
              </p>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-app-text-muted">
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-[11px] bg-card shadow-none"
                aria-label="التنبيهات"
              >
                <IconBell className="size-4" stroke={1.8} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[360px] rounded-[16px] border border-border bg-card p-2"
            >
              <DropdownMenuLabel className="px-2 py-2 text-app-text-primary">
                التنبيهات التشغيلية
              </DropdownMenuLabel>
              <div className="max-h-[420px] space-y-2 overflow-auto px-1 py-1">
                {notifications.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[12px] border border-app-divider bg-app-surface-soft/60 p-3"
                  >
                    <p className="text-sm font-medium text-app-text-primary">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-app-text-secondary">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="accent"
            className="h-10 rounded-[11px] px-4 text-sm font-semibold"
          >
            <IconSparkles className="size-4" stroke={1.8} />
            {ROLE_QUICK_ACTION_LABELS[session.user.role]}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-[11px] bg-card px-3 shadow-none"
              >
                <div className="flex size-8 items-center justify-center rounded-[10px] bg-app-accent text-xs font-semibold text-white">
                  {getInitials(session.user.name)}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <div className="truncate text-right text-sm font-medium text-app-text-primary">
                    {session.user.name}
                  </div>
                  <div className="truncate text-right text-xs text-app-text-muted">
                    {session.user.email}
                  </div>
                </div>
                <IconChevronDown className="size-4 text-app-text-muted" stroke={1.8} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 rounded-[16px] border border-border bg-card p-2"
            >
              <DropdownMenuLabel className="px-2 py-2 text-app-text-primary">
                مسجل الدخول بصفة {ROLE_LABELS[session.user.role]}
              </DropdownMenuLabel>
              <div className="px-2 pb-2 text-sm text-app-text-secondary">
                الجلسة الحالية تجريبية، وسيتم توجيهك إلى {roleHomePaths[session.user.role]} حتى يتم
                ربط المصادقة الخلفية.
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-[10px]"
                onClick={clearSession}
              >
                <IconLogout className="size-4" stroke={1.8} />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

