'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    title: 'One Company. Multiple Professional Solutions.',
    subtitle: 'Reliable solutions for modern businesses',
    description: 'KVL Business Solution provides comprehensive services in Software Development, CCTV & GPS, Civil & Mechanical Work, Manpower Supply, and Events Organizing.',
    gradient: 'gradient-blue',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  },
  {
    id: 2,
    title: 'One Partner for Technology, Infrastructure & Services',
    subtitle: 'Delivering excellence across multiple domains',
    description: 'From cutting-edge software solutions to robust infrastructure development, we are your trusted partner for all business needs.',
    gradient: 'gradient-orange',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
  },
  {
    id: 3,
    title: 'Transforming Businesses with Integrated Solutions',
    subtitle: 'Your success is our commitment',
    description: 'Experience seamless integration of technology, infrastructure, and services under one roof with KVL Business Solution.',
    gradient: 'gradient-green',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  },
]

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="position-relative" style={{ paddingTop: '80px', minHeight: '90vh', overflow: 'hidden' }}>
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === activeIndex ? 'active' : ''}
              aria-current={index === activeIndex ? 'true' : 'false'}
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ minHeight: '90vh' }}
            >
              <div
                className="position-absolute w-100 h-100"
                style={{
                  background: `linear-gradient(135deg, ${
                    index === 0 ? 'rgba(102, 126, 234, 0.9)' : index === 1 ? 'rgba(240, 147, 251, 0.9)' : 'rgba(79, 172, 254, 0.9)'
                  } 0%, ${
                    index === 0 ? 'rgba(118, 75, 162, 0.9)' : index === 1 ? 'rgba(245, 87, 108, 0.9)' : 'rgba(0, 242, 254, 0.9)'
                  } 100%)`,
                  zIndex: 1,
                }}
              ></div>
              <div
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.3,
                  zIndex: 0,
                }}
              ></div>
              <div className="container position-relative" style={{ zIndex: 2, paddingTop: '150px', paddingBottom: '100px' }}>
                <div className="row align-items-center text-white">
                  <div className="col-lg-8 mx-auto text-center">
                    <h1 className="display-3 fw-bold mb-4 fade-in" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                      {slide.title}
                    </h1>
                    <p className="lead fs-3 mb-3 fade-in" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      {slide.subtitle}
                    </p>
                    <p className="fs-5 mb-5 fade-in" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      {slide.description}
                    </p>
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center slide-up">
                      <Link
                        href="/contact"
                        className="btn btn-light btn-lg px-5 py-3 fw-bold"
                        style={{ fontSize: '1.1rem' }}
                      >
                        Get Quote
                        <FiArrowRight className="ms-2" />
                      </Link>
                      <Link
                        href="/services"
                        className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
                        style={{ fontSize: '1.1rem', borderWidth: '2px' }}
                      >
                        Our Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
          onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
          onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  )
}
