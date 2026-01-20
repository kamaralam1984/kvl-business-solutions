'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Image {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  uploadedAt: string
  uploadedBy: string
}

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  const categories = ['All', 'Civil Work', 'CCTV Installation', 'Event Organizing', 'Software Development', 'GPS Tracking', 'Mechanical Work', 'Manpower Supply']

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    })
    revealElements.forEach((el) => observer.observe(el))
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      if (data.success) {
        // Home gallery: show only first 8 images for performance; full gallery on /projects
        setImages(data.images.slice(0, 8))
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <section className="py-5 reveal" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Our Projects & Work Gallery
          </h2>
          <p className="lead text-muted">
            Showcasing our excellence across diverse projects and services
          </p>
        </div>

        {/* Category Filter */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? '' : 'btn-outline-primary'}`}
              style={selectedCategory === category ? { 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white'
              } : {
                borderColor: '#667eea',
                color: '#667eea'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ color: '#667eea' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No images available yet</p>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {filteredImages.map((image) => (
              <div key={image.id} className="col-md-6 col-lg-3">
                <div 
                  className="card border-0 shadow-sm card-hover" 
                  style={{ borderRadius: '15px', overflow: 'visible', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                  onClick={() => setSelectedImage(image)}
                  data-bs-toggle="modal"
                  data-bs-target="#imageModal"
                >
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '400px', padding: '15px' }}>
                    <img
                      src={image.imageUrl}
                      alt={image.category}
                      className="w-100"
                      loading="lazy"
                      decoding="async"
                      style={{ 
                        objectFit: 'contain',
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      } as React.CSSProperties}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                      <span 
                        className="badge px-3 py-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/projects"
            className="btn btn-lg px-5 py-3 fw-bold text-white"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px'
            }}
          >
            View All Projects
          </Link>
        </div>
      </div>

      {/* Bootstrap Modal for Lightbox */}
      {selectedImage && (
        <div 
          className="modal fade show" 
          id="imageModal" 
          tabIndex={-1}
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.9)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 bg-transparent" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header border-0 justify-content-end">
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedImage(null)}
                  style={{ fontSize: '1.5rem' }}
                ></button>
              </div>
              <div className="modal-body p-0 d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.category}
                  className="img-fluid"
                  style={{ 
                    maxHeight: '90vh',
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    display: 'block'
                  } as React.CSSProperties}
                  loading="eager"
                />
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
                  <span 
                    className="badge px-4 py-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '0.9rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {selectedImage.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
