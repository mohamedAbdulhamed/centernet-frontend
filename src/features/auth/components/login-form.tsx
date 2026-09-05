import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { roleHomePaths } from "@/app/router/paths"
import { FormFieldShell } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_LABELS } from "@/constants/app"
import {
  type LoginFormValues,
  loginFormSchema,
} from "@/features/auth/model/login-form.schema"
import { useAuthStore } from "@/features/auth/store/auth.store"

export function LoginForm() {
  const navigate = useNavigate()
  const signInPreview = useAuthStore((state) => state.signInPreview)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "admin@centernet.app",
      password: "Preview123!",
      role: "admin",
    },
  })
// TODO: add real authentication
  const handleSubmit = form.handleSubmit((values) => {
    const session = signInPreview({
      email: values.email,
      role: values.role,
    })

    toast.success(`تم تجهيز نظام ${ROLE_LABELS[values.role]}.`)
    navigate(roleHomePaths[session.user.role], { replace: true })
  })

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <FormFieldShell
        label="البريد الإلكتروني"
        hint="البريد الإلكتروني وكلمة المرور لأولياء الأمور يمكن الحصول عليهما من خلال إدارة السنتر."
        error={form.formState.errors.email?.message}
      >
        <Input
          type="email"
          placeholder="admin@centernet.app"
          autoComplete="email"
          className="h-11 rounded-[11px] bg-card"
          {...form.register("email")}
        />
      </FormFieldShell>
{/* TODO: add a show password toggle button */}
      <FormFieldShell
        label="كلمة المرور"
        hint=""
        error={form.formState.errors.password?.message}
      >
        <Input
          type="password"
          placeholder="********"
          autoComplete="current-password"
          className="h-11 rounded-[11px] bg-card"
          {...form.register("password")}
        />
      </FormFieldShell>

      <FormFieldShell
        label="نوع الحساب"
        hint="الدور المختار يحدد صلاحية الوصول والمسارات وتخطيط لوحة التحكم."
        error={form.formState.errors.role?.message}
      >
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 rounded-[11px] bg-card">
                <SelectValue placeholder="اختر نوع الحساب" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px] border border-border bg-card">
                <SelectItem value="admin">الإدارة</SelectItem>
                <SelectItem value="teacher">المدرس</SelectItem>
                <SelectItem value="parent">ولي الأمر</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldShell>

      <Button type="submit" variant="accent" className="h-11 rounded-[11px] text-sm font-semibold">
        دخول إلى المنصة التجريبية
      </Button>
    </form>
  )
}
