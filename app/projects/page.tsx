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
                  <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="card-img-top w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-primary">{project.category}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold" style={{ color: '#0E0C1D' }}>{project.title}</h5>
                    <p className="card-text text-muted small">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Project Details */}
      {selectedProject && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} onClick={() => setSelectedProject(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              {(() => {
                const project = projects.find(p => p.id === selectedProject)
                if (!project) return null
                return (
                  <>
                    <div className="modal-header">
                      <h5 className="modal-title fw-bold">{project.title}</h5>
                      <button type="button" className="btn-close" onClick={() => setSelectedProject(null)}></button>
                    </div>
                    <div className="modal-body">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="img-fluid rounded mb-3"
                        style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-primary mb-3">{project.category}</span>
                      <p className="text-muted">{project.description}</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setSelectedProject(null)}>Close</button>
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
