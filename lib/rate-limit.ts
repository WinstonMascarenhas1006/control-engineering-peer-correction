// Simple in-memory rate limiting by IP
// In production, consider using Redis or a dedicated service

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const key = ip

  if (!store[key] || now > store[key].resetAt) {
    store[key] = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    }
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  store[key].count++

  if (store[key].count > RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - store[key].count,
  }
}

export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback (won't work in production but useful for local dev)
  return 'unknown'
}

