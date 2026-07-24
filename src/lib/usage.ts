/** Soft free-tier ceiling — soft messaging in dashboard; hard stop on chat API. */
export const FREE_MONTHLY_QUESTION_LIMIT = 500

export function currentPeriodKey(date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function usagePercent(used: number, limit = FREE_MONTHLY_QUESTION_LIMIT): number {
  if (limit <= 0) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

export function usageStatus(used: number, limit = FREE_MONTHLY_QUESTION_LIMIT) {
  const percent = usagePercent(used, limit)
  const remaining = Math.max(0, limit - used)
  let tone: "ok" | "warn" | "limit" = "ok"
  if (used >= limit) tone = "limit"
  else if (percent >= 80) tone = "warn"
  return { percent, remaining, tone, limit }
}
