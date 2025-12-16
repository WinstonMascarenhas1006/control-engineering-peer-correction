// Stricter rate limiting for admin endpoints
// Tracks failed login attempts and blocks IPs after multiple failures

interface AdminRateLimitStore {
  [key: string]: {
    attempts: number
    resetAt: number
    blockedUntil?: number
  }
}

const adminStore: AdminRateLimitStore = {}

const ADMIN_LOGIN_WINDOW = 15 * 60 * 1000 // 15 minutes
const ADMIN_MAX_ATTEMPTS = 5 // 5 attempts per 15 minutes
const ADMIN_BLOCK_DURATION = 60 * 60 * 1000 // Block for 1 hour after max attempts

export function adminRateLimit(ip: string): { allowed: boolean; remaining: number; blockedUntil?: number } {
  const now = Date.now()
  const key = `admin_${ip}`

  if (!adminStore[key]) {
    adminStore[key] = {
      attempts: 0,
      resetAt: now + ADMIN_LOGIN_WINDOW,
    }
  }

  const record = adminStore[key]

  // Check if IP is blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      blockedUntil: record.blockedUntil,
    }
  }

  // Reset if window expired
  if (now > record.resetAt) {
    record.attempts = 0
    record.resetAt = now + ADMIN_LOGIN_WINDOW
    record.blockedUntil = undefined
  }

  // Check if max attempts reached
  if (record.attempts >= ADMIN_MAX_ATTEMPTS) {
    if (!record.blockedUntil) {
      record.blockedUntil = now + ADMIN_BLOCK_DURATION
    }
    return {
      allowed: false,
      remaining: 0,
      blockedUntil: record.blockedUntil,
    }
  }

  record.attempts++
  return {
    allowed: true,
    remaining: ADMIN_MAX_ATTEMPTS - record.attempts,
  }
}

export function resetAdminRateLimit(ip: string) {
  const key = `admin_${ip}`
  delete adminStore[key]
}

// Clean up old records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of Object.entries(adminStore)) {
    if (now > record.resetAt && (!record.blockedUntil || now > record.blockedUntil)) {
      delete adminStore[key]
    }
  }
}, 10 * 60 * 1000) // Clean every 10 minutes

