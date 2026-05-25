import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import { docArticles, docCategories } from '@/lib/data/docs';

export function generateStaticParams() {
  return docArticles.map(a => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = docArticles.find(x => x.slug === params.slug);
  if (!a) return { title: 'Article not found' };
  return { title: `${a.title} — KVL Docs`, description: a.description };
}

// Tiny markdown-ish renderer: ## headings, **bold**, lists, paragraphs
function renderContent(content: string) {
  const blocks = content.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="text-lg font-bold mt-6 mb-2">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').map(l => l.replace(/^- /, ''));
      return <ul key={i} className="list-disc pl-5 space-y-1 my-2">{items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />)}</ul>;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').map(l => l.replace(/^\d+\.\s/, ''));
      return <ol key={i} className="list-decimal pl-5 space-y-1 my-2">{items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />)}</ol>;
    }
    return <p key={i} className="my-3 leading-7" dangerouslySetInnerHTML={{ __html: inline(trimmed) }} />;
  });
}

function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, '<code class="surface-tint px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
}

export default function DocArticlePage({ params }: { params: { slug: string } }) {
  const article = docArticles.find(a => a.slug === params.slug);
  if (!article) notFound();
  const category = docCategories.find(c => c.slug === article.category);
  const idx = docArticles.findIndex(a => a.slug === article.slug);
  const prev = idx > 0 ? docArticles[idx - 1] : null;
  const next = idx < docArticles.length - 1 ? docArticles[idx + 1] : null;

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/docs" className="text-sm text-text2 hover:text-primary inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> All articles
      </Link>

      <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">{category?.name}</div>
      <h1 className="text-3xl font-extrabold mb-2">{article.title}</h1>
      <p className="text-text2 mb-6">{article.description}</p>

      <div className="flex flex-wrap gap-3 text-xs text-text2 mb-8 pb-6 border-b border-tint">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Updated {article.updated}</span>
        {article.tags.map(t => (
          <span key={t} className="flex items-center gap-1 surface-tint px-2 py-0.5 rounded-full">
            <Tag className="w-2.5 h-2.5" /> {t}
          </span>
        ))}
      </div>

      <article className="text-sm">{renderContent(article.content)}</article>

      <div className="mt-10 pt-6 border-t border-tint surface-tint p-5 rounded-xl">
        <p className="font-semibold text-sm mb-1">Was this helpful?</p>
        <p className="text-xs text-text2 mb-3">If not, raise a ticket and we'll improve this article.</p>
        <Link href="/support" className="btn btn-ghost text-xs">Contact support →</Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="card-base p-4 hover:bg-primary/5 group">
            <div className="text-xs text-text2 flex items-center gap-1 mb-1"><ArrowLeft className="w-3 h-3" /> Previous</div>
            <div className="font-semibold text-sm group-hover:text-primary">{prev.title}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/docs/${next.slug}`} className="card-base p-4 hover:bg-primary/5 group text-right">
            <div className="text-xs text-text2 flex items-center gap-1 mb-1 justify-end">Next <ArrowRight className="w-3 h-3" /></div>
            <div className="font-semibold text-sm group-hover:text-primary">{next.title}</div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
