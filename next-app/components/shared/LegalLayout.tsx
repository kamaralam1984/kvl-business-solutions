import { PageHero } from './PageHero';

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="LEGAL" title={title} description={`Last updated: ${updated}`} breadcrumb={title} />
      <section className="section">
        <div className="container max-w-3xl prose prose-sm dark:prose-invert">
          <article className="card-base p-8 text-sm leading-7 space-y-4 [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-primary">
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
