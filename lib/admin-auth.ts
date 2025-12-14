import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_USERNAME = '71791'
const ADMIN_PASSWORD = '71791'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-authenticated'

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  
  if (!session) {
    return false
  }

  // Verify session token matches our secret
  return session.value === ADMIN_SECRET
}

export async function createAdminSession(username: string, password: string): Promise<boolean> {
  // Verify credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return false
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return true
}

// Legacy support for secret-based login
export async function createAdminSessionWithSecret(secret: string): Promise<boolean> {
  if (secret !== process.env.ADMIN_SECRET && secret !== ADMIN_SECRET) {
    return false
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return true
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

