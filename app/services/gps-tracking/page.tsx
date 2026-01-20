import Link from 'next/link'

export default function GPSTrackingPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">GPS Tracking Solutions</h1>
          <p className="lead">Advanced Vehicle & Fleet Management Technology</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Vehicle Tracking</h2>
              <p className="text-muted mb-3">
                In an era where efficiency and security are paramount, GPS vehicle tracking systems have become essential tools for businesses and individuals alike. Our vehicle tracking solutions provide real-time location monitoring, route optimization, speed monitoring, and comprehensive vehicle analytics. Whether you're managing a single vehicle or an entire fleet, our tracking systems offer the visibility and control you need to optimize operations and enhance security.
              </p>
              <p className="text-muted mb-3">
                Our GPS tracking devices are compact, easy to install, and compatible with all types of vehicles including cars, trucks, buses, motorcycles, and commercial vehicles. Once installed, these devices transmit location data in real-time, allowing you to monitor vehicle movements through web-based dashboards or mobile applications. The systems provide detailed information including current location, historical routes, travel speed, idle time, and geofencing alerts.
              </p>
              <p className="text-muted">
                For individual vehicle owners, our tracking solutions offer theft prevention, recovery assistance, and peace of mind. For businesses, these systems enable better fleet management, reduce fuel costs through route optimization, improve driver behavior, and enhance customer service through accurate delivery tracking. Our vehicle tracking solutions are backed by reliable technology, comprehensive support, and user-friendly interfaces that make monitoring and management effortless.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Vehicle Tracking"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Fleet Management</h2>
              <p className="text-muted mb-3">
                Managing a fleet of vehicles presents numerous challenges including route optimization, fuel management, driver monitoring, maintenance scheduling, and cost control. Our comprehensive fleet management solutions address all these challenges through integrated GPS tracking, telematics, and management software. We provide end-to-end fleet management services that help businesses reduce operational costs, improve efficiency, and enhance safety standards.
              </p>
              <p className="text-muted mb-3">
                Our fleet management platform offers powerful features including real-time vehicle tracking, route planning and optimization, fuel consumption monitoring, driver behavior analysis, maintenance alerts, and comprehensive reporting. The system generates detailed analytics that help fleet managers make data-driven decisions, identify areas for improvement, and optimize overall fleet performance. We also provide driver mobile applications that enable two-way communication, job assignment, and proof of delivery.
              </p>
              <p className="text-muted">
                The benefits of our fleet management solutions extend beyond location tracking. Businesses experience significant cost savings through reduced fuel consumption, optimized routes, preventive maintenance, and improved driver behavior. Enhanced visibility enables better customer service through accurate ETAs and real-time updates. Safety improvements result from monitoring driver behavior, enforcing speed limits, and ensuring compliance with regulations. Our scalable solutions grow with your fleet, supporting businesses from small operations to large enterprises with hundreds of vehicles.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Fleet Management"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Live Monitoring Dashboard</h2>
              <p className="text-muted mb-3">
                Effective fleet management requires real-time visibility and actionable insights. Our live monitoring dashboard provides a centralized command center where fleet managers can monitor all vehicles simultaneously, track performance metrics, receive instant alerts, and make informed decisions. The dashboard is accessible from any device with internet connectivity, ensuring that you can manage your fleet from anywhere, at any time.
              </p>
              <p className="text-muted mb-3">
                The dashboard displays real-time vehicle locations on interactive maps, showing current status, speed, direction, and route information. Customizable views allow you to focus on specific vehicles, routes, or regions. Advanced filtering and search capabilities enable quick access to the information you need. The system provides instant notifications for various events including geofence violations, speed limit breaches, unauthorized vehicle use, and maintenance requirements.
              </p>
              <p className="text-muted">
                Comprehensive reporting features generate detailed analytics on vehicle utilization, fuel consumption, driver performance, route efficiency, and cost analysis. These reports can be scheduled for automatic generation and distribution, ensuring that stakeholders always have access to current fleet performance data. The dashboard integrates with other business systems, enabling seamless data flow and comprehensive business intelligence. Our user-friendly interface requires minimal training, and our support team is always available to assist with setup, customization, and optimization.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Live Monitoring Dashboard"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Optimize Your Fleet Operations</h4>
            <p className="text-center mb-3">
              Discover how GPS tracking can transform your vehicle and fleet management
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link
                href="/contact"
                className="btn btn-primary btn-lg px-5"
                style={{ backgroundColor: '#2E5C8A', borderColor: '#2E5C8A' }}
              >
                Get Quote
              </Link>
              <Link
                href="/services"
                className="btn btn-outline-primary btn-lg px-5"
                style={{ borderColor: '#2E5C8A', color: '#2E5C8A' }}
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
