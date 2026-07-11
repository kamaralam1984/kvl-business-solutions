import { getSiteSettings } from '@/lib/models/SiteSettings';
import { renderDownloadShell } from '@/lib/download-page';
import { caseStudies } from '@/lib/data/case-studies';

export async function GET() {
  const settings = await getSiteSettings();

  const body = `
    <h2>Real Products, Live in Production</h2>
    <p>Every project below is a real, working product built by KVL Business Solutions — verifiable today, not a mockup or a representative example.</p>

    ${caseStudies.map(c => `
      <div class="box" style="margin:20px 0">
        <h3>${c.name} <span class="pill">${c.industry}</span></h3>
        <p class="muted">${c.businessCategory} · ${c.url.replace('https://', '')}</p>
        <p><b>Business Challenge:</b> ${c.challenge.body}</p>
        <p><b>Our Solution:</b> ${c.solution.body}</p>
        <p><b>Technology:</b> ${c.tech.join(', ')}</p>
        <img class="shot" src="${c.images.hero}" alt="${c.name} preview" />
      </div>
    `).join('')}
  `;

  const html = renderDownloadShell({
    title: 'KVL Business Solutions — Portfolio',
    tag: 'Portfolio',
    bodyHtml: body,
    settings,
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
