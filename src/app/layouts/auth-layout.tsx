import { Outlet } from "react-router-dom"

import { BrandMark } from "@/components/layout/brand-mark"
import { Badge } from "@/components/ui/badge"

const authMetrics = [
  { label: "تغطية الحضور", value: "91%" },
  { label: "عدد المدرسين", value: "14" },
  { label: "متابعة أولياء الأمور", value: "مفعلة" },
]

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-app-bg-main p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl overflow-hidden rounded-[var(--radius-xl-token)] border border-border/70 bg-card lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="hidden flex-col justify-between bg-primary px-10 py-10 text-white lg:flex">
          <div className="space-y-8">
            <BrandMark inverted subLabel="نظام إدارة التعليم الخاص" />
            <div className="space-y-4">
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white/80">
               السنتر
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white/80">
               المعلم
              </Badge>
              <Badge variant="outline" className="border-white/15 bg-white/10 text-white/80">
               ولي الأمر
              </Badge>
              <div className="space-y-3">
                <h2 className="text-4xl font-semibold tracking-[-0.05em]">
                  نظام أفضل لمتابعة الطلاب
                </h2>
                <p className="max-w-xl text-base leading-7 text-white/70">
                  الحضور، درجات الامتحان، وأولياء الأمور... كل ذلك في مكان واحد
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {authMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[16px] border border-white/10 bg-white/5 p-4"
              >
                <p className="font-mono text-[0.62rem] tracking-[0.22em] text-white/40">
                  {metric.label}
                </p>
                <p className="mt-3 font-mono text-3xl font-semibold tracking-[-0.05em]">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center bg-app-surface-soft/35 p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md space-y-6">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
