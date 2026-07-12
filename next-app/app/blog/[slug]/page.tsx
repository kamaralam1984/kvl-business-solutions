import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ChevronRight, ArrowUpRight, Clock, Calendar, User, List } from 'lucide-react';
import { DEFAULT_BLOG_AUTHOR, type BlogPost } from '@/lib/data/blog';
import { getLiveBlogPost, getLiveBlogPosts } from '@/lib/data/live-blog';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { JsonLd } from '@/components/shared/JsonLd';
import { ParticleBackground } from '@/components/shared/ParticleBackground';
import { CtaBanner } from '@/components/home/CtaBanner';
import { slugify } from '@/lib/utils';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Re-generated every 5 minutes (and on-demand for slugs not pre-rendered at
// build time) so Admin → Blog posts show up without a full redeploy.
export const revalidate = 300;

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] || Icons.Box;
  return <Cmp className={className} />;
}

export async function generateStaticParams() {
  const posts = await getLiveBlogPosts();
  return posts.map(p => ({ slug: p.slug }));
}

// Ranks other posts against the current one so "Keep Reading" shows the most relevant
// articles first: same category scores highest, shared related service/industry slugs
// add smaller weights, everything else falls back to catalog order to fill remaining slots.
function rankRelatedPosts(current: BlogPost, all: BlogPost[], limit = 3): BlogPost[] {
  const others = all.filter(p => p.slug !== current.slug);
  return others
    .map((p, index) => {
      let score = 0;
      if (p.category === current.category) score += 2;
      score += p.relatedServiceSlugs.filter(s => current.relatedServiceSlugs.includes(s)).length;
      score += p.relatedIndustrySlugs.filter(s => current.relatedIndustrySlugs.includes(s)).length;
      return { p, score, index };
    })
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .slice(0, limit)
    .map(entry => entry.p);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getLiveBlogPost(params.slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: `${SITE}/blog/${post.slug}` },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: `${SITE}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allPosts] = await Promise.all([
    getLiveBlogPost(params.slug),
    getLiveBlogPosts(),
  ]);
  if (!post) notFound();

  const relatedServices = post.relatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter(Boolean) as typeof services;

  const relatedIndustries = post.relatedIndustrySlugs
    .map(slug => industries.find(i => i.slug === slug))
    .filter((i): i is (typeof industries)[number] => Boolean(i));

  const related = rankRelatedPosts(post, allPosts, 3);

  const author = post.author || DEFAULT_BLOG_AUTHOR;

  // Table of Contents built from the post's real section headings, with a slug-per-heading
  // anchor (de-duplicated in case two sections ever share a heading).
  const seenTocSlugs = new Set<string>();
  const toc = post.body.map(sec => {
    const base = slugify(sec.heading);
    let id = base;
    let n = 2;
    while (seenTocSlugs.has(id)) { id = `${base}-${n}`; n += 1; }
    seenTocSlugs.add(id);
    return { heading: sec.heading, id };
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    url: `${SITE}/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    author: { '@id': `${SITE}/#organization` },
    publisher: { '@id': `${SITE}/#organization` },
    articleSection: post.category,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
    ],
  };

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const publishedLabel = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const updatedLabel = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <>
      <JsonLd data={articleJsonLd} id={`blog-${post.slug}-jsonld`} />
      <JsonLd data={breadcrumbJsonLd} id={`blog-${post.slug}-breadcrumb-jsonld`} />
      {faqJsonLd && <JsonLd data={faqJsonLd} id={`blog-${post.slug}-faq-jsonld`} />}

      {/* Hero */}
      <section className="relative pt-20 pb-16 bg-app2 border-b border-tint overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 blueprint pointer-events-none opacity-60" />
        <div className="container relative z-10 max-w-3xl">
          <div className="inline-flex flex-wrap gap-2 mb-6 text-xs text-text2">
            <Link href="/" className="text-primary">Home</Link>
            <ChevronRight className="w-3 h-3 self-center" />
            <Link href="/blog" className="text-primary">Blog</Link>
            <ChevronRight className="w-3 h-3 self-center" />
            <span>{post.title}</span>
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-5" style={{ background: 'rgba(200,168,112,0.1)', color: '#a3814f', border: '1px solid rgba(200,168,112,0.25)' }}>
            {post.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight">{post.title}</h1>
          <p className="text-text2 text-lg mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-5 text-[13px] text-text2">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {publishedLabel}
              {updatedLabel && <span className="text-text2/70"> · Updated {updatedLabel}</span>}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section">
        <div className="container max-w-3xl">
          {toc.length > 1 && (
            <nav aria-label="Table of contents" className="card-base p-6 mb-12">
              <div className="flex items-center gap-2 font-bold text-sm mb-4">
                <List className="w-4 h-4 text-primary" /> In This Article
              </div>
              <ol className="space-y-2">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-text2 hover:text-primary text-[13.5px] leading-snug inline-flex gap-2">
                      <span className="text-text2/60">{i + 1}.</span> {t.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="space-y-12">
            {post.body.map((sec, i) => (
              <div key={i} id={toc[i].id} className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4">{sec.heading}</h2>
                <p className="text-text2 text-[15px] leading-[1.85]">{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services & Industries */}
      {(relatedServices.length > 0 || relatedIndustries.length > 0) && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">Related</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Relevant Services & Industries</h2>
            </div>

            {relatedServices.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-6">
                {relatedServices.map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="card-base p-6 hover:shadow-card-hover transition-all">
                    <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: `${s.color}18`, color: s.color }}>
                      <Icon name={s.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm mb-1.5">{s.name}</h3>
                    <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{s.description}</p>
                  </Link>
                ))}
              </div>
            )}

            {relatedIndustries.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {relatedIndustries.map(ind => (
                  <Link key={ind.slug} href={`/industries/${ind.slug}`} className="card-base p-6 hover:shadow-card-hover transition-all">
                    <div className="w-10 h-10 rounded-xl grid place-items-center mb-4" style={{ background: `${ind.c1}18`, color: ind.c1 }}>
                      <Icon name={ind.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm mb-1.5">{ind.name}</h3>
                    <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2">{ind.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <section className="section">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <span className="eyebrow">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Common Questions</h2>
            </div>
            <div className="space-y-5">
              {post.faq.map(f => (
                <div key={f.q} className="card-base p-6">
                  <div className="font-bold text-sm mb-2">{f.q}</div>
                  <div className="text-text2 text-[13.5px] leading-[1.7]">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More articles */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="text-center mb-10">
              <span className="eyebrow">More From the Knowledge Center</span>
              <h2 className="text-3xl md:text-4xl font-extrabold my-4">Keep Reading</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card-premium p-6 block hover:shadow-card-hover transition-all">
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#a3814f' }}>{r.category}</div>
                  <h3 className="font-bold text-sm mb-2">{r.title}</h3>
                  <p className="text-text2 text-[12.5px] leading-[1.6] line-clamp-2 mb-3">{r.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: '#a3814f' }}>
                    Read <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Ready to talk through your specific setup?"
        desc="Book a free strategy call — a solution architect, not a salesperson, will walk through what actually fits your business."
      />
    </>
  );
}
