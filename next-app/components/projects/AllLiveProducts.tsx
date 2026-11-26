import { hostedProducts } from '@/lib/data/hosted-products';

// Plain list of every product KVL hosts (one card per site). Case studies above are the
// ones with a full write-up; this grid is the complete list so nothing is left out.
export function AllLiveProducts() {
  const liveCount = hostedProducts.filter(p => p.live).length;
  return (
    <div>
      <p className="eyebrow">ALL PRODUCTS WE HOST</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-text mt-2">
        {hostedProducts.length} products, one team
      </h2>
      <p className="text-text2 mt-2 max-w-2xl">
        Every product below is built, deployed and maintained by KVL Business Solutions
        ({liveCount} live right now).
      </p>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {hostedProducts.map(p => (
          <li key={p.host} className="rounded-card border border-line bg-card p-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-text truncate">{p.name}</p>
              <p className="text-sm text-text3 truncate">{p.host}</p>
            </div>
            {p.live ? (
              <a
                href={`https://${p.host}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-semibold text-gold-text hover:underline"
                aria-label={`Visit ${p.name}`}
              >
                Visit ↗
              </a>
            ) : (
              <span className="shrink-0 text-xs font-semibold text-text3 border border-line rounded-full px-2.5 py-1">Coming soon</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
