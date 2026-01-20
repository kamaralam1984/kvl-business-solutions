'use client'

import { FiCheck, FiAward, FiUsers, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi'

const trustPoints = [
  {
    icon: FiAward,
    title: 'Professional Team',
    description: 'Experienced professionals with proven expertise',
    color: '#667eea',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  },
  {
    icon: FiUsers,
    title: 'Multi-Domain Expertise',
    description: 'Comprehensive solutions across multiple industries',
    color: '#f5576c',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    icon: FiTrendingUp,
    title: 'Government & Private Experience',
    description: 'Successfully completed projects for both sectors',
    color: '#00f2fe',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
  },
  {
    icon: FiShield,
    title: 'Reliable Support',
    description: 'Dedicated support and maintenance services',
    color: '#764ba2',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  },
  {
    icon: FiClock,
    title: 'On-time Delivery',
    description: 'Commitment to deadlines and quality standards',
    color: '#f093fb',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-5 reveal" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Why Choose Us
          </h2>
          <p className="lead text-muted">
            Trusted Partner for Reliable Business Solutions
          </p>
        </div>
        <div className="row g-4">
          {trustPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 card-hover" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                  <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={point.image}
                      alt={point.title}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(point.title)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        background: `linear-gradient(135deg, ${point.color}80 0%, ${point.color}dd 100%)`,
                      }}
                    >
                      <Icon className="text-white fs-1" style={{ zIndex: 1 }} />
                    </div>
                  </div>
                  <div className="card-body p-4 text-center">
                    <h5 className="fw-bold mb-2" style={{ color: '#0E0C1D' }}>{point.title}</h5>
                    <p className="text-muted small mb-0">{point.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
