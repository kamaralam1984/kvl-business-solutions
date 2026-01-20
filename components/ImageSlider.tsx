'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface Image {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  uploadedAt: string
  uploadedBy: string
}

export default function ImageSlider() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length)
      }, 5000) // Auto-slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [images.length])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      if (data.success && data.images.length > 0) {
        // Take first 5 images for slider (performance optimization)
        setImages(data.images.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  // If no images, show default hero
  if (loading) {
    return (
      <section className="position-relative" style={{ paddingTop: '80px', minHeight: '90vh', overflow: 'hidden' }}>
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ color: '#667eea' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    )
  }

  if (images.length === 0) {
    // Fallback to default hero if no images
    return (
      <section className="position-relative" style={{ paddingTop: '80px', minHeight: '90vh', overflow: 'hidden' }}>
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            zIndex: 1,
          }}
        ></div>
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '150px', paddingBottom: '100px' }}>
          <div className="row align-items-center text-white">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4 animate-fade-in" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                One Company. Multiple Professional Solutions.
              </h1>
              <p className="lead fs-3 mb-5 animate-fade-in-delay" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Reliable solutions for modern businesses
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center animate-slide-up">
                <Link
                  href="/contact"
                  className="btn btn-light btn-lg px-5 py-3 fw-bold"
                  style={{ fontSize: '1.1rem' }}
                >
                  Get Quote
                  <FiArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="position-relative" style={{ paddingTop: '80px', minHeight: '90vh', overflow: 'hidden' }}>
      <div id="imageSlider" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#imageSlider"
              data-bs-slide-to={index}
              className={index === activeIndex ? 'active' : ''}
              aria-current={index === activeIndex ? 'true' : 'false'}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                margin: '0 5px',
                backgroundColor: index === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                border: '2px solid #fff',
                transition: 'all 0.3s ease',
              }}
            ></button>
          ))}
        </div>

        {/* Carousel Inner */}
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ minHeight: '90vh', position: 'relative' }}
            >
              {/* Background Image with Overlay */}
              <div
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${image.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 0,
                  animation: index === activeIndex ? 'zoomIn 15s ease-in-out infinite alternate' : 'none',
                }}
              ></div>
              
              {/* Gradient Overlay */}
              <div
                className="position-absolute w-100 h-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
                  zIndex: 1,
                }}
              ></div>

              {/* Content */}
              <div className="container position-relative" style={{ zIndex: 2, paddingTop: '150px', paddingBottom: '100px' }}>
                <div className="row align-items-center text-white">
                  <div className="col-lg-8 mx-auto text-center">
                    <div className={`animate-fade-in ${index === activeIndex ? 'active' : ''}`}>
                      <span
                        className="badge px-4 py-2 mb-3"
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          borderRadius: '50px',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {image.category}
                      </span>
                      <h1
                        className="display-3 fw-bold mb-4"
                        style={{
                          textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                          animation: index === activeIndex ? 'slideInDown 0.8s ease-out' : 'none',
                        }}
                      >
                        One Company. Multiple Professional Solutions.
                      </h1>
                      <p
                        className="lead fs-4 mb-5"
                        style={{
                          textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                          animation: index === activeIndex ? 'slideInUp 0.8s ease-out 0.2s both' : 'none',
                        }}
                      >
                        KVL Business Solutions delivers reliable multi-service solutions in Software, CCTV, GPS Tracking,
                        Civil, Mechanical, Manpower and Event Management.
                      </p>
                      <div
                        className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
                        style={{
                          animation: index === activeIndex ? 'slideInUp 0.8s ease-out 0.4s both' : 'none',
                        }}
                      >
                        <Link
                          href="/contact"
                          className="btn btn-light btn-lg px-5 py-3 fw-bold shadow-lg"
                          style={{
                            fontSize: '1.1rem',
                            borderRadius: '50px',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)'
                          }}
                        >
                          Get Quote
                          <FiArrowRight className="ms-2" />
                        </Link>
                        <Link
                          href="/projects"
                          className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
                          style={{
                            fontSize: '1.1rem',
                            borderRadius: '50px',
                            borderWidth: '2px',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          View Gallery
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#imageSlider"
          data-bs-slide="prev"
          onClick={goToPrevious}
          style={{
            width: '60px',
            height: '60px',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          <FiChevronLeft style={{ fontSize: '24px', color: '#fff' }} />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#imageSlider"
          data-bs-slide="next"
          onClick={goToNext}
          style={{
            width: '60px',
            height: '60px',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          <FiChevronRight style={{ fontSize: '24px', color: '#fff' }} />
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .carousel-item {
          transition: opacity 1s ease-in-out;
        }

        .carousel-fade .carousel-item {
          opacity: 0;
          transition-property: opacity;
          transition-duration: 1s;
        }

        .carousel-fade .carousel-item.active {
          opacity: 1;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in.active {
          opacity: 1;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.2s forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slideInUp 0.8s ease-out 0.4s forwards;
        }
      `}</style>
    </section>
  )
}
