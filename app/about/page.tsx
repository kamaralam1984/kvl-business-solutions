export default function AboutPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">About KVL Business Solution</h1>
          <p className="lead">Your Trusted Partner for Multi-Service Professional Solutions</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Our Mission</h2>
              <p className="lead text-muted mb-3">
                At KVL Business Solution, our mission is to be the premier multi-service provider that empowers businesses, government departments, and institutions to achieve their objectives through integrated, innovative, and reliable solutions. We are committed to delivering excellence across every service category, from cutting-edge technology solutions to infrastructure development and human resource management.
              </p>
              <p className="text-muted">
                We strive to build long-term partnerships based on trust, transparency, and mutual growth. Our mission extends beyond project completion to ensuring sustainable success for our clients through continuous support, maintenance, and strategic guidance. We believe in creating value that transcends immediate deliverables, focusing on transformative outcomes that drive organizational growth and operational efficiency.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Our Mission"
                className="img-fluid rounded shadow"
                style={{ height: '400px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Our Vision</h2>
              <p className="lead text-muted mb-3">
                Our vision is to become the most trusted and recognized multi-service business solution provider in the region, known for our unwavering commitment to quality, innovation, and customer satisfaction. We envision a future where businesses can rely on a single partner for all their diverse needs, eliminating the complexity of managing multiple vendors and ensuring seamless integration across services.
              </p>
              <p className="text-muted">
                We aim to set industry benchmarks through our comprehensive service portfolio, technological expertise, and customer-centric approach. Our vision encompasses continuous innovation, expansion of service capabilities, and building a team of exceptional professionals who share our passion for excellence. We aspire to be the catalyst that transforms businesses, enabling them to reach new heights of success and operational excellence.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Our Vision"
                className="img-fluid rounded shadow"
                style={{ height: '400px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow">
                <div className="card-body p-5">
                  <h3 className="h4 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Why KVL Business Solution is Reliable</h3>
                  <p className="text-muted mb-3">
                    With over 15 years of experience in the industry, KVL Business Solution has established itself as a reliable and trusted partner for organizations across various sectors. Our extensive portfolio includes successful projects for government departments, private companies, builders, factories, educational institutions, event organizers, and startups. This diverse experience has equipped us with deep insights into different industry requirements and challenges.
                  </p>
                  <p className="text-muted mb-3">
                    Our reliability stems from our unwavering commitment to quality, timely delivery, and customer satisfaction. We maintain the highest standards in every project, regardless of size or complexity. Our team of experienced professionals brings together expertise from multiple domains, ensuring that every service is delivered with precision and excellence. We invest in continuous training and skill development, keeping our team updated with the latest technologies, methodologies, and industry best practices.
                  </p>
                  <p className="text-muted mb-0">
                    What sets us apart is our integrated approach to business solutions. Rather than operating as separate service providers, we function as a unified organization where different service teams collaborate seamlessly. This enables us to offer comprehensive solutions that address multiple aspects of a client's needs simultaneously. Our proven track record, client testimonials, and repeat business relationships stand as testament to our reliability and commitment to excellence. When you choose KVL Business Solution, you're choosing a partner who values your success as much as you do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Ready to Work With Us?</h2>
          <p className="lead text-muted mb-4">
            Let's discuss how we can help you achieve your business objectives
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <a
              href="/contact"
              className="btn btn-primary btn-lg px-5 py-3"
              style={{ backgroundColor: '#2E5C8A', borderColor: '#2E5C8A' }}
            >
              Get in Touch
            </a>
            <a
              href="/services"
              className="btn btn-outline-primary btn-lg px-5 py-3"
              style={{ borderColor: '#2E5C8A', color: '#2E5C8A' }}
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
