import {
  IconAdjustments,
  IconPalette,
  IconShieldLock,
} from "@tabler/icons-react"

import { PageContainer } from "@/components/shared/page-container"
import { SectionHeader } from "@/components/shared/section-header"
import { Card } from "@/components/ui/card"

const sections = [
  {
    title: "تفضيلات المنصة",
    description: "مخصصة لاحقاً لإعدادات اللغة المحلية وتنسيقات التاريخ وكثافة لوحة التحكم.",
    icon: IconAdjustments,
  },
  {
    title: "الهوية والثيم",
    description: "رموز التصميم موجودة عالمياً الآن، ويمكن ربط أي تحكم مستقبلي بالهوية من هنا دون تغيير البنية.",
    icon: IconPalette,
  },
  {
    title: "الأمان والصلاحيات",
    description: "المسارات المحمية وصلاحيات الأدوار وتخزين التوكنات موجودة وجاهزة للمرحلة التالية.",
    icon: IconShieldLock,
  },
]

export function SettingsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="النظام / الإعدادات"
        title="الإعدادات"
        description="وحدات الإعدادات المستقبلية يمكن إضافتها هنا دون التأثير على البنية المشتركة الحالية."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="surface-card p-5 shadow-none">
            <div className="space-y-3">
              <section.icon className="size-5 text-app-accent" stroke={1.8} />
              <h3 className="text-base font-semibold text-app-text-primary">
                {section.title}
              </h3>
              <p className="text-sm leading-6 text-app-text-secondary">
                {section.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
