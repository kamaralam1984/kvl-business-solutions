'use client'

import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Link from 'next/link'

const slides = [
  {
    title: 'One Company - Multiple Professional Solutions',
    subtitle: 'Your Trusted Partner for All Business Needs',
    description: 'From software development to infrastructure projects, we deliver excellence across all sectors.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80',
    cta: 'Explore Services',
  },
  {
    title: 'Technical Excellence & Innovation',
    subtitle: 'Cutting-Edge Solutions for Modern Businesses',
    description: 'Leveraging latest technology to provide scalable and efficient solutions for government and private sectors.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    cta: 'Our Services',
  },
  {
    title: 'Infrastructure & Manpower Solutions',
    subtitle: 'Complete Project Management Services',
    description: 'From civil construction to skilled manpower supply, we handle projects of all scales with precision.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
    cta: 'View Projects',
  },
]

export default function HeroSlider() {
  return (
    <div className="relative h-screen w-full mt-20">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-primary-dark/70"></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl text-accent-gold mb-4 animate-slide-up">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                    <Link
                      href="/contact"
                      className="bg-accent-gold text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-orange transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.cta}
                    </Link>
                    <Link
                      href="tel:+919876543210"
                      className="bg-white text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                      Call Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
