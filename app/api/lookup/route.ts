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
    const { matriculationNumber } = body

    if (!matriculationNumber) {
      return NextResponse.json(
        { error: 'Matriculation number is required' },
        { status: 400 }
      )
    }

    // Check if the student is registered
    const student = await prisma.student.findUnique({
      where: { myMatriculationNumber: matriculationNumber },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'NOT_REGISTERED' },
        { status: 404 }
      )
    }

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

