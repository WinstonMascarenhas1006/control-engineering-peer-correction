import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/admin-auth'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Peer Correction Roster')

    // Define columns
    worksheet.columns = [
      { header: 'My Matriculation Number', key: 'myMatriculationNumber', width: 25 },
      { header: 'Paper Received Matriculation Number', key: 'paperReceivedMatriculationNumber', width: 35 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'WhatsApp Number', key: 'whatsappNumber', width: 20 },
      { header: 'Consent Given At', key: 'consentGivenAt', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 },
      { header: 'Updated At', key: 'updatedAt', width: 25 },
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    }

    // Add data rows
    students.forEach((student) => {
      worksheet.addRow({
        myMatriculationNumber: student.myMatriculationNumber,
        paperReceivedMatriculationNumber: student.paperReceivedMatriculationNumber,
        name: student.name || '',
        email: student.email,
        whatsappNumber: student.whatsappNumber,
        consentGivenAt: student.consentGivenAt.toISOString(),
        createdAt: student.createdAt.toISOString(),
        updatedAt: student.updatedAt.toISOString(),
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="peer-correction-roster-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

