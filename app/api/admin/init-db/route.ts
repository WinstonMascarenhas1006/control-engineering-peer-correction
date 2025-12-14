import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// One-time database initialization endpoint
// Call this once to create tables: GET /api/admin/init-db
export async function GET() {
  try {
    // Test connection
    await prisma.$connect()
    
    // Push schema to create tables
    const { execSync } = require('child_process')
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'pipe',
      env: process.env 
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully!' 
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to initialize database',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

