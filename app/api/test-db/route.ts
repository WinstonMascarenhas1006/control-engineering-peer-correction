import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Test database connection and table existence
export async function GET() {
  try {
    // Test connection
    await prisma.$connect()
    
    // Try to query the Student table
    const count = await prisma.student.count()
    
    return NextResponse.json({
      success: true,
      connected: true,
      tableExists: true,
      studentCount: count,
      message: 'Database connection successful and table exists!'
    })
  } catch (error: any) {
    // Check if it's a table doesn't exist error
    const isTableMissing = error.message?.includes('does not exist') || 
                          error.message?.includes('relation') ||
                          error.code === '42P01'
    
    return NextResponse.json({
      success: false,
      connected: !isTableMissing,
      tableExists: false,
      error: error.message,
      code: error.code,
      message: isTableMissing 
        ? 'Database connected but Student table does not exist. Run /api/admin/init-db first.'
        : 'Database connection failed. Check DATABASE_URL.'
    }, { status: 500 })
  }
}

