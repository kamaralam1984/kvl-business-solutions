import Link from 'next/link'

export default function CivilWorkPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Civil Work</h1>
          <p className="lead">Construction & Renovation Projects of All Scales</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Construction Services</h2>
              <p className="text-muted mb-3">
                Construction projects require meticulous planning, skilled execution, and unwavering commitment to quality and safety. Our construction services encompass a wide range of projects from residential buildings to commercial complexes, industrial facilities, and infrastructure development. We bring together experienced engineers, skilled workers, modern equipment, and proven methodologies to deliver construction projects that meet or exceed client expectations.
              </p>
              <p className="text-muted mb-3">
                Our construction approach begins with comprehensive project planning, including site surveys, feasibility studies, design coordination, and resource allocation. We maintain strict adherence to building codes, safety regulations, and quality standards throughout the construction process. Our team manages all aspects of construction including excavation, foundation work, structural construction, electrical and plumbing installations, finishing work, and final inspections.
              </p>
              <p className="text-muted">
                We understand that construction projects involve significant investments and timelines, which is why we prioritize transparent communication, regular progress updates, and proactive problem-solving. Our project management ensures that work progresses according to schedule, stays within budget, and maintains the highest quality standards. We work closely with clients, architects, and other stakeholders to ensure that the final outcome aligns perfectly with the vision and requirements. Post-construction, we provide warranty services and address any issues promptly, ensuring complete client satisfaction.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Construction"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Renovation Projects</h2>
              <p className="text-muted mb-3">
                Renovation projects breathe new life into existing structures, enhancing functionality, aesthetics, and value. Our renovation services transform outdated spaces into modern, efficient, and appealing environments. Whether it's a residential property, commercial office, retail space, or industrial facility, we approach each renovation project with careful planning and attention to detail.
              </p>
              <p className="text-muted mb-3">
                Our renovation process includes thorough assessment of existing structures, identification of improvement opportunities, design planning, and execution with minimal disruption to ongoing operations. We specialize in various renovation types including interior remodeling, exterior facelifts, structural modifications, space optimization, and modernization of systems. Our team works efficiently to complete renovations within agreed timelines while maintaining quality and minimizing inconvenience.
              </p>
              <p className="text-muted">
                We understand that renovation projects often need to accommodate existing operations, which is why we plan work schedules carefully and implement measures to minimize disruption. Our renovation services include upgrading electrical and plumbing systems, improving insulation and energy efficiency, modernizing interiors, enhancing exteriors, and ensuring compliance with current building codes. We work with clients to understand their vision, provide expert recommendations, and execute renovations that transform spaces while respecting budgets and timelines.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                alt="Renovation"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Government & Private Projects</h2>
              <p className="text-muted mb-3">
                We have extensive experience executing both government and private sector construction projects, each with its unique requirements, regulations, and challenges. Government projects often involve strict compliance requirements, detailed documentation, and adherence to specific procurement procedures. We have successfully completed numerous government projects, demonstrating our capability to meet stringent requirements and deliver quality outcomes.
              </p>
              <p className="text-muted mb-3">
                Our government project experience includes infrastructure development, public building construction, road and bridge projects, and facility upgrades. We maintain all necessary licenses, certifications, and compliance documentation required for government contracts. Our team is well-versed in government procurement processes, contract management, and reporting requirements. We ensure timely completion, quality standards, and full compliance with all regulations and specifications.
              </p>
              <p className="text-muted">
                Private sector projects offer opportunities for innovation, customization, and flexible approaches. We work with private clients including builders, developers, corporations, and institutions to deliver construction projects that align with their specific objectives and preferences. Our private project portfolio includes residential developments, commercial buildings, industrial facilities, educational institutions, and healthcare facilities. We bring the same level of professionalism, quality, and commitment to both government and private projects, ensuring successful outcomes regardless of project type or scale.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Government Projects"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Build Your Vision with Us</h4>
            <p className="text-center mb-3">
              From construction to renovation, we deliver quality civil work projects
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
