'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiUpload, FiImage } from 'react-icons/fi'

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

// ---------- helper: compress + base64 ----------
async function compressImageToBase64(
  file: File,
  maxSizeBytes = 1 * 1024 * 1024,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas error')

        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.8
        let dataUrl = canvas.toDataURL('image/jpeg', quality)

        while (dataUrl.length * 0.75 > maxSizeBytes && quality > 0.4) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ---------- PAGE ----------
export default function GalleryPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageBase64: '',
    category: 'Civil Work',
  })

  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchUploading, setBatchUploading] = useState(false)

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

  // ---------- FILE SELECT ----------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (files.length > 1) {
      setBatchFiles(Array.from(files))
      return
    }

    setUploading(true)
    const base64 = await compressImageToBase64(files[0])
    setFormData({ ...formData, imageBase64: base64 })
    setUploading(false)
  }

  // ---------- SINGLE UPLOAD ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.imageBase64 || !formData.category) {
      alert('Please fill all required fields')
      return
    }

    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageBase64: formData.imageBase64,
        uploadedBy: 'admin',
      }),
    })

    const data = await res.json()
    if (data.success) {
      alert('Image uploaded')
      setShowModal(false)
      setFormData({ title: '', description: '', imageBase64: '', category: 'Civil Work' })
      fetchImages()
    } else {
      alert(data.error || 'Upload failed')
    }
  }

  // ---------- BATCH UPLOAD ----------
  const handleBatchUpload = async () => {
    if (batchFiles.length === 0) return

    setBatchUploading(true)

    const imagesPayload = []
    for (const file of batchFiles) {
      const base64 = await compressImageToBase64(file)
      imagesPayload.push({
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        category: formData.category,
        imageBase64: base64,
        uploadedBy: 'admin',
      })
    }

    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imagesPayload }),
    })

    const data = await res.json()
    if (data.success) {
      alert(`Uploaded ${data.saved} images`)
      setBatchFiles([])
      setShowModal(false)
      fetchImages()
    } else {
      alert('Batch upload failed')
    }

    setBatchUploading(false)
  }

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
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handleFileChange}
                />

                <select
                  className="form-select mb-2"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                {batchFiles.length > 0 ? (
                  <button type="button" className="btn btn-primary w-100" onClick={handleBatchUpload}>
                    {batchUploading ? 'Uploading...' : `Upload ${batchFiles.length} Images`}
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success w-100">
                    {uploading ? 'Processing...' : 'Upload Image'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
