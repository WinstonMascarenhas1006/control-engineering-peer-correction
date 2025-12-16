import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      console.warn(`[SECURITY] Unauthorized admin delete attempt from IP: ${ip} at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Validate UUID format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid student ID format' },
        { status: 400 }
      )
    }

    // Verify the student exists
    const student = await prisma.student.findUnique({
      where: { id },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete the student
    await prisma.student.delete({
      where: { id },
    })

    // Log deletion for audit trail
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    console.log(`[SECURITY] Admin deleted student ${id} (${student.myMatriculationNumber}) from IP: ${ip} at ${new Date().toISOString()}`)

    return NextResponse.json({ success: true, message: 'Student deleted successfully' })
  } catch (error) {
    console.error('[SECURITY] Delete student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

