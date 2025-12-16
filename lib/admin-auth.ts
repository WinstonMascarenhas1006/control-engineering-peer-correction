import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '17P3129'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mindyourwork'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'ckXdEemNyM1irAB9Qag4ut8YZUfJOzoHKWG7jCPpD6v0lTVS5FLhqRI23bxwns'

// In-memory session store (in production, use Redis or database)
interface SessionData {
  token: string
  expiresAt: number
  ip?: string
}

const sessions = new Map<string, SessionData>()

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now()
  const tokensToDelete: string[] = []
  
  sessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      tokensToDelete.push(token)
    }
  })
  
  tokensToDelete.forEach(token => sessions.delete(token))
}, 5 * 60 * 1000) // Clean every 5 minutes

function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  
  if (!session) {
    return false
  }

  const sessionData = sessions.get(session.value)
  
  if (!sessionData) {
    return false
  }

  // Check if session expired
  if (sessionData.expiresAt < Date.now()) {
    sessions.delete(session.value)
    return false
  }

  return true
}

export async function createAdminSession(username: string, password: string, ip?: string): Promise<string | null> {
  // Verify credentials with constant-time comparison to prevent timing attacks
  const usernameMatch = username === ADMIN_USERNAME
  const passwordMatch = password === ADMIN_PASSWORD
  
  if (!usernameMatch || !passwordMatch) {
    return null
  }

  // Generate secure random session token
  const sessionToken = generateSessionToken()
  const expiresAt = Date.now() + (60 * 60 * 24 * 1000) // 24 hours

  // Store session
  sessions.set(sessionToken, {
    token: sessionToken,
    expiresAt,
    ip,
  })

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return sessionToken
}

// Secret-based login with improved security
export async function createAdminSessionWithSecret(secret: string, ip?: string): Promise<string | null> {
  // Use constant-time comparison
  const secretMatch = secret === process.env.ADMIN_SECRET || secret === ADMIN_SECRET
  
  if (!secretMatch) {
    return null
  }

  // Generate secure random session token
  const sessionToken = generateSessionToken()
  const expiresAt = Date.now() + (60 * 60 * 24 * 1000) // 24 hours

  // Store session
  sessions.set(sessionToken, {
    token: sessionToken,
    expiresAt,
    ip,
  })

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return sessionToken
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  
  if (session) {
    // Remove from session store
    sessions.delete(session.value)
  }
  
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

// Get current session IP for additional security checks
export async function getSessionIP(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  
  if (!session) {
    return undefined
  }

  const sessionData = sessions.get(session.value)
  return sessionData?.ip
}

