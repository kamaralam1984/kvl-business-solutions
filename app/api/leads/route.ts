import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, mobile_no, source, message, step, requirements, service } = body

    // Validate required fields
    if (!name || !mobile_no || !source) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, save to database
    // Example database save:
    // const lead = await db.leads.create({
    //   data: {
    //     name,
    //     mobile_no,
    //     source, // 'website' or 'whatsapp'
    //     message: message || null,
    //     step: step || 'initial',
    //     requirements: requirements || null,
    //     service: service || null,
    //     status: 'new',
    //     created_at: new Date(),
    //   }
    // })

    // Send alert to owner (WhatsApp/Email)
    // if (source === 'whatsapp' || requirements?.includes('urgent')) {
    //   await sendOwnerAlert({
    //     type: 'New Lead',
    //     source,
    //     service,
    //     contact: mobile_no,
    //     name,
    //   })
    // }

    // For now, just log the data
    console.log('New lead created:', {
      name,
      mobile_no,
      source,
      message,
      step,
      requirements,
      service,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: true, 
        lead_id: Math.random().toString(36).substr(2, 9), // Temporary ID
        message: 'Lead saved successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    // const leads = await db.leads.findMany({
    //   orderBy: { created_at: 'desc' },
    //   take: 100,
    // })

    // For now, return empty array
    return NextResponse.json(
      { leads: [] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads.' },
      { status: 500 }
    )
  }
}
