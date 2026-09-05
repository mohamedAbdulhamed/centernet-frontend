import { IconLockPassword, IconShieldCheck } from "@tabler/icons-react"

import { LoginForm } from "@/features/auth/components/login-form"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function LoginPage() {
  return (
    <Card className="surface-shell border-border/80 p-6 shadow-none sm:p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="accent" className="rounded-md px-2.5 py-1">
            بنية مصادقة جاهزة
          </Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-app-text-primary">
              الدخول إلى منصة سنتر نت
            </h1>
          </div>
        </div>

        <div className="grid gap-3 rounded-[16px] border border-app-divider bg-app-surface-soft/70 p-4 text-sm text-app-text-secondary">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-4 text-app-success" stroke={1.8} />
            حماية كاملة للبيانات.
          </div>
          <div className="flex items-center gap-2">
            <IconLockPassword className="size-4 text-app-accent" stroke={1.8} />
            البريد الإلكتروني وكلمة المرور لأولياء الأمور يمكن الحصول عليهما من خلال إدارة السنتر.
          </div>
        </div>

        <LoginForm />
      </div>
    </Card>
  )
}
