'use client'

import { useState, useEffect } from 'react'
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiImage, FiType } from 'react-icons/fi'
import Link from 'next/link'

interface PageSection {
  id: string
  type: 'text' | 'image' | 'text-image' | 'hero' | 'cards' | 'gallery'
  title?: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  order: number
  metadata?: Record<string, any>
}

interface Page {
  id: string
  path: string
  title: string
  description?: string
  sections: PageSection[]
  updatedAt: string
  updatedBy: string
}

const availablePages = [
  { path: '/', title: 'Home Page' },
  { path: '/about', title: 'About Page' },
  { path: '/services', title: 'Services Page' },
  { path: '/services/software-development', title: 'Software Development' },
  { path: '/services/cctv-installation', title: 'CCTV Installation' },
  { path: '/services/gps-tracking', title: 'GPS Tracking' },
  { path: '/services/civil-work', title: 'Civil Work' },
  { path: '/services/mechanical-work', title: 'Mechanical Work' },
  { path: '/services/manpower-supply', title: 'Manpower Supply' },
  { path: '/services/event-organizing', title: 'Event Organizing' },
  { path: '/solutions', title: 'Solutions Page' },
  { path: '/contact', title: 'Contact Page' },
  { path: '/projects', title: 'Projects Page' },
]

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newSectionType, setNewSectionType] = useState<PageSection['type']>('text')

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      if (data.success) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPage = async (path: string) => {
    try {
      const response = await fetch(`/api/pages?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      if (data.success && data.page) {
        setSelectedPage(data.page)
      } else {
        // Create new page if doesn't exist
        setSelectedPage({
          id: `page-${Date.now()}`,
          path,
          title: availablePages.find(p => p.path === path)?.title || path,
          sections: [],
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin',
        })
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  const savePage = async () => {
    if (!selectedPage) return

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedPage,
          updatedBy: 'admin',
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert('Page saved successfully!')
        fetchPages()
        setSelectedPage(data.page)
      } else {
        alert(data.error || 'Failed to save page')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page')
    }
  }

  const addSection = () => {
    if (!selectedPage) return

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: newSectionType,
      title: '',
      content: '',
      imageUrl: '',
      imageAlt: '',
      order: selectedPage.sections.length,
      metadata: {},
    }

    setSelectedPage({
      ...selectedPage,
      sections: [...selectedPage.sections, newSection],
    })
    setEditingSection(newSection)
    setShowAddSection(false)
  }

  const updateSection = (section: PageSection) => {
    if (!selectedPage) return

    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.map(s =>
        s.id === section.id ? section : s
      ),
    })
    setEditingSection(null)
  }

  const deleteSection = (sectionId: string) => {
    if (!selectedPage || !confirm('Delete this section?')) return

    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.filter(s => s.id !== sectionId),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: PageSection) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        updateSection({
          ...section,
          imageUrl: base64String,
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-2" style={{ color: '#0E0C1D' }}>Page Management</h1>
          <p className="text-muted mb-0">Edit and manage website pages</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Select Page</h5>
            </div>
            <div className="list-group list-group-flush">
              {availablePages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => loadPage(page.path)}
                  className={`list-group-item list-group-item-action ${
                    selectedPage?.path === page.path ? 'active' : ''
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedPage ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold">{selectedPage.title}</h5>
                  <small className="text-muted">{selectedPage.path}</small>
                </div>
                <button
                  onClick={savePage}
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  <FiSave />
                  Save Page
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Page Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPage.title}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, title: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Page Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={selectedPage.description || ''}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, description: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold">Sections</h6>
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                  >
                    <FiPlus />
                    Add Section
                  </button>
                </div>

                {showAddSection && (
                  <div className="card mb-3 border-primary">
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Section Type</label>
                        <select
                          className="form-select"
                          value={newSectionType}
                          onChange={(e) =>
                            setNewSectionType(e.target.value as PageSection['type'])
                          }
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                          <option value="text-image">Text + Image</option>
                          <option value="hero">Hero Section</option>
                          <option value="cards">Cards</option>
                          <option value="gallery">Gallery</option>
                        </select>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={addSection}
                          className="btn btn-sm btn-primary"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddSection(false)}
                          className="btn btn-sm btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  {selectedPage.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <div key={section.id} className="card mb-3">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-primary me-2">{section.type}</span>
                            <strong>{section.title || `Section ${index + 1}`}</strong>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => setEditingSection(section)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        {editingSection?.id === section.id ? (
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">Title</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editingSection.title || ''}
                                onChange={(e) =>
                                  setEditingSection({
                                    ...editingSection,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>
                            {(editingSection.type === 'text' ||
                              editingSection.type === 'text-image') && (
                              <div className="mb-3">
                                <label className="form-label">Content</label>
                                <textarea
                                  className="form-control"
                                  rows={5}
                                  value={editingSection.content || ''}
                                  onChange={(e) =>
                                    setEditingSection({
                                      ...editingSection,
                                      content: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            )}
                            {(editingSection.type === 'image' ||
                              editingSection.type === 'text-image' ||
                              editingSection.type === 'hero') && (
                              <div className="mb-3">
                                <label className="form-label">Image</label>
                                <div className="d-flex flex-column gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, editingSection)}
                                    className="form-control"
                                  />
                                  <input
                                    type="url"
                                    className="form-control"
                                    placeholder="Or enter image URL"
                                    value={editingSection.imageUrl || ''}
                                    onChange={(e) =>
                                      setEditingSection({
                                        ...editingSection,
                                        imageUrl: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                {editingSection.imageUrl && (
                                  <img
                                    src={editingSection.imageUrl}
                                    alt={editingSection.imageAlt || ''}
                                    className="img-fluid mt-2 rounded"
                                    style={{ maxHeight: '200px' }}
                                  />
                                )}
                                <div className="mt-2">
                                  <label className="form-label">Image Alt Text</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={editingSection.imageAlt || ''}
                                    onChange={(e) =>
                                      setEditingSection({
                                        ...editingSection,
                                        imageAlt: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => updateSection(editingSection)}
                                className="btn btn-sm btn-primary"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSection(null)}
                                className="btn btn-sm btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="card-body">
                            {section.title && (
                              <h6 className="fw-bold">{section.title}</h6>
                            )}
                            {section.content && (
                              <p className="text-muted small mb-2">
                                {section.content.substring(0, 100)}...
                              </p>
                            )}
                            {section.imageUrl && (
                              <img
                                src={section.imageUrl}
                                alt={section.imageAlt || ''}
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px' }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {selectedPage.sections.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <p>No sections yet. Click "Add Section" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <p className="text-muted">Select a page from the left to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
