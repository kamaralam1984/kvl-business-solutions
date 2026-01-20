'use client'

import { useState, useEffect, useRef } from 'react'
import { FiBriefcase, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi'

const stats = [
  {
    icon: FiBriefcase,
    count: 500,
    suffix: '+',
    label: 'Projects Completed',
    color: '#667eea',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    icon: FiUsers,
    count: 200,
    suffix: '+',
    label: 'Happy Clients',
    color: '#f5576c',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  },
  {
    icon: FiAward,
    count: 15,
    suffix: '+',
    label: 'Years of Experience',
    color: '#00f2fe',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
  },
  {
    icon: FiTrendingUp,
    count: 98,
    suffix: '%',
    label: 'Client Satisfaction',
    color: '#764ba2',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
]

export default function ExperienceSection() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            stats.forEach((stat, index) => {
              let current = 0
              const increment = stat.count / 50
              const timer = setInterval(() => {
                current += increment
                if (current >= stat.count) {
                  setCounts((prev) => {
                    const newCounts = [...prev]
                    newCounts[index] = stat.count
                    return newCounts
                  })
                  clearInterval(timer)
                } else {
                  setCounts((prev) => {
                    const newCounts = [...prev]
                    newCounts[index] = Math.floor(current)
                    return newCounts
                  })
                }
              }, 30)
            })
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  return (
    <section 
      ref={sectionRef}
      className="py-5 reveal position-relative" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Background Images */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.1, zIndex: 0 }}>
        <div className="row g-0 h-100">
          {stats.map((stat, index) => (
            <div key={index} className="col-3 h-100">
              <img
                src={stat.image}
                alt={stat.label}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3">Experience & Expertise</h2>
          <p className="lead opacity-90">
            Numbers that reflect our commitment to excellence
          </p>
        </div>
        <div className="row g-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="position-relative mb-3">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto"
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <Icon className="fs-1" />
                    </div>
                    <div 
                      className="position-absolute top-0 start-50 translate-middle-x rounded-circle"
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundImage: `url(${stat.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.2,
                        zIndex: -1,
                        transform: 'translate(-50%, 0)',
                      }}
                    ></div>
                  </div>
                  <h3 className="display-4 fw-bold mb-2">
                    {counts[index]}{stat.suffix}
                  </h3>
                  <p className="lead mb-0 opacity-90">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
