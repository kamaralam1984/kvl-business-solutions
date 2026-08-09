import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { ProjectFilterBar } from '@/components/projects/ProjectFilterBar';
import { DownloadsSection } from '@/components/widgets/DownloadsSection';
import { getLiveCaseStudies } from '@/lib/data/live-case-studies';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Project Portfolio — Real, Live Products Built by KVL Business Solutions';
const description = 'Real, verifiable software products KVL Business Solutions has designed and engineered — live in production today, not mockups or representative examples.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/projects` },
  openGraph: { title, description, url: `${SITE}/projects`, type: 'website' },
};

export default async function ProjectsPage() {
  const caseStudies = await getLiveCaseStudies();
  return (
    <>
      <PageHero eyebrow="PROJECT PORTFOLIO" title="Real Products," accent="Live in Production" description="Every project below is a real, working product you can visit today — the business challenge it solved, how we built it, and the outcome it created." breadcrumb="Projects" />

      <section className="section">
        <div className="container">
          <ProjectFilterBar studies={caseStudies} />
        </div>
      </section>

      <DownloadsSection />

      <CtaBanner title="Imagine your project on this page next." desc="Let's build something exceptional together." />
    </>
  );
}
