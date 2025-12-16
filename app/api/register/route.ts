import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request)
  const rateLimitResult = rateLimit(ip)
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const {
    myMatriculationNumber,
    paperReceivedMatriculationNumber,
    name,
    email,
    whatsappNumber,
    securityQuestion,
    securityAnswer,
  } = body

  try {
    // Validation
    if (!myMatriculationNumber || !paperReceivedMatriculationNumber) {
      return NextResponse.json(
        { error: 'Matriculation numbers are required' },
        { status: 400 }
      )
    }

    if (myMatriculationNumber === paperReceivedMatriculationNumber) {
      return NextResponse.json(
        { error: 'Matriculation numbers cannot be the same' },
        { status: 400 }
      )
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!whatsappNumber || !/^\+?[1-9]\d{1,14}$/.test(whatsappNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Valid WhatsApp number is required (include country code)' },
        { status: 400 }
      )
    }

    if (!securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { error: 'Security question and answer are required' },
        { status: 400 }
      )
    }

    if (securityAnswer.trim().length < 3) {
      return NextResponse.json(
        { error: 'Security answer must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Check if student already exists
    const existing = await prisma.student.findUnique({
      where: { myMatriculationNumber },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Matriculation number ${myMatriculationNumber} is already registered.` },
        { status: 409 } // 409 Conflict
      )
    }

    // Auto-migrate: Add security question columns if they don't exist
    // This runs silently - if it fails, we'll catch it in the create() call below
    try {
      await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'Student' AND column_name = 'securityQuestion'
          ) THEN
            ALTER TABLE "Student" ADD COLUMN "securityQuestion" TEXT NOT NULL DEFAULT '';
          END IF;
        END $$;
      `)
      
      await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'Student' AND column_name = 'securityAnswer'
          ) THEN
            ALTER TABLE "Student" ADD COLUMN "securityAnswer" TEXT NOT NULL DEFAULT '';
          END IF;
        END $$;
      `)
    } catch (migrationError: any) {
      // Silently ignore - we'll handle it in the create() call if needed
      console.log('Migration check completed (columns may already exist)')
    }

    // Create new registration
    const student = await prisma.student.create({
      data: {
        myMatriculationNumber,
        paperReceivedMatriculationNumber,
        name: name || null,
        email,
        whatsappNumber,
        securityQuestion: securityQuestion.trim(),
        securityAnswer: securityAnswer.trim().toLowerCase(), // Store lowercase for case-insensitive comparison
        consentGivenAt: new Date(),
      },
    })

    return NextResponse.json(
      { success: true, student: { id: student.id } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `Matriculation number ${myMatriculationNumber} is already registered.` },
        { status: 409 } // 409 Conflict
      )
    }

    // Handle database schema mismatch - silently retry with migration
    if (error.message && (
      error.message.includes('Unknown column') || 
      (error.message.includes('column') && error.message.includes('does not exist')) ||
      (error.message.includes('securityQuestion') && !error.message.includes('already')) ||
      (error.message.includes('securityAnswer') && !error.message.includes('already')) ||
      error.code === 'P2021' // Table does not exist
    )) {
      // Silently try to add columns and retry
      try {
        // Use a more robust migration approach
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'Student' 
              AND column_name = 'securityQuestion'
            ) THEN
              ALTER TABLE "Student" ADD COLUMN "securityQuestion" TEXT NOT NULL DEFAULT '';
            END IF;
          END $$;
        `)
        
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'Student' 
              AND column_name = 'securityAnswer'
            ) THEN
              ALTER TABLE "Student" ADD COLUMN "securityAnswer" TEXT NOT NULL DEFAULT '';
            END IF;
          END $$;
        `)
        
        // Retry the registration silently
        const student = await prisma.student.create({
          data: {
            myMatriculationNumber,
            paperReceivedMatriculationNumber,
            name: name || null,
            email,
            whatsappNumber,
            securityQuestion: securityQuestion.trim(),
            securityAnswer: securityAnswer.trim().toLowerCase(),
            consentGivenAt: new Date(),
          },
        })
        
        return NextResponse.json(
          { success: true, student: { id: student.id } },
          { status: 201 }
        )
      } catch (retryError: any) {
        // If retry fails, log but don't expose schema issues to user
        console.error('Auto-migration retry failed:', retryError)
        // Fall through to generic error handling
      }
    }

    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Internal server error'
      : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    )
  }
}


