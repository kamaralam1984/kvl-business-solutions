'use client'

import { FiBriefcase, FiHome, FiBook, FiUsers, FiCalendar } from 'react-icons/fi'

const industries = [
  {
    icon: FiBriefcase,
    name: 'Government Projects',
    color: '#667eea',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    icon: FiHome,
    name: 'Corporate Offices',
    color: '#f5576c',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    icon: FiBook,
    name: 'Education & Industries',
    color: '#00f2fe',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
  },
  {
    icon: FiUsers,
    name: 'Educational Institutions',
    color: '#764ba2',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
  },
  {
    icon: FiCalendar,
    name: 'Event Organizations',
    color: '#f093fb',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
  },
]

export default function SolutionsSection() {
  return (
    <section className="py-5 reveal" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Solutions / Industries We Serve
          </h2>
          <p className="lead text-muted">
            Comprehensive solutions across diverse industries
          </p>
        </div>
        <div className="row g-4">
          {industries.map((industry, index) => {
            const Icon = industry.icon
            return (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 card-hover" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(industry.name)
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
                        background: `linear-gradient(135deg, ${industry.color}80 0%, ${industry.color}dd 100%)`,
                      }}
                    >
                      <Icon className="text-white fs-1" style={{ zIndex: 1 }} />
                    </div>
                  </div>
                  <div className="card-body p-4 text-center">
                    <h5 className="card-title mb-0 fw-semibold" style={{ color: '#0E0C1D' }}>
                      {industry.name}
                    </h5>
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
