'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ArrowRight, Rocket, CreditCard, Box, Plug, AlertCircle, Shield } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { docCategories, docArticles, searchDocs } from '@/lib/data/docs';

const iconMap: Record<string, any> = {
  Rocket, CreditCard, Box, Plug, AlertCircle, Shield,
};

export default function DocsPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchDocs(q), [q]);

  return (
    <>
      <PageHero
        eyebrow="KNOWLEDGE BASE"
        title="How can we"
        accent="help?"
        description="Setup guides, troubleshooting, integrations — search or browse by category."
        breadcrumb="Docs"
      />

      <section className="section">
        <div className="container max-w-4xl">
          <form onSubmit={e => e.preventDefault()} className="relative mb-8">
            <Search className="absolute left-4 top-4 w-5 h-5 text-text2" />
            <input
              autoFocus value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search articles… (e.g., 'invoice', 'login', 'tally')"
              className="form-control pl-12 py-3 text-base"
            />
          </form>

          {q.trim() ? (
            <div>
              <h2 className="text-sm uppercase tracking-wider text-text2 mb-3">{results.length} result{results.length !== 1 ? 's' : ''} for "{q}"</h2>
              {results.length === 0 ? (
                <div className="card-base p-8 text-center">
                  <p className="text-text2 mb-4">No articles matched. Try a different search.</p>
                  <Link href="/support" className="btn btn-primary">Contact Support</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map(a => (
                    <Link key={a.slug} href={`/docs/${a.slug}`} className="card-base p-4 block hover:bg-primary/5 transition-all">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{a.title}</div>
                          <div className="text-xs text-text2 mt-1">{a.description}</div>
                          <div className="text-[10px] text-primary mt-1 uppercase tracking-wider">{docCategories.find(c => c.slug === a.category)?.name}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text2 shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {docCategories.map(c => {
                  const Icon = iconMap[c.icon] || BookOpen;
                  const count = docArticles.filter(a => a.category === c.slug).length;
                  return (
                    <Link key={c.slug} href={`/docs#${c.slug}`} className="card-base p-5 hover:shadow-card-hover transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 grid place-items-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-xs text-text2 mt-1">{c.desc}</div>
                      <div className="text-[10px] text-primary mt-2">{count} article{count !== 1 ? 's' : ''} →</div>
                    </Link>
                  );
                })}
              </div>

              {docCategories.map(c => {
                const articles = docArticles.filter(a => a.category === c.slug);
                if (articles.length === 0) return null;
                const Icon = iconMap[c.icon] || BookOpen;
                return (
                  <div key={c.slug} id={c.slug} className="mb-10">
                    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><Icon className="w-5 h-5 text-primary" /> {c.name}</h2>
                    <div className="space-y-2">
                      {articles.map(a => (
                        <Link key={a.slug} href={`/docs/${a.slug}`} className="card-base p-4 block hover:bg-primary/5 transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">{a.title}</div>
                              <div className="text-xs text-text2 mt-1">{a.description}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text2 shrink-0 mt-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="card-base p-6 surface-tint text-center">
                <p className="font-semibold mb-1">Can't find what you need?</p>
                <p className="text-text2 text-sm mb-4">Our team responds within 4 business hours.</p>
                <Link href="/support" className="btn btn-primary">Contact Support</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
