import { IconCompassOff } from "@tabler/icons-react"
import { Navigate, useNavigate } from "react-router-dom"

import { roleHomePaths, paths } from "@/app/router/paths"
import { EmptyState } from "@/components/feedback/empty-state"
import { PageContainer } from "@/components/shared/page-container"
import { Button } from "@/components/ui/button"
import { authSelectors, useAuthStore } from "@/features/auth/store/auth.store"

export function NotFoundPage() {
  const navigate = useNavigate()
  const role = useAuthStore(authSelectors.role)
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated)

  if (isAuthenticated && role) {
    return <Navigate to={roleHomePaths[role]} replace />
  }

  return (
    <div className="min-h-screen bg-app-bg-main p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-xl-token)] border border-border bg-card p-6 md:p-8">
        <PageContainer>
          <EmptyState
            icon={IconCompassOff}
            title="هذا المسار خارج نطاق المنصة الحالية."
            description="البنية الحالية تحتوي على مناطق محمية بحسب الدور، لكن هذا الرابط لا يطابق أي وحدة مفعلة الآن."
            action={
              <Button variant="accent" onClick={() => navigate(paths.login)}>
                العودة إلى تسجيل الدخول
              </Button>
            }
          />
        </PageContainer>
      </div>
    </div>
  )
}
