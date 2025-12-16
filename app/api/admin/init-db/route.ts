import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

// One-time database initialization endpoint
// Visit: https://your-app.vercel.app/api/admin/init-db
// This will create all database tables
export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    // Test connection first
    await prisma.$connect()
    
    // Create tables by running a simple query that will trigger table creation
    // Prisma will automatically create tables if they don't exist when we try to use them
    // But we need to use Prisma Migrate or db push
    
    // Since we can't run shell commands in serverless, we'll use Prisma's programmatic API
    // The simplest way is to try to query the table - if it doesn't exist, we'll get an error
    // But actually, we need to use Prisma Migrate or db push
    
    // Create tables using Prisma's schema
    // This matches the exact schema from prisma/schema.prisma
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Student" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "myMatriculationNumber" TEXT NOT NULL,
        "paperReceivedMatriculationNumber" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "whatsappNumber" TEXT NOT NULL,
        "securityQuestion" TEXT NOT NULL DEFAULT '',
        "securityAnswer" TEXT NOT NULL DEFAULT '',
        "consentGivenAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Student_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Student_myMatriculationNumber_key" UNIQUE ("myMatriculationNumber")
      );
      
      CREATE INDEX IF NOT EXISTS "Student_paperReceivedMatriculationNumber_idx" 
      ON "Student"("paperReceivedMatriculationNumber");
    `)
    
    // Add security question columns if table exists but columns don't
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Student" 
        ADD COLUMN IF NOT EXISTS "securityQuestion" TEXT NOT NULL DEFAULT '';
      `)
      
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Student" 
        ADD COLUMN IF NOT EXISTS "securityAnswer" TEXT NOT NULL DEFAULT '';
      `)
    } catch (error: any) {
      // Columns might already exist, that's okay
      if (!error.message?.includes('already exists') && !error.message?.includes('duplicate')) {
        console.warn('Could not add security question columns:', error.message)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully!' 
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    
    // If table already exists, that's okay
    if (error.message?.includes('already exists') || error.code === '42P07') {
      return NextResponse.json({ 
        success: true, 
        message: 'Database tables already exist!' 
      })
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to initialize database',
        details: error.toString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

