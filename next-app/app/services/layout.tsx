import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Enterprise Software & Business Services — Custom Development, ERP, CRM, AI Automation';
const description = "From custom software and enterprise ERP to AI automation, GPS fleet systems and industrial automation — explore KVL's full range of technology and engineering services, delivered by one accountable team.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/services` },
  openGraph: { title, description, url: `${SITE}/services`, type: 'website' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
