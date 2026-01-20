'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi'

interface Image {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  uploadedAt: string
  uploadedBy: string
}

const categories = ['All', 'Civil Work', 'CCTV Installation', 'Event Organizing', 'Software Development', 'GPS Tracking', 'Mechanical Work', 'Manpower Supply']

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Civil Work',
  })
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchUploading, setBatchUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({})

  useEffect(() => {
    fetchImages()
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

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url })
    setPreviewUrl(url)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if multiple files selected
    if (files.length > 1) {
      const validFiles: File[] = []
      const invalidFiles: string[] = []

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          invalidFiles.push(`${file.name} - Not an image`)
          return
        }
        // Limit to 2MB per file to avoid exceeding server payload limits on deploy
        if (file.size > 2 * 1024 * 1024) {
          invalidFiles.push(`${file.name} - Size exceeds 2MB`)
          return
        }
        validFiles.push(file)
      })

      if (invalidFiles.length > 0) {
        alert(`Invalid files:\n${invalidFiles.join('\n')}`)
      }

      if (validFiles.length > 0) {
        setBatchFiles(validFiles)
        // Initialize upload progress
        const progress: Record<string, 'pending'> = {}
        validFiles.forEach(file => {
          progress[file.name] = 'pending'
        })
        setUploadProgress(progress)
      }
      return
    }

    // Single file upload (existing behavior)
    const file = files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB to stay within server request limits)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB (hosting limit)')
      return
    }

    setUploading(true)

    try {
      // Convert to base64 for now (in production, upload to cloud storage)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, imageUrl: base64String })
        setPreviewUrl(base64String)
        setUploading(false)
      }
      reader.onerror = () => {
        alert('Error reading file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
      setUploading(false)
    }
  }

  const handleBatchUpload = async () => {
    if (batchFiles.length === 0) return

    setBatchUploading(true)
    const imagesToUpload: any[] = []

    // Convert all files to base64
    const readPromises = batchFiles.map((file) => {
      return new Promise<void>((resolve, reject) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 'uploading' }))
        
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
          
          imagesToUpload.push({
            title: fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/[-_]/g, ' '),
            description: formData.description || '',
            imageUrl: base64String,
            category: formData.category,
            uploadedBy: 'admin',
          })
          
          setUploadProgress(prev => ({ ...prev, [file.name]: 'success' }))
          resolve()
        }
        reader.onerror = () => {
          setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }))
          reject(new Error(`Failed to read ${file.name}`))
        }
        reader.readAsDataURL(file)
      })
    })

    try {
      await Promise.all(readPromises)

      // Upload all images at once
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesToUpload,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        const successCount = data.saved || imagesToUpload.length
        const failCount = data.failed || 0
        
        if (failCount > 0) {
          alert(`Upload complete!\n✓ ${successCount} images uploaded successfully\n✗ ${failCount} images failed`)
        } else {
          alert(`Successfully uploaded ${successCount} images!`)
        }
        
        // Reset state
        setBatchFiles([])
        setUploadProgress({})
        setFormData({ title: '', description: '', imageUrl: '', category: formData.category })
        setShowModal(false)
        fetchImages()
      } else {
        alert(data.error || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files. Please try again.')
    } finally {
      setBatchUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.imageUrl || !formData.category) {
      alert('Please fill all required fields')
      return
    }

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          uploadedBy: 'admin',
        }),
      })
      const data = await response.json()
      if (data.success) {
        setShowModal(false)
        setFormData({ title: '', description: '', imageUrl: '', category: 'Civil Work' })
        setPreviewUrl('')
        fetchImages()
        alert('Image added successfully!')
      } else {
        alert(data.error || 'Failed to add image')
      }
    } catch (error) {
      console.error('Error adding image:', error)
      alert('Error adding image. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchImages()
        alert('Image deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image. Please try again.')
    }
  }

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-2" style={{ color: '#0E0C1D' }}>Image Gallery</h1>
          <p className="text-muted mb-0">Manage your project images</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn d-inline-flex align-items-center gap-2 text-white border-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            padding: '10px 20px',
          }}
        >
          <FiPlus />
          Add Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="d-flex flex-wrap gap-2 mb-4">
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

      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ color: '#667eea' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-5 bg-white rounded border">
          <p className="text-muted mb-0">No images found</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '300px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                  <img
                    src={image.imageUrl}
                    alt={image.category}
                    className="w-100"
                    style={{ 
                      objectFit: 'contain',
                      maxHeight: '300px',
                      width: '100%',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                    }}
                  />
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="position-absolute top-0 end-0 m-2 btn btn-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="card-body p-2">
                  <div className="d-flex justify-content-end align-items-center">
                    <span 
                      className="badge px-2 py-1"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '0.75rem'
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

      {/* Add Image Modal */}
      {showModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: '#0E0C1D' }}>Add New Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false)
                    setPreviewUrl('')
                    setBatchFiles([])
                    setUploadProgress({})
                    setFormData({ title: '', description: '', imageUrl: '', category: 'Civil Work' })
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter image title"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image *</label>
                    <div className="d-flex flex-column gap-2">
                      <div>
                        <label className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                          <FiUpload />
                          {uploading ? 'Processing...' : batchFiles.length > 0 ? `${batchFiles.length} Files Selected` : 'Upload Image File(s) (Multiple Selection Allowed)'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="d-none"
                            disabled={uploading || batchUploading}
                            multiple
                          />
                        </label>
                        <small className="text-muted d-block mt-1">You can select multiple images at once (Max 10MB per file)</small>
                      </div>
                      
                      {/* Batch Files Preview */}
                      {batchFiles.length > 0 && (
                        <div className="border rounded p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong className="small">Selected Files ({batchFiles.length}):</strong>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setBatchFiles([])
                                setUploadProgress({})
                              }}
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {batchFiles.map((file, index) => (
                              <div
                                key={index}
                                className={`d-flex justify-content-between align-items-center p-2 rounded ${
                                  uploadProgress[file.name] === 'success' ? 'bg-success bg-opacity-10' :
                                  uploadProgress[file.name] === 'error' ? 'bg-danger bg-opacity-10' :
                                  uploadProgress[file.name] === 'uploading' ? 'bg-primary bg-opacity-10' :
                                  'bg-white'
                                }`}
                              >
                                <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: 0 }}>
                                  <FiImage className="flex-shrink-0" />
                                  <span className="small text-truncate">{file.name}</span>
                                  <span className="badge bg-secondary small">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                                <div className="flex-shrink-0">
                                  {uploadProgress[file.name] === 'uploading' && (
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  )}
                                  {uploadProgress[file.name] === 'success' && (
                                    <span className="badge bg-success">✓</span>
                                  )}
                                  {uploadProgress[file.name] === 'error' && (
                                    <span className="badge bg-danger">✗</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleBatchUpload}
                            className="btn btn-primary w-100 mt-3"
                            disabled={batchUploading}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                            }}
                          >
                            {batchUploading ? 'Uploading...' : `Upload All ${batchFiles.length} Images`}
                          </button>
                        </div>
                      )}

                      <div className="text-center text-muted small">OR</div>
                      <div>
                        <input
                          type="url"
                          className="form-control"
                          value={formData.imageUrl}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="Enter image URL (https://example.com/image.jpg)"
                          disabled={batchFiles.length > 0}
                        />
                      </div>
                    </div>
                    {previewUrl && batchFiles.length === 0 && (
                      <div className="mt-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="img-fluid rounded border"
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter image description (optional)"
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setPreviewUrl('')
                      setFormData({ title: '', description: '', imageUrl: '', category: 'Civil Work' })
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn text-white border-0"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    disabled={uploading || batchUploading || (!formData.imageUrl && batchFiles.length === 0)}
                  >
                    {uploading ? 'Uploading...' : batchFiles.length > 0 ? 'Use URL Instead' : 'Add Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
