export function hashString(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }

  return hash
}

export function ratioFromHash(seed: string) {
  return (hashString(seed) % 1000) / 1000
}

export function pickFromArray<T>(items: T[], seed: string) {
  return items[hashString(seed) % items.length]
}

export function percentage(value: number) {
  return Number(value.toFixed(1))
}

export function average(values: number[]) {
  if (!values.length) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function hoursAgo(baseDate: Date, hours: number) {
  return new Date(baseDate.getTime() - hours * 60 * 60 * 1000).toISOString()
}

export function daysAgo(baseDate: Date, days: number, hour = 18) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() - days)
  nextDate.setHours(hour, 0, 0, 0)
  return nextDate.toISOString()
}

