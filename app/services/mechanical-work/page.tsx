import Link from 'next/link'

export default function MechanicalWorkPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Mechanical Work</h1>
          <p className="lead">Industrial Mechanical Services & Fabrication</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Industrial Mechanical Services</h2>
              <p className="text-muted mb-3">
                Industrial operations depend on reliable mechanical systems for productivity, efficiency, and safety. Our industrial mechanical services encompass installation, maintenance, repair, and optimization of various mechanical equipment and systems used in manufacturing, processing, and industrial facilities. We work with a wide range of machinery including pumps, compressors, conveyors, material handling equipment, production machinery, and industrial automation systems.
              </p>
              <p className="text-muted mb-3">
                Our team of experienced mechanical engineers and technicians brings deep expertise in industrial equipment, understanding the complexities of different systems and their operational requirements. We provide comprehensive services including equipment installation, alignment, calibration, preventive maintenance, troubleshooting, and emergency repairs. Our approach emphasizes proactive maintenance to minimize downtime, extend equipment lifespan, and ensure optimal performance.
              </p>
              <p className="text-muted">
                We understand that industrial downtime can be costly, which is why we prioritize rapid response times and efficient problem-solving. Our technicians are trained on multiple equipment brands and technologies, enabling us to service a wide variety of machinery. We maintain an inventory of commonly needed parts and work with reliable suppliers to ensure quick access to components when repairs are needed. Our industrial mechanical services help businesses maintain continuous operations, reduce maintenance costs, and improve overall equipment effectiveness.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
                alt="Industrial Mechanical Services"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Fabrication & Maintenance</h2>
              <p className="text-muted mb-3">
                Custom fabrication services enable businesses to obtain precisely designed and manufactured components, structures, and equipment tailored to their specific requirements. Our fabrication capabilities include metalworking, welding, machining, sheet metal work, structural fabrication, and custom equipment manufacturing. We work with various materials including steel, aluminum, stainless steel, and other metals, utilizing modern fabrication techniques and quality control processes.
              </p>
              <p className="text-muted mb-3">
                Our fabrication services begin with understanding client requirements, creating detailed designs and specifications, and then executing fabrication with precision and quality. We have the equipment, expertise, and facilities to handle projects of various sizes, from small custom components to large structural elements. Our quality assurance processes ensure that fabricated items meet specifications, tolerances, and quality standards.
              </p>
              <p className="text-muted">
                Maintenance services complement our fabrication capabilities, ensuring that mechanical systems and equipment continue to operate reliably. Our maintenance programs include scheduled inspections, lubrication, adjustments, parts replacement, and system optimization. We develop customized maintenance schedules based on equipment type, usage patterns, and operational requirements. Our maintenance services help prevent unexpected failures, extend equipment life, maintain efficiency, and ensure safety compliance. We provide both on-site and workshop-based maintenance services, depending on equipment requirements and client preferences.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Fabrication & Maintenance"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Keep Your Operations Running Smoothly</h4>
            <p className="text-center mb-3">
              Professional mechanical services for industrial and commercial needs
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
