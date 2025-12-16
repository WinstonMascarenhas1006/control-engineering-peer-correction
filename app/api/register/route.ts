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


