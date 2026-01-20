'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const categories = ['All', 'Civil Work', 'CCTV Installation', 'Event Organizing', 'Software Development', 'GPS Tracking', 'Mechanical Work', 'Manpower Supply']

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      if (data.success) {
        setProjects(data.images.map((img: any) => ({
          id: img.id,
          title: img.title,
          description: img.description,
          imageUrl: img.imageUrl,
          category: img.category,
        })))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Our Projects Gallery</h1>
          <p className="lead">Showcasing our successful projects across all service categories</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Category Filter */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={selectedCategory === category ? { backgroundColor: '#2E5C8A', borderColor: '#2E5C8A' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => setSelectedProject(project.id)}>
                  <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="card-img-top w-100 h-100"
                      loading="lazy"
                      decoding="async"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
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
                  </div>
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">{project.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Project Details */}
      {selectedProject && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} tabIndex={-1} onClick={() => setSelectedProject(null)}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 bg-transparent">
              {(() => {
                const project = projects.find(p => p.id === selectedProject)
                if (!project) return null
                return (
                  <>
                    <div className="modal-header border-0 justify-content-end">
                      <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedProject(null)}></button>
                    </div>
                    <div className="modal-body p-0">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="img-fluid w-100"
                        loading="eager"
                        style={{ 
                          maxHeight: '85vh', 
                          objectFit: 'contain',
                          borderRadius: '10px'
                        } as React.CSSProperties}
                      />
                      <div className="p-3 text-center">
                        <span className="badge bg-primary px-3 py-2">{project.category}</span>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
