import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const baseUrl = 'https://harielxavier.com';
const siteTitle = 'Hariel Xavier Photography Blog';
const siteDescription = 'Expert wedding photography tips, venue guides, and behind-the-scenes insights from New Jersey and New York wedding photographer Hariel Xavier.';
const authorEmail = 'contact@harielxavier.com';
const authorName = 'Hariel Xavier';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://egoyqdbolmjfngjzllwl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnb3lxZGJvbG1qZm5nanpsbHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjAyNDgsImV4cCI6MjA3MDI5NjI0OH0.O4Q5-rQbUa2_vGYLjMw7UBpODonjJvgBsrfHlHJhFGk';

const supabase = createClient(supabaseUrl, supabaseKey);

function escapeXml(unsafe) {
  if (!unsafe) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function fetchBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50); // Latest 50 posts

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

function formatRFC822Date(date) {
  if (!date) return new Date().toUTCString();
  return new Date(date).toUTCString();
}

async function generateRSSFeed() {
  const buildDate = new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(authorName)}</copyright>
    <managingEditor>${authorEmail} (${escapeXml(authorName)})</managingEditor>
    <webMaster>${authorEmail} (${escapeXml(authorName)})</webMaster>
    <image>
      <url>${baseUrl}/logo.svg</url>
      <title>${escapeXml(siteTitle)}</title>
      <link>${baseUrl}/blog</link>
    </image>
`;

  // Fetch blog posts
  console.log('Fetching blog posts for RSS feed...');
  const posts = await fetchBlogPosts();
  console.log(`Found ${posts.length} published blog posts for RSS feed`);

  posts.forEach(post => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = formatRFC822Date(post.published_at || post.created_at);
    const author = post.author || authorName;

    // Use featured_image or featuredImage
    const imageUrl = post.featured_image || post.featuredImage || '';
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

    // Clean excerpt and content
    const excerpt = stripHtml(post.excerpt || '');
    const content = post.content || '';

    xml += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(author)}</dc:creator>
      <description>${escapeXml(excerpt)}</description>`;

    if (post.category) {
      xml += `
      <category>${escapeXml(post.category)}</category>`;
    }

    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        xml += `
      <category>${escapeXml(tag)}</category>`;
      });
    }

    if (imageUrl) {
      xml += `
      <enclosure url="${escapeXml(fullImageUrl)}" type="image/jpeg"/>`;
    }

    // Add full content in content:encoded
    if (content) {
      xml += `
      <content:encoded><![CDATA[${content}]]></content:encoded>`;
    }

    xml += `
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return xml;
}

async function main() {
  try {
    console.log('Generating RSS feed from Supabase...');
    const rss = await generateRSSFeed();
    const publicPath = join(process.cwd(), 'public', 'feed.xml');
    writeFileSync(publicPath, rss, 'utf8');
    console.log('✅ RSS feed generated successfully at public/feed.xml');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error);
    process.exit(1);
  }
}

main();
