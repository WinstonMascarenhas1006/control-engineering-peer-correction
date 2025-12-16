import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, createAdminSessionWithSecret } from '@/lib/admin-auth'
import { adminRateLimit, resetAdminRateLimit } from '@/lib/admin-rate-limit'
import { getClientIP } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  
  // Apply strict rate limiting for admin login
  const rateLimitResult = adminRateLimit(ip)
  
  if (!rateLimitResult.allowed) {
    const blockedMessage = rateLimitResult.blockedUntil
      ? `Too many failed login attempts. Please try again after ${new Date(rateLimitResult.blockedUntil).toLocaleTimeString()}.`
      : 'Too many login attempts. Please try again later.'
    
    return NextResponse.json(
      { error: blockedMessage },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { username, password, secret } = body

    // Validate input to prevent injection
    if (secret && typeof secret !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    if ((username || password) && (typeof username !== 'string' || typeof password !== 'string')) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    let sessionToken: string | null = null

    // Support both username/password and secret-based login
    if (username && password) {
      sessionToken = await createAdminSession(username, password, ip)
    } else if (secret) {
      sessionToken = await createAdminSessionWithSecret(secret, ip)
    } else {
      return NextResponse.json(
        { error: 'Username and password, or secret is required' },
        { status: 400 }
      )
    }

    if (!sessionToken) {
      // Log failed attempt (don't expose which credential was wrong)
      console.warn(`[SECURITY] Failed admin login attempt from IP: ${ip} at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetAdminRateLimit(ip)
    
    // Log successful login
    console.log(`[SECURITY] Successful admin login from IP: ${ip} at ${new Date().toISOString()}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SECURITY] Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

