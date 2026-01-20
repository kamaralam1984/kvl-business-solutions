'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function AboutSection() {
  return (
    <section className="py-5 reveal" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="mb-4">
              <span 
                className="badge px-3 py-2 mb-3"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                About Us
              </span>
              <h2 className="display-5 fw-bold mb-4" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                About KVL Business Solutions
              </h2>
            </div>
            <div className="mb-4">
              <p className="lead text-muted mb-3">
                KVL Business Solutions is a premier multi-service professional business organization that has established itself as a trusted partner for government departments, private companies, builders, factories, institutions, event organizers, and startups across the nation. With a comprehensive portfolio of services spanning technology, infrastructure, and human resources, we have positioned ourselves as a one-stop solution provider for diverse business needs.
              </p>
              <p className="text-muted mb-3">
                Our company was founded on the principles of excellence, integrity, and customer-centricity. We understand that modern businesses require integrated solutions that can address multiple challenges simultaneously. Whether it's developing cutting-edge software applications, installing state-of-the-art surveillance systems, managing complex construction projects, or providing skilled manpower, we bring the same level of professionalism and expertise to every engagement.
              </p>
              <p className="text-muted">
                We believe in creating value that transcends immediate deliverables, focusing on transformative outcomes that drive organizational growth and operational efficiency. Our commitment extends to providing regular updates, feature enhancements, and technical support to keep your solutions current and effective.
              </p>
            </div>
            <Link
              href="/about"
              className="btn btn-lg px-5 py-3 fw-bold d-inline-flex align-items-center text-white"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              Learn More About Us
              <FiArrowRight className="ms-2" />
            </Link>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
              <div 
                className="position-absolute"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  transform: 'rotate(-5deg)',
                  zIndex: 0,
                  top: '20px',
                  left: '20px',
                }}
              ></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="About KVL Business Solutions"
                className="img-fluid rounded shadow-lg position-relative"
                style={{ height: '500px', objectFit: 'cover', width: '100%', borderRadius: '20px', zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
