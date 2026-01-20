import Link from 'next/link'
import { 
  FiCode, 
  FiVideo, 
  FiMapPin, 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiCalendar 
} from 'react-icons/fi'

const services = [
  {
    id: 1,
    name: 'Software Development',
    icon: FiCode,
    description: 'Custom software solutions for businesses',
    href: '/services/software-development',
  },
  {
    id: 2,
    name: 'CCTV Installation',
    icon: FiVideo,
    description: 'Complete surveillance solutions',
    href: '/services/cctv-installation',
  },
  {
    id: 3,
    name: 'GPS Tracking',
    icon: FiMapPin,
    description: 'Vehicle and fleet management',
    href: '/services/gps-tracking',
  },
  {
    id: 4,
    name: 'Civil Work',
    icon: FiHome,
    description: 'Construction and renovation projects',
    href: '/services/civil-work',
  },
  {
    id: 5,
    name: 'Mechanical Work',
    icon: FiSettings,
    description: 'Industrial mechanical services',
    href: '/services/mechanical-work',
  },
  {
    id: 6,
    name: 'Manpower Supply',
    icon: FiUsers,
    description: 'Skilled and unskilled labor',
    href: '/services/manpower-supply',
  },
  {
    id: 7,
    name: 'Event Organizing',
    icon: FiCalendar,
    description: 'Corporate and government events',
    href: '/services/event-organizing',
  },
]

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Our Services</h1>
          <p className="lead">Comprehensive Solutions for All Your Business Needs</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start mb-3">
                        <div className="p-3 rounded me-3" style={{ backgroundColor: 'rgba(46, 92, 138, 0.1)' }}>
                          <Icon className="fs-3" style={{ color: '#2E5C8A' }} />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title fw-bold mb-2" style={{ color: '#0E0C1D' }}>
                            {service.name}
                          </h5>
                          <p className="card-text text-muted small mb-3">{service.description}</p>
                          <Link
                            href={service.href}
                            className="text-decoration-none fw-semibold"
                            style={{ color: '#2E5C8A' }}
                          >
                            Learn More →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
