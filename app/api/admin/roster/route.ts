import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
      // Log unauthorized access attempt
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      console.warn(`[SECURITY] Unauthorized admin roster access attempt from IP: ${ip} at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('[SECURITY] Roster fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

