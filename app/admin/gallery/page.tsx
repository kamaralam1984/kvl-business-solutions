'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import AdvancedImageUploader from '@/components/AdvancedImageUploader'

interface ImageItem {
  _id?: string
  id?: number
  title: string
  description: string
  imageUrl: string
  category: string
  uploadedAt: string
  uploadedBy: string
}

const categories = [
  'All',
  'Civil Work',
  'CCTV Installation',
  'Event Organizing',
  'Software Development',
  'GPS Tracking',
  'Mechanical Work',
  'Manpower Supply',
]

// ---------- PAGE ----------
export default function GalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const [formData] = useState({
    title: '',
    description: '',
    imageBase64: '',
    category: 'Civil Work',
  })

  const categoryOptions = categories
    .filter((c) => c !== 'All')
    .map((c) => ({ label: c, value: c }))

  // ---------- FETCH ----------
  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images')
      const data = await res.json()
      if (data.success) setImages(data.images)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // ---------- DELETE ----------
  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Delete image?')) return

    const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) fetchImages()
  }

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((i) => i.category === selectedCategory)

  // ---------- UI ----------
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>Gallery</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Image
        </button>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            className={`btn btn-sm ${selectedCategory === c ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row g-3">
          {filteredImages.map((img) => (
            <div key={img._id || img.id} className="col-md-4">
              <div className="card">
                <img src={img.imageUrl} className="card-img-top" />
                <button
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                  onClick={() => handleDelete(img.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <AdvancedImageUploader
                categories={categoryOptions}
                defaultCategory={formData.category}
                uploadedBy="admin"
                onClose={() => setShowModal(false)}
                onUploaded={() => {
                  setShowModal(false)
                  fetchImages()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
