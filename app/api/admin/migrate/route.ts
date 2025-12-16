import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run the migration SQL to add security question columns
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Student" 
        ADD COLUMN IF NOT EXISTS "securityQuestion" TEXT NOT NULL DEFAULT '';
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "Student" 
        ADD COLUMN IF NOT EXISTS "securityAnswer" TEXT NOT NULL DEFAULT '';
      `

      // Update existing records with default values
      await prisma.$executeRaw`
        UPDATE "Student" 
        SET "securityQuestion" = 'What is your favorite food?', 
            "securityAnswer" = 'default'
        WHERE "securityQuestion" = '' OR "securityAnswer" = '' OR "securityQuestion" IS NULL OR "securityAnswer" IS NULL;
      `

      return NextResponse.json({
        success: true,
        message: 'Database migration completed successfully. Security question columns have been added.',
      })
    } catch (error: any) {
      console.error('Migration error:', error)
      
      // If columns already exist, that's okay
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        return NextResponse.json({
          success: true,
          message: 'Migration columns already exist. Database is up to date.',
        })
      }
      
      throw error
    }
  } catch (error: any) {
    console.error('Migration endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Migration failed',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { status: 500 }
    )
  }
}

