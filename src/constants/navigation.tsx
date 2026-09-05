import {
  IconBook2,
  IconCalendarCheck,
  IconChartHistogram,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconUsersGroup,
  IconUserSquareRounded,
  IconUserStar,
} from "@tabler/icons-react"

import { paths } from "@/app/router/paths"
import type { RoleNavigationMap, RouteMeta } from "@/types/navigation"

export const navigationByRole: RoleNavigationMap = {
  admin: [
    {
      label: "نظرة عامة",
      items: [
        {
          label: "لوحة التحكم",
          description: "متابعة مؤشرات مركز النخبة التعليمي بشكل يومي.",
          to: paths.admin.dashboard,
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      label: "الجانب الأكاديمي",
      items: [
        {
          label: "الطلاب",
          description: "سجلات الطلاب، أولياء الأمور، والمتابعة الأكاديمية.",
          to: paths.admin.students,
          icon: IconUsers,
          matcher: (pathname) => pathname.startsWith(paths.admin.students),
        },
        {
          label: "المدرسون",
          description: "إدارة الطاقم التعليمي، المجموعات، والأداء العام.",
          to: paths.admin.teachers,
          icon: IconUserStar,
          matcher: (pathname) => pathname.startsWith(paths.admin.teachers),
        },
        {
          label: "المجموعات",
          description: "المجموعات الدراسية والجداول وربطها بالطلاب والمدرسين.",
          to: paths.admin.groups,
          icon: IconUsersGroup,
        },
      ],
    },
    {
      label: "التشغيل",
      items: [
        {
          label: "الحضور",
          description: "الحضور اليومي، المتابعة، والتنبيهات التشغيلية.",
          to: paths.admin.attendance,
          icon: IconCalendarCheck,
        },
        {
          label: "الدرجات",
          description: "نتائج التقييمات والاختبارات واتجاهات الأداء.",
          to: paths.admin.grades,
          icon: IconChartHistogram,
        },
        {
          label: "أولياء الأمور",
          description: "التواصل مع أولياء الأمور والرسائل والمتابعة.",
          to: paths.admin.parents,
          icon: IconUserSquareRounded,
        },
      ],
    },
    {
      label: "النظام",
      items: [
        {
          label: "الإعدادات",
          description: "إعدادات المنصة والعرض والتفضيلات العامة.",
          to: paths.admin.settings,
          icon: IconSettings,
        },
      ],
    },
  ],
  teacher: [
    {
      label: "نظرة عامة",
      items: [
        {
          label: "لوحة التحكم",
          description: "ملخص التدريس، الحضور، والمهام اليومية.",
          to: paths.teacher.dashboard,
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      label: "التدريس",
      items: [
        {
          label: "المجموعات",
          description: "المجموعات المسندة للمدرس والجداول الحالية.",
          to: paths.teacher.groups,
          icon: IconUsersGroup,
        },
        {
          label: "الحضور",
          description: "جلسات الحضور وسجل المتابعة اليومية.",
          to: paths.teacher.attendance,
          icon: IconCalendarCheck,
        },
        {
          label: "الدرجات",
          description: "التقييمات، التصحيح، ورفع النتائج.",
          to: paths.teacher.grades,
          icon: IconBook2,
        },
      ],
    },
    {
      label: "الحساب",
      items: [
        {
          label: "الإعدادات",
          description: "إعدادات الحساب والتنبيهات الشخصية.",
          to: paths.teacher.settings,
          icon: IconSettings,
        },
      ],
    },
  ],
  parent: [
    {
      label: "نظرة عامة",
      items: [
        {
          label: "لوحة التحكم",
          description: "ملخص تقدم الطالب وآخر التنبيهات.",
          to: paths.parent.dashboard,
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      label: "التقدم",
      items: [
        {
          label: "الحضور",
          description: "متابعة الحضور الأسبوعي والغياب المتكرر.",
          to: paths.parent.attendance,
          icon: IconCalendarCheck,
        },
        {
          label: "الدرجات",
          description: "درجات الطالب وآخر نتائج التقييمات.",
          to: paths.parent.grades,
          icon: IconChartHistogram,
        },
      ],
    },
    {
      label: "الحساب",
      items: [
        {
          label: "الإعدادات",
          description: "تفضيلات الحساب والعناصر الخاصة بولي الأمر.",
          to: paths.parent.settings,
          icon: IconSettings,
        },
      ],
    },
  ],
}

export const standaloneRouteMeta: RouteMeta[] = [
  {
    pattern: paths.admin.studentDetailsPattern,
    title: "ملف الطالب",
    description: "تفاصيل الطالب، الحضور، والدرجات والملاحظات.",
  },
  {
    pattern: paths.admin.teacherDetailsPattern,
    title: "ملف المدرس",
    description: "مجموعات المدرس ومؤشرات الأداء والمتابعة الأكاديمية.",
  },
  {
    pattern: paths.login,
    title: "الدخول إلى المنصة",
    description: "واجهة دخول عربية جاهزة للعرض وربط المصادقة لاحقاً.",
  },
]

