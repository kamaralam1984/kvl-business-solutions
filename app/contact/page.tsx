'use client'

import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
          <p className="lead">Get in Touch - We're Here to Help</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-6">
              <h2 className="h3 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="Your Name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control form-control-lg"
                    placeholder="+91 9942000413"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="service" className="form-label fw-semibold">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-select form-select-lg"
                  >
                    <option value="">Select a service</option>
                    <option value="software-development">Software Development</option>
                    <option value="cctv-installation">CCTV Installation</option>
                    <option value="gps-tracking">GPS Tracking</option>
                    <option value="civil-work">Civil Work</option>
                    <option value="mechanical-work">Mechanical Work</option>
                    <option value="manpower-supply">Manpower Supply</option>
                    <option value="event-organizing">Event Organizing</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-semibold">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="alert alert-success" role="alert">
                    Thank you! We'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-100 d-inline-flex align-items-center justify-content-center"
                  style={{ backgroundColor: '#2E5C8A', borderColor: '#2E5C8A' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <FiSend className="ms-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="col-lg-6">
              <h2 className="h3 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Get in Touch</h2>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
                  <div className="p-3 rounded me-3" style={{ backgroundColor: '#2E5C8A' }}>
                    <FiPhone className="text-white fs-5" />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#0E0C1D' }}>Phone</h5>
                    <a href="tel:+91 9942000413" className="text-decoration-none text-muted d-block">+91 9942000413</a>
                    
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="p-3 rounded me-3" style={{ backgroundColor: '#2E5C8A' }}>
                    <FiMail className="text-white fs-5" />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#0E0C1D' }}>Email</h5>
                    <a href="mailto:info@kvbusinesssolution.com" className="text-decoration-none text-muted d-block">info@kvbusinesssolution.com</a>
                    </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div className="p-3 rounded me-3" style={{ backgroundColor: '#2E5C8A' }}>
                    <FiMapPin className="text-white fs-5" />
                  </div>
                  <div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#0E0C1D' }}>Address</h5>
                    <p className="text-muted mb-0">
                      KVL Business Solutions<br />
                      Business District, Main Street<br />
                      City, State - 123456<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map Placeholder */}
              <div className="bg-light rounded mb-4 d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                <p className="text-muted mb-0">Google Map Integration</p>
              </div>

              {/* Quick Actions */}
              <div className="d-grid gap-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg d-inline-flex align-items-center justify-content-center"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}
                >
                  <FaWhatsapp className="me-2" />
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: '#0E0C1D', borderColor: '#0E0C1D' }}
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
