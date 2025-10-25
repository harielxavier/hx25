import { writeFileSync } from 'fs';
import { join } from 'path';

const baseUrl = 'https://harielxavier.com';

const staticRoutes = [
  '/',
  '/about',
  '/portfolio',
  '/services',
  '/contact',
  '/blog',
  '/faq',
  '/testimonials'
];

const blogPosts = [
  'skylands-manor-engagement-photos',
  'glen-gardner-nj-wedding',
  'jersey-city-engagement-photos',
  'nj-wedding-photographer-guide',
  'central-park-engagement-session',
  'ny-wedding-venues',
  'photo-timeline-tips',
  'engagement-photo-outfits'
];

const portfolioGalleries = [
  'weddings',
  'engagement'
];

function generateSitemapXML() {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Add blog posts
  blogPosts.forEach(slug => {
    xml += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add portfolio galleries
  portfolioGalleries.forEach(gallery => {
    xml += `
  <url>
    <loc>${baseUrl}/portfolio/${gallery}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

try {
  const sitemap = generateSitemapXML();
  const publicPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(publicPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}



