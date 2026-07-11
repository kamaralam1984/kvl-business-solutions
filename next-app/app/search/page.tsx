'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { softwareProducts } from '@/lib/data/software';
import { caseStudies } from '@/lib/data/case-studies';
import { PageHero } from '@/components/shared/PageHero';
import { formatINR } from '@/lib/utils';

const pages = [
  { href: '/about', title: 'About KVL', text: 'Our story, mission, leadership team' },
  { href: '/services', title: 'Services', text: 'Software, websites, GPS, civil work, automation, CCTV' },
  { href: '/industries', title: 'Industries', text: 'Manufacturing, retail, logistics, healthcare, education' },
  { href: '/projects', title: 'Projects', text: 'Our delivered projects portfolio' },
  { href: '/clients', title: 'Clients', text: '1000+ businesses we have served' },
  { href: '/website-demos', title: 'Website Demos', text: 'Live website demos for various industries' },
  { href: '/contact', title: 'Contact', text: 'Talk to sales, get a quote' },
  { href: '/support', title: 'Support', text: 'Raise a ticket, talk to support' },
  { href: '/faq', title: 'FAQ', text: 'Frequently asked questions' },
  { href: '/privacy', title: 'Privacy Policy', text: 'How we handle your data' },
  { href: '/terms', title: 'Terms of Service', text: 'Legal terms for using KVL' },
  { href: '/refund-policy', title: 'Refund Policy', text: '30-day money-back guarantee' },
];

function SearchView() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = sp.get('q') || '';
  const [q, setQ] = useState(initial);

  useEffect(() => { setQ(initial); }, [initial]);

  const productResults = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return softwareProducts.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || (p.features || []).join(' ').toLowerCase().includes(term));
  }, [q]);
  const pageResults = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return pages.filter(p => p.title.toLowerCase().includes(term) || p.text.toLowerCase().includes(term));
  }, [q]);
  const projectResults = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return caseStudies.filter(c => c.name.toLowerCase().includes(term) || c.overview.toLowerCase().includes(term) || c.industry.toLowerCase().includes(term));
  }, [q]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); };

  return (
    <>
      <PageHero eyebrow="SEARCH" title="Find what you need" description="Search across our products, pages, and resources." breadcrumb="Search" />
      <section className="section">
        <div className="container max-w-3xl">
          <form onSubmit={submit} className="relative mb-8">
            <SearchIcon className="absolute left-4 top-4 w-5 h-5 text-text2" />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search products, pages…" className="form-control pl-12 text-base py-3" />
          </form>

          {q.trim() && (
            <>
              {productResults.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-bold mb-3 text-sm uppercase text-text2 tracking-wider">Software ({productResults.length})</h2>
                  <div className="space-y-2">
                    {productResults.map(p => (
                      <Link key={p.slug} href={`/software/${p.slug}`} className="block card-base p-4 hover:bg-primary/5 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-xs text-text2 mt-1 line-clamp-2">{p.description}</div>
                          </div>
                          <div className="text-primary font-bold whitespace-nowrap ml-3">{formatINR(p.price)}{p.unit}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {projectResults.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-bold mb-3 text-sm uppercase text-text2 tracking-wider">Projects ({projectResults.length})</h2>
                  <div className="space-y-2">
                    {projectResults.map(c => (
                      <Link key={c.slug} href={`/projects/${c.slug}`} className="block card-base p-4 hover:bg-primary/5 transition-all">
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-text2 mt-1 line-clamp-2">{c.overview}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {pageResults.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-bold mb-3 text-sm uppercase text-text2 tracking-wider">Pages ({pageResults.length})</h2>
                  <div className="space-y-2">
                    {pageResults.map(p => (
                      <Link key={p.href} href={p.href} className="block card-base p-4 hover:bg-primary/5 transition-all">
                        <div className="font-semibold">{p.title}</div>
                        <div className="text-xs text-text2 mt-1">{p.text}</div>
                        <div className="text-xs text-primary mt-1">{p.href}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {productResults.length === 0 && pageResults.length === 0 && projectResults.length === 0 && (
                <div className="card-base p-8 text-center">
                  <p className="text-text2">No results for <b>"{q}"</b>. Try a different search term.</p>
                  <Link href="/contact" className="btn btn-primary mt-4 inline-flex">Contact Us</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="container py-20 text-center">Loading…</div>}><SearchView /></Suspense>;
}
