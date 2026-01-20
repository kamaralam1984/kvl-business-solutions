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
        setImages(data.images)
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
                  className="card border-0 shadow-sm h-100 card-hover" 
                  style={{ borderRadius: '15px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(image)}
                  data-bs-toggle="modal"
                  data-bs-target="#imageModal"
                >
                  <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span 
                        className="badge px-3 py-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}
                      >
                        {image.category}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title fw-bold" style={{ color: '#0E0C1D' }}>{image.title}</h6>
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
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{selectedImage.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedImage(null)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
                <div className="p-4">
                  <span 
                    className="badge px-3 py-2 mb-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    {selectedImage.category}
                  </span>
                  {selectedImage.description && (
                    <p className="text-muted mb-0">{selectedImage.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
