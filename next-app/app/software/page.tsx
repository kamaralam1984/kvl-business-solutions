import { PageHero } from '@/components/shared/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { SoftwareCard } from '@/components/software/SoftwareCard';
import { softwareProducts } from '@/lib/data/software';

export const metadata = { title: 'Software Marketplace — KVL Business Solutions' };

export default function SoftwarePage() {
  return (
    <>
      <PageHero eyebrow="SOFTWARE MARKETPLACE" title="Enterprise Software" accent="Built for India" description="12+ ready-to-deploy software products. Cloud or on-premise. Lifetime support and free installation." breadcrumb="Software" />
      <section className="section">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareProducts.map(p => <SoftwareCard key={p.slug} product={p} />)}
        </div>
      </section>
      <CtaBanner title="Not sure which software fits your business?" desc="Talk to our experts for a personalized recommendation and free 7-day trial." />
    </>
  );
}
