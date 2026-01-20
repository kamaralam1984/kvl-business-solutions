import SolutionsSection from '@/components/SolutionsSection'
import CTASection from '@/components/CTASection'

export default function SolutionsPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Solutions</h1>
          <p className="lead">Industries We Serve</p>
        </div>
      </div>
      <SolutionsSection />
      <CTASection />
    </main>
  )
}
