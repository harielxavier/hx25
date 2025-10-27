import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const baseUrl = 'https://harielxavier.com';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://egoyqdbolmjfngjzllwl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk';

const supabase = createClient(supabaseUrl, supabaseKey);

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/portfolio', changefreq: 'weekly', priority: '0.9' },
  { url: '/services', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/faq', changefreq: 'monthly', priority: '0.6' },
  { url: '/testimonials', changefreq: 'weekly', priority: '0.7' },
  { url: '/booking', changefreq: 'monthly', priority: '0.8' },
  { url: '/galleries', changefreq: 'weekly', priority: '0.9' }
];

async function fetchBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchBlogPosts:', error);
    return [];
  }
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
}

async function generateSitemapXML() {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Fetch and add blog posts
  console.log('Fetching blog posts from Supabase...');
  const blogPosts = await fetchBlogPosts();
  console.log(`Found ${blogPosts.length} published blog posts`);

  blogPosts.forEach(post => {
    const lastmod = formatDate(post.updated_at || post.published_at);
    xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Get unique categories from blog posts
  try {
    const { data: categories } = await supabase
      .from('posts')
      .select('category')
      .eq('status', 'published');

    if (categories) {
      const uniqueCategories = [...new Set(categories.map(c => c.category).filter(Boolean))];
      console.log(`Found ${uniqueCategories.length} blog categories`);

      uniqueCategories.forEach(category => {
        xml += `
  <url>
    <loc>${baseUrl}/blog?category=${encodeURIComponent(category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  xml += `
</urlset>`;

  return xml;
}

async function main() {
  try {
    console.log('Generating dynamic sitemap from Supabase...');
    const sitemap = await generateSitemapXML();
    const publicPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(publicPath, sitemap, 'utf8');
    console.log('✅ Dynamic sitemap generated successfully at public/sitemap.xml');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
