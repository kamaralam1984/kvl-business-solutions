'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'
import { useUserAuth } from '@/contexts/UserAuthContext'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading, logout } = useUserAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav 
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-light shadow-lg' : 'navbar-light'}`} 
      style={{ 
        zIndex: 1050,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <span 
            className="fs-3 fw-bold"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            KVL
          </span>
          <span className="fs-3 fw-bold ms-2" style={{ color: '#0E0C1D' }}>Business</span>
          <span 
            className="fs-3 fw-bold ms-2"
            style={{ 
              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Solution
          </span>
        </Link>

        <button
          className="navbar-toggler d-lg-none border-0"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{ boxShadow: 'none' }}
        >
          {isMobileMenuOpen ? <FiX className="fs-4" style={{ color: '#667eea' }} /> : <FiMenu className="fs-4" style={{ color: '#667eea' }} />}
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <Link
                  href={link.href}
                  className="nav-link fw-medium px-3"
                  style={{ 
                    color: '#0E0C1D',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0E0C1D'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {!loading && (
              <li className="nav-item ms-2">
                {user ? (
                  <div className="d-flex align-items-center gap-2">
                    <Link
                      href="/user/profile"
                      className="btn btn-outline-secondary px-3 py-2 fw-semibold"
                      style={{ borderRadius: '10px' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user.name}
                    </Link>
                    <button
                      className="btn btn-outline-danger px-3 py-2 fw-semibold"
                      style={{ borderRadius: '10px' }}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/user/login"
                    className="btn btn-outline-secondary px-3 py-2 fw-semibold"
                    style={{ borderRadius: '10px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </li>
            )}
            <li className="nav-item ms-3">
              <Link
                href="/contact"
                className="btn px-4 py-2 fw-semibold text-white border-0"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Quote
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
