import Link from 'next/link'

export default function SoftwareDevelopmentPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Software Development</h1>
          <p className="lead">Custom Software Solutions Tailored to Your Business Needs</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Website Development</h2>
              <p className="text-muted mb-3">
                In today's digital age, a strong online presence is essential for business success. Our website development services create responsive, user-friendly, and SEO-optimized websites that effectively represent your brand and engage your target audience. We design websites that are not just visually appealing but also functionally robust, ensuring seamless user experience across all devices and platforms.
              </p>
              <p className="text-muted mb-3">
                Our team specializes in modern web technologies including HTML5, CSS3, JavaScript, React, Next.js, and various content management systems. We understand that every business has unique requirements, which is why we take a customized approach to each project. From simple informational websites to complex e-commerce platforms, we deliver solutions that align with your business objectives and budget constraints.
              </p>
              <p className="text-muted">
                We focus on creating websites that load quickly, rank well on search engines, and convert visitors into customers. Our development process includes thorough planning, design mockups, client feedback integration, development, testing, and deployment. We also provide ongoing maintenance and support to ensure your website remains updated, secure, and optimized for peak performance.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                alt="Website Development"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Web Applications</h2>
              <p className="text-muted mb-3">
                Web applications have revolutionized how businesses operate, offering powerful tools accessible from any device with an internet connection. Our web application development services create scalable, secure, and feature-rich applications that streamline business processes, enhance productivity, and drive growth. We build applications that handle complex workflows, manage large datasets, and support multiple users simultaneously.
              </p>
              <p className="text-muted mb-3">
                Whether you need a customer relationship management (CRM) system, enterprise resource planning (ERP) solution, inventory management system, or custom business application, we have the expertise to deliver. Our development approach emphasizes clean code architecture, security best practices, and scalability considerations. We use modern frameworks and technologies to ensure your application remains maintainable and can evolve with your business needs.
              </p>
              <p className="text-muted">
                Our web applications are designed with user experience at the forefront, featuring intuitive interfaces that require minimal training. We implement robust authentication and authorization systems to protect sensitive data, and we follow industry standards for data encryption and security protocols. Post-deployment, we provide comprehensive documentation, training, and ongoing support to ensure smooth adoption and optimal utilization of your application.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
                alt="Web Applications"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Mobile Apps & Custom Business Software</h2>
              <p className="text-muted mb-3">
                Mobile applications have become indispensable tools for businesses seeking to engage customers and streamline operations. Our mobile app development services create native and cross-platform applications for iOS and Android devices, delivering seamless user experiences and powerful functionality. We develop apps that are fast, responsive, and aligned with platform-specific design guidelines.
              </p>
              <p className="text-muted mb-3">
                Beyond mobile apps, we specialize in developing custom business software solutions tailored to your specific operational requirements. These applications automate processes, reduce manual errors, improve efficiency, and provide valuable insights through data analytics. Our custom software solutions integrate seamlessly with your existing systems and can be designed to grow with your business.
              </p>
              <p className="text-muted">
                We understand that every business has unique challenges and requirements. Our team works closely with you to understand your processes, identify pain points, and design solutions that address your specific needs. From initial consultation to final deployment and beyond, we ensure that your software solution delivers measurable value and contributes to your business success. Our commitment extends to providing regular updates, feature enhancements, and technical support to keep your software current and effective.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
                alt="Mobile Apps"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Ready to Transform Your Business with Technology?</h4>
            <p className="text-center mb-3">
              Contact us today to discuss your software development needs and get a customized solution
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
