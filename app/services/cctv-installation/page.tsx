import Link from 'next/link'

export default function CCTVInstallationPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">CCTV Installation & Surveillance Solutions</h1>
          <p className="lead">Complete Security Solutions for Your Property</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Home, Office & Factory CCTV</h2>
              <p className="text-muted mb-3">
                Security is a fundamental concern for homes, offices, and industrial facilities. Our comprehensive CCTV installation services provide round-the-clock surveillance solutions tailored to your specific security requirements. We understand that each property has unique security challenges, which is why we conduct thorough site assessments before recommending and installing the most suitable camera systems.
              </p>
              <p className="text-muted mb-3">
                For residential properties, we install discreet yet effective camera systems that protect your home and family without compromising aesthetics. Our home CCTV solutions include high-definition cameras, night vision capabilities, motion detection, and remote monitoring through mobile applications. You can monitor your property from anywhere in the world, receive instant alerts on suspicious activities, and maintain peace of mind even when you're away.
              </p>
              <p className="text-muted">
                Office and factory installations require more sophisticated systems capable of covering large areas, multiple entry points, and critical zones. We design and install comprehensive surveillance networks that include strategic camera placement, centralized monitoring systems, recording capabilities, and integration with access control systems. Our industrial CCTV solutions are built to withstand harsh environments, operate reliably 24/7, and provide clear footage for security and operational monitoring purposes.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80"
                alt="CCTV Installation"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>AMC & Maintenance</h2>
              <p className="text-muted mb-3">
                Installing a CCTV system is just the beginning; maintaining its optimal performance requires regular servicing and support. Our Annual Maintenance Contract (AMC) services ensure that your surveillance system continues to function reliably and effectively throughout its operational life. We offer comprehensive maintenance packages that include scheduled inspections, cleaning, software updates, hardware repairs, and technical support.
              </p>
              <p className="text-muted mb-3">
                Our maintenance team consists of certified technicians who are trained to work with various CCTV brands and technologies. They conduct regular health checks, identify potential issues before they become problems, and ensure that all components are functioning correctly. We maintain detailed service records, track system performance, and provide recommendations for upgrades or enhancements when necessary.
              </p>
              <p className="text-muted">
                With our AMC services, you benefit from priority support, reduced downtime, extended equipment lifespan, and cost-effective maintenance. We understand that security systems cannot afford to fail, which is why we offer rapid response times for emergency repairs and 24/7 technical support. Our maintenance contracts are flexible and can be customized to match your specific requirements, ensuring that you receive the level of service that best suits your needs and budget.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="AMC & Maintenance"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Secure Your Property Today</h4>
            <p className="text-center mb-3">
              Get professional CCTV installation and maintenance services for complete peace of mind
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
