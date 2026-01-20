'use client'

import { FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section 
      className="py-5 text-white reveal" 
      style={{ 
        background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      }}
    >
      <div className="container text-center">
        <h2 className="display-4 fw-bold mb-4">
          Looking for a reliable business solution partner?
        </h2>
        <p className="lead mb-5 opacity-90">
          Get in touch with us today and let's discuss how we can help you achieve your business objectives
        </p>
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3">
          <Link
            href="tel:+919876543210"
            className="btn btn-light btn-lg d-inline-flex align-items-center px-5 py-3 fw-bold"
            style={{ 
              color: '#f5576c',
              borderRadius: '10px',
              fontSize: '1.1rem'
            }}
          >
            <FiPhone className="me-2" />
            Call Now
          </Link>
          <span className="text-white opacity-75 d-none d-sm-inline">|</span>
          <Link
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg d-inline-flex align-items-center px-5 py-3 fw-bold text-white"
            style={{ 
              backgroundColor: '#25D366', 
              borderColor: '#25D366',
              borderRadius: '10px',
              fontSize: '1.1rem'
            }}
          >
            <FaWhatsapp className="me-2" />
            WhatsApp
          </Link>
          <span className="text-white opacity-75 d-none d-sm-inline">|</span>
          <Link
            href="/contact"
            className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
            style={{ 
              borderWidth: '2px',
              borderRadius: '10px',
              fontSize: '1.1rem'
            }}
          >
            Get Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
