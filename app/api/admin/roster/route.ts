import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
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
    console.error('Roster fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

