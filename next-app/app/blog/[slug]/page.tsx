import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ArrowUpRight, Clock, Calendar, User, List,
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
  type LucideIcon,
} from 'lucide-react';
import { DEFAULT_BLOG_AUTHOR, type BlogPost } from '@/lib/data/blog';
import { getLiveBlogPost, getLiveBlogPosts } from '@/lib/data/live-blog';
import { services } from '@/lib/data/services';
import { industries } from '@/lib/data/industries';
import { JsonLd } from '@/components/shared/JsonLd';
import { Section, SectionHeading, Card } from '@/components/ui';
import { CtaBanner } from '@/components/home/CtaBanner';
import { slugify } from '@/lib/utils';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';

// Re-generated every 5 minutes (and on-demand for slugs not pre-rendered at
// build time) so Admin → Blog posts show up without a full redeploy.
export const revalidate = 300;

const ICON_MAP: Record<string, LucideIcon> = {
  LaptopMinimal, Globe, Smartphone, Satellite, HardHat, Cog, Bot, Video,
  Network, Cloud, Brain, Megaphone, Palette, Users, Contact2, Webhook, Tag,
  Workflow, Factory, Truck, School, Hospital, Store, Building2, Landmark,
  UtensilsCrossed, Wallet, Box,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICON_MAP[name] || Box;
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
      images: [{ url: `/og?title=${encodeURIComponent(post.title)}`, width: 1200, height: 630, alt: post.title }],
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
      <section className="border-b border-line bg-bg2 pt-20 pb-16">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 inline-flex flex-wrap gap-2 text-sm text-text2">
            <Link href="/" className="inline-flex min-h-[44px] items-center text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Home</Link>
            <ChevronRight className="h-3 w-3 self-center" aria-hidden />
            <Link href="/blog" className="inline-flex min-h-[44px] items-center text-gold-text hover:underline focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">Blog</Link>
            <ChevronRight className="h-3 w-3 self-center" aria-hidden />
            <span className="inline-flex items-center">{post.title}</span>
          </nav>

          <span className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-text">
            {post.category}
          </span>

          <h1 className="mb-5 font-display text-hero text-text">{post.title}</h1>
          <p className="mb-6 text-body-lg text-text2">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-text2">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" aria-hidden /> {author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden /> {publishedLabel}
              {updatedLabel && <span className="text-text3"> · Updated {updatedLabel}</span>}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readingTimeMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <Section containerClassName="max-w-3xl">
          {toc.length > 1 && (
            <nav aria-label="Table of contents" className="mb-12 rounded-card border border-line bg-card p-6 shadow-soft-1">
              <div className="mb-4 flex items-center gap-2 text-base font-semibold text-text">
                <List className="h-4 w-4 text-gold-text" aria-hidden /> In This Article
              </div>
              <ol className="space-y-2">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="inline-flex min-h-[44px] items-center gap-2 rounded-btn text-base text-text2 transition-colors duration-base hover:text-gold-text focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                      <span className="text-text3">{i + 1}.</span> {t.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="space-y-12">
            {post.body.map((sec, i) => (
              <div key={i} id={toc[i].id} className="scroll-mt-24">
                <h2 className="mb-4 font-display text-section text-text">{sec.heading}</h2>
                <p className="text-body-lg leading-[1.85] text-text2">{sec.content}</p>
              </div>
            ))}
          </div>
      </Section>

      {/* Related Services & Industries */}
      {(relatedServices.length > 0 || relatedIndustries.length > 0) && (
        <Section tone="alt">
          <SectionHeading align="center" eyebrow="Related" title="Relevant Services & Industries" />

          {relatedServices.length > 0 && (
            <div className="mx-auto mt-10 mb-6 grid max-w-4xl gap-5 sm:grid-cols-3">
              {relatedServices.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                  <Card interactive className="h-full p-6">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-btn bg-gold/15 text-gold-text">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 font-display text-card-title text-text">{s.name}</h3>
                    <p className="line-clamp-2 text-base text-text2">{s.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {relatedIndustries.length > 0 && (
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
              {relatedIndustries.map(ind => (
                <Link key={ind.slug} href={`/industries/${ind.slug}`} className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                  <Card interactive className="h-full p-6">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-btn bg-gold/15 text-gold-text">
                      <Icon name={ind.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1.5 font-display text-card-title text-text">{ind.name}</h3>
                    <p className="line-clamp-2 text-base text-text2">{ind.desc}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* FAQ */}
      {post.faq && post.faq.length > 0 && (
        <Section containerClassName="max-w-3xl">
          <SectionHeading align="center" eyebrow="FAQ" title="Common Questions" />
          <div className="mt-10 space-y-5">
            {post.faq.map(f => (
              <Card key={f.q} className="p-6">
                <h3 className="mb-2 text-base font-semibold text-text">{f.q}</h3>
                <p className="text-base text-text2">{f.a}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* More articles */}
      {related.length > 0 && (
        <Section tone="alt">
          <SectionHeading align="center" eyebrow="More From the Knowledge Center" title="Keep Reading" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {related.map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="block rounded-card focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]">
                <Card interactive className="h-full p-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gold-text">{r.category}</div>
                  <h3 className="mb-2 font-display text-card-title text-text">{r.title}</h3>
                  <p className="mb-3 line-clamp-2 text-base text-text2">{r.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text">
                    Read <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <CtaBanner
        title="Ready to talk through your specific setup?"
        desc="Book a free strategy call — a solution architect, not a salesperson, will walk through what actually fits your business."
      />
    </>
  );
}
