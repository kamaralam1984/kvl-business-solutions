import Link from 'next/link';
import { softwareProducts } from '@/lib/data/software';
import { docArticles } from '@/lib/data/docs';
import { courses } from '@/lib/data/courses';
import { caseStudies } from '@/lib/data/case-studies';
import { industries } from '@/lib/data/industries';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog';
import { countryPages } from '@/lib/data/country-pages';
import { industryLandingPages } from '@/lib/data/industry-landing-pages';
import { PageHero } from '@/components/shared/PageHero';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const title = 'Sitemap | KVL Business Solutions';
const description = 'A full, human-readable directory of every page on the KVL Business Solutions website — services, industries, software, projects, blog and more.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/site-map` },
};

function LinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="card-base p-6">
      <h2 className="font-bold text-sm mb-4 uppercase tracking-wide" style={{ color: '#a3814f' }}>{title}</h2>
      <ul className="space-y-2">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="text-[13.5px] text-text2 hover:text-primary transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteMapPage() {
  return (
    <>
      <PageHero
        eyebrow="SITEMAP"
        title="Every Page,"
        accent="One List"
        description="A complete, human-readable directory of the site — useful if you know roughly what you're looking for but not exactly where it lives."
        breadcrumb="Sitemap"
      />

      <section className="section">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LinkGroup
            title="Company"
            links={[
              { label: 'Home', href: '/' },
              { label: 'About Us', href: '/about' },
              { label: 'Brand', href: '/brand' },
              { label: 'Careers', href: '/careers' },
              { label: 'Clients', href: '/clients' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Contact', href: '/contact' },
              { label: 'Book a Demo', href: '/book-demo' },
              { label: 'Mock Interview', href: '/mock-interview' },
            ]}
          />

          <LinkGroup
            title="Services"
            links={[
              { label: 'All Services', href: '/services' },
              ...services.map(s => ({ label: s.name, href: `/services/${s.slug}` })),
            ]}
          />

          <LinkGroup
            title="Software Products"
            links={[
              { label: 'All Software', href: '/software' },
              ...softwareProducts.map(p => ({ label: p.name, href: `/software/${p.slug}` })),
            ]}
          />

          <LinkGroup
            title="Industries (India)"
            links={[
              { label: 'All Industries', href: '/industries' },
              ...industries.map(i => ({ label: i.name, href: `/industries/${i.slug}` })),
            ]}
          />

          <LinkGroup
            title="Global Delivery"
            links={[
              { label: 'Global Delivery Hub', href: '/global' },
              { label: 'Patna, Bihar Office', href: '/software-development-company-patna' },
              ...countryPages.map(c => ({ label: `Software Development in ${c.countryName}`, href: `/software-development-company-${c.slug}` })),
            ]}
          />

          <LinkGroup
            title="Industry Solutions (International)"
            links={industryLandingPages.map(i => ({ label: i.industryName, href: `/${i.slug}` }))}
          />

          <LinkGroup
            title="Portfolio"
            links={[
              { label: 'All Projects', href: '/projects' },
              { label: 'Website Demos', href: '/website-demos' },
              ...caseStudies.map(c => ({ label: c.name, href: `/projects/${c.slug}` })),
            ]}
          />

          <LinkGroup
            title="Blog"
            links={[
              { label: 'All Articles', href: '/blog' },
              ...blogPosts.map(b => ({ label: b.title, href: `/blog/${b.slug}` })),
            ]}
          />

          <LinkGroup
            title="Knowledge Base"
            links={[
              { label: 'Docs Home', href: '/docs' },
              ...docArticles.map(a => ({ label: a.title, href: `/docs/${a.slug}` })),
            ]}
          />

          <LinkGroup
            title="Learn"
            links={[
              { label: 'Learn Home', href: '/learn' },
              ...courses.map(c => ({ label: c.title, href: `/learn/${c.slug}` })),
            ]}
          />

          <LinkGroup
            title="Support"
            links={[
              { label: 'Support Center', href: '/support' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Downloads', href: '/downloads' },
              { label: 'AI Voice Demo', href: '/voice' },
              { label: 'Search', href: '/search' },
            ]}
          />

          <LinkGroup
            title="Legal"
            links={[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Use', href: '/terms' },
              { label: 'Refund Policy', href: '/refund-policy' },
              { label: 'Shipping Policy', href: '/shipping-policy' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
