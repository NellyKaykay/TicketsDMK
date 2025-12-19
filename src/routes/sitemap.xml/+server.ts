import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const SITE_URL = 'https://ticketsdmk.com';

function urlEntry(loc: string, priority = '0.7', changefreq = 'weekly', lastmod?: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
}

export const GET: RequestHandler = async () => {
  // Static routes to always include
  const staticRoutes = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/concerts`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_URL}/proximos-eventos`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_URL}/tickets`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${SITE_URL}/login`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${SITE_URL}/register`, priority: '0.4', changefreq: 'monthly' }
  ];

  let dynamicEntries: string[] = [];

  try {
    // Try to fetch from a common table name 'events' first
    let { data, error } = await supabase.from('events').select('id,slug,city,updated_at').limit(1000);

    if (error || !data || data.length === 0) {
      // Fallback to 'concerts' table name
      const res = await supabase.from('concerts').select('id,slug,city,updated_at').limit(1000);
      data = res.data as any[] | null;
      error = res.error;
    }

    if (!error && data) {
      // Build URL entries from rows
      for (const row of data) {
        // Prefer explicit slug
        if (row.slug) {
          dynamicEntries.push(urlEntry(`${SITE_URL}/events/${row.slug}`, '0.7', 'weekly', row.updated_at));
        } else if (row.city) {
          const citySlug = String(row.city).toLowerCase().replace(/\s+/g, '-');
          dynamicEntries.push(urlEntry(`${SITE_URL}/events/${citySlug}`, '0.7', 'weekly', row.updated_at));
        } else if (row.id) {
          dynamicEntries.push(urlEntry(`${SITE_URL}/events/${row.id}`, '0.6', 'weekly', row.updated_at));
        }
      }
    }
  } catch (e) {
    // If Supabase fails, just return the static routes sitemap
    console.error('sitemap: supabase fetch failed', e);
  }

  const urls = [
    ...staticRoutes.map(r => urlEntry(r.loc, r.priority, r.changefreq)),
    ...dynamicEntries
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
