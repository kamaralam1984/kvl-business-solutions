import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, save to database
    // Example database save:
    // await db.leads.create({
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     source: 'website',
    //     message,
    //     service: service || null,
    //     status: 'new',
    //     created_at: new Date(),
    //   }
    // })

    // Send email notification (implement email service)
    // await sendEmail({
    //   to: 'owner@kvbusinesssolution.com',
    //   subject: 'New Contact Form Submission',
    //   body: `New lead from website\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
    // })

    // For now, just log the data
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      service,
      message,
      source: 'website',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you! We will get back to you soon.' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    )
  }
}
