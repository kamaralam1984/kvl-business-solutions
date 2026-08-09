import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
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

      <section className="section">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-base p-6 flex flex-col hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-4 text-[11px] font-bold tracking-widest uppercase" style={{ color: '#a3814f' }}>
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'currentColor' }} />
                  <span className="inline-flex items-center gap-1 normal-case font-medium text-text2">
                    <Clock className="w-3 h-3" /> {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="font-bold text-lg mb-2.5 leading-snug">{post.title}</h2>
                <p className="text-text2 text-[13.5px] leading-[1.7] mb-5 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[12px] text-text2 pt-4 border-t border-tint">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: '#a3814f' }}>
                    Read <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a specific question we didn't cover?"
        desc="Talk directly with a solution architect — no sales script, just a straight answer."
      />
    </>
  );
}
