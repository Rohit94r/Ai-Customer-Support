type RateBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

const CLEANUP_EVERY = 200
let opsSinceCleanup = 0

function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Lightweight in-memory sliding fixed-window rate limiter.
 * Fine for single-instance / serverless warm instances; fails open if memory resets.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now()
  opsSinceCleanup += 1
  if (opsSinceCleanup >= CLEANUP_EVERY) {
    opsSinceCleanup = 0
    cleanup(now)
  }

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSec: Math.ceil(windowMs / 1000) }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}

export function clientIpFromRequest(req: { headers: Headers }): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return req.headers.get("x-real-ip") || "unknown"
}
