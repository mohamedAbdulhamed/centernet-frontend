export function formatDashboardDate(date: Date) {
  const weekday = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "long",
  }).format(date)
  const dayMonthYear = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

  return `${weekday} · ${dayMonthYear}`
}
