import Link from 'next/link'

export default function ManpowerSupplyPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Manpower Supply</h1>
          <p className="lead">Skilled & Unskilled Labor Solutions</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Skilled & Unskilled Labor</h2>
              <p className="text-muted mb-3">
                Workforce requirements vary significantly across industries and projects, and finding the right people with appropriate skills can be challenging. Our manpower supply services provide access to a pool of skilled and unskilled workers who are pre-screened, verified, and ready to contribute to your projects. We understand that workforce quality directly impacts project success, which is why we maintain rigorous selection and verification processes.
              </p>
              <p className="text-muted mb-3">
                Our skilled labor pool includes professionals such as electricians, plumbers, carpenters, welders, masons, machine operators, technicians, and other tradespeople with verified qualifications and experience. We ensure that skilled workers possess necessary certifications, have relevant experience, and demonstrate competence in their respective fields. For unskilled labor, we provide workers who are physically fit, reliable, and willing to learn and adapt to different work environments.
              </p>
              <p className="text-muted">
                We maintain detailed profiles of all workers including skills, experience, certifications, and background verification. This enables us to match the right people to specific project requirements. Our manpower supply services are flexible, allowing clients to engage workers for short-term projects, long-term assignments, or ongoing operations. We handle all administrative aspects including documentation, payroll management, and compliance, allowing clients to focus on their core operations while we manage the workforce.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
                alt="Manpower Supply"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Office Staff</h2>
              <p className="text-muted mb-3">
                Modern businesses require competent office staff to handle administrative tasks, customer service, data management, and day-to-day operations. Our office staff supply services provide qualified professionals including receptionists, administrative assistants, data entry operators, customer service representatives, accountants, and other office support personnel. We understand that office staff are often the first point of contact with clients and play a crucial role in business operations.
              </p>
              <p className="text-muted mb-3">
                Our office staff candidates undergo thorough screening including educational verification, skill assessments, background checks, and reference verification. We match candidates to positions based on qualifications, experience, personality fit, and specific job requirements. Our office staff are trained in professional communication, computer skills, and workplace etiquette, ensuring they can integrate seamlessly into your organization and contribute effectively from day one.
              </p>
              <p className="text-muted">
                We provide flexible staffing solutions including temporary placements, contract staffing, and permanent placements. Our services are particularly valuable for businesses experiencing seasonal fluctuations, special projects, staff absences, or growth phases. We handle all employment-related documentation, payroll processing, and compliance requirements, making it easy for businesses to scale their workforce up or down as needed. Our commitment extends to ensuring that office staff are reliable, professional, and aligned with your organizational culture and values.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Office Staff"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Technical Manpower</h2>
              <p className="text-muted mb-3">
                Technical projects require specialized expertise that may not be available in-house or may be needed for specific project phases. Our technical manpower supply services provide access to qualified engineers, technicians, IT professionals, and other technical specialists who can contribute to projects requiring specialized knowledge and skills. We maintain a network of technical professionals across various domains including civil engineering, mechanical engineering, electrical engineering, software development, and IT support.
              </p>
              <p className="text-muted mb-3">
                Our technical manpower includes professionals with relevant degrees, certifications, and proven experience in their respective fields. We verify qualifications, check references, and assess technical competence before placement. Technical staff are matched to projects based on specific skill requirements, experience level, and project duration. Whether you need technical professionals for design work, project supervision, quality control, system implementation, or technical support, we can provide the right expertise.
              </p>
              <p className="text-muted">
                Technical manpower supply is particularly valuable for projects with specific technical requirements, peak workload periods, or specialized tasks that don't justify full-time positions. We provide technical professionals who can work independently, integrate with existing teams, and deliver quality outcomes. Our services include both on-site and remote technical support, depending on project requirements. We ensure that technical staff are up-to-date with industry standards, technologies, and best practices, enabling them to contribute effectively to your projects and help achieve technical objectives.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                alt="Technical Manpower"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Find the Right People for Your Projects</h4>
            <p className="text-center mb-3">
              Reliable manpower supply services for all your workforce needs
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
