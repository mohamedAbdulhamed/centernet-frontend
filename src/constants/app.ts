import type { UserRole } from "@/types/auth"

export const APP_CONFIG = {
  name: "سنتر نت",
  tagLine: "نظام تشغيلي لمراكز الدروس",
  supportEmail: "support@centernet.local",
} as const

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "الإدارة",
  teacher: "المدرس",
  parent: "ولي الأمر",
}

export const ROLE_QUICK_ACTION_LABELS: Record<UserRole, string> = {
  admin: "عرض التنبيهات",
  teacher: "متابعة الحضور",
  parent: "عرض الرسائل",
}

