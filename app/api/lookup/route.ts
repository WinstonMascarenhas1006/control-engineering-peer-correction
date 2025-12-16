import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
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
    const { matriculationNumber, securityAnswer } = body

    if (!matriculationNumber) {
      return NextResponse.json(
        { error: 'Matriculation number is required' },
        { status: 400 }
      )
    }

    // Check if the student is registered
    const student = await prisma.student.findUnique({
      where: { myMatriculationNumber: matriculationNumber },
      select: {
        id: true,
        securityQuestion: true,
        securityAnswer: true,
        paperReceivedMatriculationNumber: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'NOT_REGISTERED' },
        { status: 404 }
      )
    }

    // If security answer is not provided, return the security question
    if (!securityAnswer) {
      return NextResponse.json({
        requiresSecurityAnswer: true,
        securityQuestion: student.securityQuestion,
      })
    }

    // Verify security answer (case-insensitive comparison)
    const providedAnswer = securityAnswer.trim().toLowerCase()
    const storedAnswer = student.securityAnswer.toLowerCase()

    if (providedAnswer !== storedAnswer) {
      return NextResponse.json(
        { error: 'INVALID_SECURITY_ANSWER', message: 'Incorrect security answer. Please try again.' },
        { status: 401 }
      )
    }

    // Security answer is correct, now return the corrector information
    // Find the corrector (student who has this student's paper)
    const corrector = await prisma.student.findFirst({
      where: {
        paperReceivedMatriculationNumber: matriculationNumber,
      },
      select: {
        name: true,
        email: true,
        whatsappNumber: true,
        myMatriculationNumber: true,
      },
    })

    // Get info about whose paper this student is correcting
    const myPaperInfo = student.paperReceivedMatriculationNumber

    return NextResponse.json({
      corrector: corrector || null,
      myPaperInfo: myPaperInfo || null,
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

