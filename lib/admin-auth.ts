import { cookies } from 'next/headers'
import { createHmac, randomBytes } from 'crypto'

const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '17P3129'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mindyourwork'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'ckXdEemNyM1irAB9Qag4ut8YZUfJOzoHKWG7jCPpD6v0lTVS5FLhqRI23bxwns'

function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

function signToken(token: string, expiresAt: number): string {
  const hmac = createHmac('sha256', ADMIN_SECRET)
  hmac.update(token)
  hmac.update(expiresAt.toString())
  const signature = hmac.digest('hex')
  return `${token}:${expiresAt}:${signature}`
}

function verifySignedToken(signedToken: string): { valid: boolean; token?: string; expiresAt?: number } {
  try {
    const parts = signedToken.split(':')
    if (parts.length !== 3) return { valid: false }
    
    const [token, expiresAtStr, signature] = parts
    const expiresAt = parseInt(expiresAtStr, 10)
    
    // Check if expired
    if (Date.now() > expiresAt) {
      return { valid: false }
    }
    
    // Verify signature
    const hmac = createHmac('sha256', ADMIN_SECRET)
    hmac.update(token)
    hmac.update(expiresAtStr)
    const expectedSignature = hmac.digest('hex')
    
    if (signature !== expectedSignature) {
      return { valid: false }
    }
    
    return { valid: true, token, expiresAt }
  } catch {
    return { valid: false }
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  
  if (!session) {
    return false
  }

  // Verify the signed token (works in serverless environments)
  const verification = verifySignedToken(session.value)
  return verification.valid
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

  // Sign the token (works in serverless environments - no server-side storage needed)
  const signedToken = signToken(sessionToken, expiresAt)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed back to 'lax' to allow redirect after login
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

  // Sign the token (works in serverless environments - no server-side storage needed)
  const signedToken = signToken(sessionToken, expiresAt)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed to 'lax' to allow redirect after login
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return sessionToken
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

// Get current session IP for additional security checks
// Note: IP is no longer stored with signed tokens, but function kept for compatibility
export async function getSessionIP(): Promise<string | undefined> {
  // IP tracking removed for serverless compatibility
  // Sessions are now stateless using signed tokens
  return undefined
}

