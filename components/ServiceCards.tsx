'use client'

import Link from 'next/link'
import { 
  FiCode, 
  FiVideo, 
  FiMapPin, 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiCalendar,
  FiArrowRight
} from 'react-icons/fi'

const services = [
  {
    id: 1,
    name: 'Software Development',
    icon: FiCode,
    description: 'Custom software solutions for businesses including website development, web applications, mobile apps, and custom business software tailored to your specific operational requirements.',
    href: '/services/software-development',
    gradient: 'gradient-blue',
    color: '#667eea',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
  },
  {
    id: 2,
    name: 'CCTV Installation',
    icon: FiVideo,
    description: 'Complete surveillance solutions for homes, offices, and factories with professional installation, maintenance contracts, and round-the-clock monitoring capabilities.',
    href: '/services/cctv-installation',
    gradient: 'gradient-orange',
    color: '#f5576c',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80',
  },
  {
    id: 3,
    name: 'GPS Tracking',
    icon: FiMapPin,
    description: 'Advanced vehicle and fleet management technology with real-time tracking, route optimization, and comprehensive monitoring dashboards for enhanced operational efficiency.',
    href: '/services/gps-tracking',
    gradient: 'gradient-green',
    color: '#00f2fe',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: 4,
    name: 'Civil Work',
    icon: FiHome,
    description: 'Construction and renovation projects of all scales including government and private sector projects with professional planning, execution, and quality assurance.',
    href: '/services/civil-work',
    gradient: 'gradient-purple',
    color: '#a8edea',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
  {
    id: 5,
    name: 'Mechanical Work',
    icon: FiSettings,
    description: 'Industrial mechanical services including equipment installation, maintenance, repair, and custom fabrication services for manufacturing and industrial facilities.',
    href: '/services/mechanical-work',
    gradient: 'gradient-blue',
    color: '#667eea',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
  },
  {
    id: 6,
    name: 'Manpower Supply',
    icon: FiUsers,
    description: 'Comprehensive manpower solutions including skilled and unskilled labor, office staff, and technical professionals for various project requirements and operational needs.',
    href: '/services/manpower-supply',
    gradient: 'gradient-orange',
    color: '#f5576c',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
  },
  {
    id: 7,
    name: 'Event Organizing',
    icon: FiCalendar,
    description: 'Complete event management services for corporate and government events including stage setup, sound systems, lighting, decoration, and comprehensive event coordination.',
    href: '/services/event-organizing',
    gradient: 'gradient-green',
    color: '#00f2fe',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
  },
]

export default function ServiceCards() {
  return (
    <section className="py-5 reveal" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Our Services
          </h2>
          <p className="lead text-muted">
            One Company - Multiple Professional Solutions
          </p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm card-hover" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(service.name)
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
                        background: `linear-gradient(135deg, ${service.color}80 0%, ${service.color}dd 100%)`,
                      }}
                    >
                      <Icon className="fs-1 text-white" style={{ zIndex: 1 }} />
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-3" style={{ color: '#0E0C1D' }}>{service.name}</h5>
                    <p className="card-text text-muted mb-3" style={{ minHeight: '80px', fontSize: '0.95rem' }}>{service.description}</p>
                    <Link
                      href={service.href}
                      className="text-decoration-none fw-semibold d-inline-flex align-items-center"
                      style={{ color: service.color }}
                    >
                      Read More
                      <FiArrowRight className="ms-2" />
                    </Link>
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
