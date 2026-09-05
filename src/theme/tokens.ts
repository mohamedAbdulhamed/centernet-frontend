import { themeColors } from "@/theme/colors"
import { themeRadius } from "@/theme/radius"
import { themeSpacing } from "@/theme/spacing"
import { themeTypography } from "@/theme/typography"

export const dashboardGridTemplates = {
  stats: "repeat(4, minmax(0, 1fr))",
  main: "1.6fr 1fr",
  bottom: "1fr 1fr",
} as const

export const themeTokens = {
  colors: themeColors,
  radius: themeRadius,
  spacing: themeSpacing,
  typography: themeTypography,
  dashboardGridTemplates,
} as const
