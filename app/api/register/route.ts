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

    // Check if student already exists
    const existing = await prisma.student.findUnique({
      where: { myMatriculationNumber },
    })

    if (existing) {
      // Update existing record
      const student = await prisma.student.update({
        where: { myMatriculationNumber },
        data: {
          paperReceivedMatriculationNumber,
          name: name || null,
          email,
          whatsappNumber,
        },
      })

      return NextResponse.json(
        { success: true, student: { id: student.id }, updated: true },
        { status: 200 }
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
        consentGivenAt: new Date(),
      },
    })

    return NextResponse.json(
      { success: true, student: { id: student.id } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      // Try to update instead (this should have been caught earlier, but handle race condition)
      try {
        const student = await prisma.student.update({
          where: { myMatriculationNumber },
          data: {
            paperReceivedMatriculationNumber,
            name: name || null,
            email,
            whatsappNumber,
          },
        })
        return NextResponse.json(
          { success: true, student: { id: student.id }, updated: true },
          { status: 200 }
        )
      } catch (updateError) {
        // If update also fails, return error
        return NextResponse.json(
          { error: 'Registration failed' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


