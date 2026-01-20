import Link from 'next/link'

export default function EventOrganizingPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Event Organizing</h1>
          <p className="lead">Complete Event Management Services</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Corporate Events</h2>
              <p className="text-muted mb-3">
                Corporate events serve multiple purposes including team building, client engagement, product launches, annual meetings, conferences, and celebrations. Our corporate event organizing services handle all aspects of event planning and execution, ensuring that your corporate events are professional, memorable, and aligned with your business objectives. We understand that corporate events represent your brand and must reflect professionalism and attention to detail.
              </p>
              <p className="text-muted mb-3">
                Our corporate event services include venue selection and booking, event planning and coordination, stage setup, sound and lighting arrangements, decoration, catering coordination, guest management, and post-event follow-up. We work closely with clients to understand event objectives, budget constraints, and specific requirements. Our team manages all logistics, coordinates with vendors, and ensures smooth execution from start to finish.
              </p>
              <p className="text-muted">
                We have experience organizing various types of corporate events including seminars, workshops, product launches, annual general meetings, team outings, client appreciation events, and corporate celebrations. Our services are scalable, accommodating events from intimate gatherings to large-scale conferences with hundreds of attendees. We pay special attention to branding, ensuring that event aesthetics align with your corporate identity. Our goal is to create events that not only meet objectives but also leave lasting positive impressions on attendees.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"
                alt="Corporate Events"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-lg-2">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Government Events</h2>
              <p className="text-muted mb-3">
                Government events require careful planning, strict adherence to protocols, and attention to security and logistics. Our government event organizing services are designed to meet the unique requirements of public sector events including official functions, ceremonies, conferences, public meetings, and cultural events. We understand the importance of maintaining decorum, following protocols, and ensuring smooth execution of government events.
              </p>
              <p className="text-muted mb-3">
                Our government event services include comprehensive planning, venue management, security coordination, protocol adherence, VIP management, media coordination, and documentation. We work with government departments to understand specific requirements, timelines, and protocols. Our team is experienced in handling large-scale government events with multiple stakeholders, dignitaries, and attendees. We ensure that all arrangements meet government standards and protocols.
              </p>
              <p className="text-muted">
                We maintain detailed documentation, coordinate with various departments, and ensure compliance with all regulations and requirements. Our government event services include stage setup with appropriate branding, sound systems for announcements and speeches, lighting for visibility and aesthetics, and decoration that reflects the event's purpose and importance. We understand the significance of government events and approach each project with the seriousness and professionalism it deserves, ensuring that events are executed flawlessly and reflect positively on the organizing department or agency.
              </p>
            </div>
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                alt="Government Events"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-6 fw-bold mb-4" style={{ color: '#0E0C1D' }}>Stage, Sound, Light & Decoration</h2>
              <p className="text-muted mb-3">
                The visual and auditory experience of an event significantly impacts its success and memorability. Our comprehensive event services include professional stage setup, high-quality sound systems, sophisticated lighting arrangements, and creative decoration. These elements work together to create immersive event experiences that engage attendees and leave lasting impressions.
              </p>
              <p className="text-muted mb-3">
                Our stage setup services include designing and constructing stages appropriate for the event type and venue. We provide stages of various sizes, with proper elevation, safety features, and aesthetic appeal. Stage setups can include podiums, backdrop screens, branding elements, and technical infrastructure for presentations and performances. Sound systems are crucial for clear communication and entertainment. We provide professional audio equipment including microphones, speakers, amplifiers, and mixing consoles, ensuring clear sound quality throughout the venue.
              </p>
              <p className="text-muted">
                Lighting transforms event atmospheres, creating moods, highlighting key areas, and enhancing visual appeal. Our lighting services include stage lighting, ambient lighting, decorative lighting, and special effects. We use modern lighting equipment and techniques to create desired atmospheres and ensure proper visibility. Decoration services add aesthetic value and align events with themes and branding. We provide decoration services including floral arrangements, fabric draping, backdrop design, entrance decoration, and venue transformation. Our decoration team works with clients to understand themes, color schemes, and aesthetic preferences, creating visually appealing environments that enhance the overall event experience.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Stage Sound Light"
                className="img-fluid rounded shadow"
                style={{ height: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>

          <div className="alert alert-info mt-5" role="alert">
            <h4 className="alert-heading text-center mb-3">Make Your Events Unforgettable</h4>
            <p className="text-center mb-3">
              Professional event organizing services for corporate and government events
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
