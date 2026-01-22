'use client'

import { useEffect, useState } from 'react'

const stats = [
  { number: '500+', label: 'Projects Completed', icon: '✓' },
  { number: '200+', label: 'Happy Clients', icon: '👥' },
  { number: '15+', label: 'Years Experience', icon: '⭐' },
  { number: '50+', label: 'Expert Team Members', icon: '🔧' },
]

export default function TrustedBy() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('trusted-by')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="trusted-by" className="py-20 bg-gradient-to-r from-primary-dark to-primary-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Clients Nationwide
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Building lasting relationships through excellence and reliability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-primary-navy/50 p-8 rounded-xl backdrop-blur-sm hover:bg-primary-navy transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-5xl md:text-6xl font-bold text-accent-gold mb-2">
                {isVisible ? stat.number : '0'}
              </div>
              <div className="text-lg text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-300 mb-8">
            Serving Government Departments, Private Companies, Builders, Factories, Institutions, and Event Organizers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="bg-accent-gold text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-orange transition-all duration-300 transform hover:scale-105"
            >
              Get Quote
            </a>
            <a
              href="tel:+919876543210"
              className="bg-white text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Call Now
            </a>
            <a
              href="https://wa.me/919942000413"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#20BA5A] transition-all duration-300 transform hover:scale-105"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
