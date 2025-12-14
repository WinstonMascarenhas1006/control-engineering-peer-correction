import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, createAdminSessionWithSecret } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, secret } = body

    let success = false

    // Support both username/password and secret-based login
    if (username && password) {
      success = await createAdminSession(username, password)
    } else if (secret) {
      success = await createAdminSessionWithSecret(secret)
    } else {
      return NextResponse.json(
        { error: 'Username and password, or secret is required' },
        { status: 400 }
      )
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

