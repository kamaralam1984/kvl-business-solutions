'use client'

import { useState, useEffect, useRef } from 'react'
import { FiMessageCircle, FiX, FiSend, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

type ChatStep = 'welcome' | 'service' | 'city' | 'location_type' | 'requirement' | 'timeline' | 'confirm'

interface SessionData {
  service?: string
  city?: string
  location_type?: string[]
  requirement?: string
  timeline?: string
}

export default function GoluChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'golu'; buttons?: string[]; options?: { type: 'checkbox' | 'radio'; items: string[] } }>>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentStep, setCurrentStep] = useState<ChatStep>('welcome')
  const [session, setSession] = useState<SessionData>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Save session to localStorage
  useEffect(() => {
    if (Object.keys(session).length > 0) {
      localStorage.setItem('golu_session', JSON.stringify(session))
    }
  }, [session])

  // Load session from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedSession = localStorage.getItem('golu_session')
      if (savedSession) {
        const parsed = JSON.parse(savedSession)
        setSession(parsed)
        // Determine current step based on saved data
        if (!parsed.service) {
          setCurrentStep('service')
        } else if (!parsed.city) {
          setCurrentStep('city')
        } else if ((parsed.service === 'CCTV / GPS' || parsed.service === 'CCTV Installation') && !parsed.location_type) {
          setCurrentStep('location_type')
        } else if (!parsed.requirement) {
          setCurrentStep('requirement')
        } else if (!parsed.timeline) {
          setCurrentStep('timeline')
        } else {
          setCurrentStep('confirm')
        }
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Auto welcome message - only once
      setTimeout(() => {
        setMessages([
          {
            text: 'नमस्ते 🙏\nमैं GOLU, KVL Business Solution (BLN) Assistant हूँ।\nकृपया बताएं, आप किस सेवा में रुचि रखते हैं?',
            sender: 'golu',
            buttons: [
              'Software Development',
              'CCTV / GPS',
              'Civil / Mechanical',
              'Manpower Supply',
              'Events Organizing'
            ]
          },
        ])
        setCurrentStep('service')
      }, 500)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleServiceSelect = (service: string) => {
    setSession(prev => ({ ...prev, service }))
    setMessages(prev => [
      ...prev,
      { text: service, sender: 'user' },
      {
        text: 'ठीक है!\n' + (service === 'CCTV / GPS' ? 'CCTV Installation' : service) + ' के लिए कृपया अपना शहर बताएं।',
        sender: 'golu'
      }
    ])
    setCurrentStep('city')
  }

  const handleCitySubmit = () => {
    if (!inputMessage.trim()) return
    
    const city = inputMessage.trim()
    setSession(prev => ({ ...prev, city }))
    setMessages(prev => [
      ...prev,
      { text: city, sender: 'user' }
    ])
    setInputMessage('')

    // Check if service needs location type
    if (session.service === 'CCTV / GPS' || session.service === 'CCTV Installation') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            text: `ठीक है! ${city} में CCTV के लिए आप किस जगह के लिए देख रहे हैं?`,
            sender: 'golu',
            options: {
              type: 'checkbox',
              items: ['Home', 'Office', 'Factory / Warehouse']
            }
          }
        ])
        setCurrentStep('location_type')
      }, 500)
    } else {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            text: 'आपकी क्या रिक्वायरमेंट है?',
            sender: 'golu'
          }
        ])
        setCurrentStep('requirement')
      }, 500)
    }
  }

  const handleLocationTypeSelect = (selected: string[]) => {
    setSession(prev => ({ ...prev, location_type: selected }))
    setMessages(prev => [
      ...prev,
      {
        text: `ठीक है! ${selected.join(', ')} के लिए।\n\nआपकी क्या रिक्वायरमेंट है?`,
        sender: 'golu'
      }
    ])
    setCurrentStep('requirement')
  }

  const handleRequirementSubmit = () => {
    if (!inputMessage.trim()) return
    
    const requirement = inputMessage.trim()
    setSession(prev => ({ ...prev, requirement }))
    setMessages(prev => [
      ...prev,
      { text: requirement, sender: 'user' }
    ])
    setInputMessage('')

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: 'कब तक ये काम करवाना है?',
          sender: 'golu',
          options: {
            type: 'radio',
            items: ['Immediately', 'Within 1 Week', 'Flexible']
          }
        }
      ])
      setCurrentStep('timeline')
    }, 500)
  }

  const handleTimelineSelect = (timeline: string) => {
    setSession(prev => ({ ...prev, timeline }))
    setMessages(prev => [
      ...prev,
      { text: timeline, sender: 'user' }
    ])

    setTimeout(() => {
      const summary = `अभी जानकारी सही हो गई है?\n\nService: ${session.service}\nCity: ${session.city}\n${session.location_type ? `Location: ${session.location_type.join(', ')}\n` : ''}Requirement: ${session.requirement}\nTimeline: ${timeline}\n\nअभी तक कॉल से बात नहीं हो पाई है। कृपया Call या WhatsApp पर संपर्क करें।`
      
      setMessages(prev => [
        ...prev,
        {
          text: summary,
          sender: 'golu',
          buttons: ['Call Now', 'WhatsApp']
        }
      ])
      setCurrentStep('confirm')
    }, 500)
  }

  const handleSend = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()

    switch (currentStep) {
      case 'service':
        handleServiceSelect(userMessage)
        break
      case 'city':
        handleCitySubmit()
        break
      case 'requirement':
        handleRequirementSubmit()
        break
      default:
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }])
        setInputMessage('')
    }
  }

  const handleButtonClick = (buttonText: string) => {
    if (currentStep === 'service') {
      handleServiceSelect(buttonText)
    } else if (currentStep === 'confirm') {
      if (buttonText === 'Call Now') {
        window.location.href = 'tel:+919876543210'
      } else if (buttonText === 'WhatsApp') {
        const message = `Hello, I need ${session.service} service in ${session.city}.`
        window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank')
      }
    }
  }

  const handleOptionSelect = (item: string, type: 'checkbox' | 'radio') => {
    if (type === 'checkbox') {
      const current = session.location_type || []
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
      handleLocationTypeSelect(updated)
    } else {
      handleTimelineSelect(item)
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="position-fixed rounded-circle border-0 shadow-lg d-flex align-items-center justify-content-center"
          style={{
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            zIndex: 1040,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          aria-label="Open chat"
        >
          <FiMessageCircle style={{ fontSize: '28px' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="position-fixed d-flex flex-column border rounded shadow-lg bg-white"
          style={{
            bottom: '24px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 48px)',
            height: '600px',
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 1050,
            borderRadius: '15px',
            borderColor: '#667eea',
            borderWidth: '2px',
          }}
        >
          {/* Header */}
          <div 
            className="text-white p-3 rounded-top d-flex justify-content-between align-items-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div>
              <h3 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>GOLU AI Assistant</h3>
              <p className="mb-0 small opacity-90">KVL Business Solution</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
              }}
              className="btn btn-link text-white p-0 border-0"
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div 
            className="flex-grow-1 overflow-auto p-3"
            style={{ 
              backgroundColor: '#f8f9fa',
              maxHeight: 'calc(600px - 140px)'
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} className="mb-3">
                <div className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div
                    className={`p-3 rounded ${msg.sender === 'user' ? 'text-white' : 'bg-white border'} shadow-sm`}
                    style={{
                      maxWidth: '85%',
                      fontSize: '0.9rem',
                      ...(msg.sender === 'user' 
                        ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
                        : { color: '#0E0C1D', borderColor: '#dee2e6' }
                      ),
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Service Buttons */}
                {msg.buttons && msg.sender === 'golu' && currentStep !== 'confirm' && (
                  <div className="mt-2 d-flex flex-column gap-2">
                    {msg.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => handleButtonClick(button)}
                        className="btn w-100 text-start border rounded"
                        style={{
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          borderColor: 'rgba(102, 126, 234, 0.3)',
                          color: '#667eea',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'
                        }}
                      >
                        {button}
                      </button>
                    ))}
                  </div>
                )}

                {/* Options (Checkboxes/Radio) */}
                {msg.options && msg.sender === 'golu' && (
                  <div className="mt-2 d-flex flex-column gap-2">
                    {msg.options.items.map((item, optIndex) => (
                      <label
                        key={optIndex}
                        className="d-flex align-items-center gap-2 p-2 bg-white border rounded"
                        style={{
                          cursor: 'pointer',
                          borderColor: '#dee2e6',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white'
                        }}
                      >
                        <input
                          type={msg.options!.type}
                          name={msg.options!.type === 'radio' ? 'timeline' : `location-${index}`}
                          onChange={() => handleOptionSelect(item, msg.options!.type)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#333' }}>{item}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Confirm Buttons */}
                {msg.buttons && msg.sender === 'golu' && currentStep === 'confirm' && (
                  <div className="mt-3 d-flex gap-2">
                    <button
                      onClick={() => handleButtonClick('Call Now')}
                      className="btn flex-fill d-flex align-items-center justify-content-center gap-2 text-white border-0 rounded"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      <FiPhone />
                      Call Now
                    </button>
                    <button
                      onClick={() => handleButtonClick('WhatsApp')}
                      className="btn flex-fill d-flex align-items-center justify-content-center gap-2 text-white border-0 rounded"
                      style={{
                        backgroundColor: '#25D366',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#20BA5A'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#25D366'
                      }}
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Only show for city and requirement steps */}
          {(currentStep === 'city' || currentStep === 'requirement') && (
            <div className="p-3 border-top bg-white rounded-bottom">
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={currentStep === 'city' ? 'Enter your city...' : 'Describe your requirement...'}
                  className="form-control"
                  style={{ fontSize: '0.9rem' }}
                />
                <button
                  onClick={handleSend}
                  className="btn text-white border-0 rounded"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minWidth: '45px',
                  }}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
