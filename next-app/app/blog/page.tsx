import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Section, StateMessage } from '@/components/ui';
import { PageHero } from '@/components/shared/PageHero';
import { JsonLd } from '@/components/shared/JsonLd';
import { CtaBanner } from '@/components/home/CtaBanner';
import { getLiveBlogPosts } from '@/lib/data/live-blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

const title = 'Knowledge Center — ERP, GST, GPS & AI Guides for Indian Businesses';
const description = 'Practical, expert-level guides on ERP selection, GST e-invoicing, GPS fleet ROI, AI automation, and custom software decisions — written for Indian business owners, not filler content.';

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/blog` },
  openGraph: { title, description, url: `${SITE}/blog`, type: 'website' },
};

export default async function BlogPage() {
  const blogPosts = await getLiveBlogPosts();
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'KVL Business Solutions Knowledge Center',
    url: `${SITE}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sorted.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} id="blog-collection-jsonld" />

      <PageHero
        eyebrow="KNOWLEDGE CENTER"
        title="Practical Guides,"
        accent="Not Filler"
        description="Real, grounded guidance on ERP, GST compliance, GPS fleet ROI, AI automation, and software buying decisions — written by people who build this software, for people who have to decide whether to buy it."
        breadcrumb="Blog"
        breadcrumbPath={[{ label: 'Blog' }]}
      />

      <Section>
        {sorted.length === 0 ? (
          <StateMessage title="No articles yet" description="New guides are on the way. Check back soon." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-card border border-line bg-card p-6 shadow-soft-1 transition-[transform,box-shadow] duration-base ease-brand hover:-translate-y-0.5 hover:shadow-soft-2 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gold-text">
                  <span>{post.category}</span>
                  <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
                  <span className="inline-flex items-center gap-1 font-medium normal-case tracking-normal text-text2">
                    <Clock className="h-3 w-3" aria-hidden /> {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="mb-2.5 font-display text-card-title text-text">{post.title}</h2>
                <p className="mb-5 flex-1 text-base text-text2">{post.excerpt}</p>
                <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-text2">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gold-text">
                    Read <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <CtaBanner
        title="Have a specific question we didn't cover?"
        desc="Talk directly with a solution architect — no sales script, just a straight answer."
      />
    </>
  );
}
