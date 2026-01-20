import ImageSlider from '@/components/ImageSlider'
import ServiceCards from '@/components/ServiceCards'
import AboutSection from '@/components/AboutSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import SolutionsSection from '@/components/SolutionsSection'
import Gallery from '@/components/Gallery'
import ExperienceSection from '@/components/ExperienceSection'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <ImageSlider />
      <ServiceCards />
      <AboutSection />
      <WhyChooseUs />
      <SolutionsSection />
      <Gallery />
      <ExperienceSection />
      <CTASection />
    </main>
  )
}
