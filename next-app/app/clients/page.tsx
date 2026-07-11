import { PageHero } from '@/components/shared/PageHero';
import { Testimonials } from '@/components/home/Testimonials';

export const metadata = {
  title: 'Clients & Testimonials — KVL Business Solutions',
  description: 'See what businesses across healthcare, education, manufacturing, and retail say about working with KVL Business Solutions — verified reviews, not written by us.',
};

export default function ClientsPage() {
  return (
    <>
      <PageHero eyebrow="OUR CLIENTS" title="Client" accent="Reviews" description="Verified reviews from real customers — nothing here is written by us." breadcrumb="Clients" />
      <Testimonials />
    </>
  );
}
