/**
 * Blog SEO Optimizer Utility
 * 
 * This utility provides functions to optimize blog posts for SEO:
 * 1. Ensures all posts are published
 * 2. Optimizes meta descriptions and excerpts
 * 3. Adds proper heading structure and internal links
 * 4. Validates and optimizes images using Cloudinary
 * 5. Adds schema markup for better Google indexing
 */

import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { transformImageUrl } from './imageOptimizationUtils';

// SEO Keywords by category
const seoKeywordsByCategory: Record<string, string[]> = {
  'Wedding': [
    'New Jersey wedding photographer',
    'luxury wedding photography',
    'wedding day storytelling',
    'emotional wedding moments',
    'candid wedding photography',
    'best NJ wedding photographer',
    'wedding photography packages'
  ],
  'Engagement': [
    'engagement photo session',
    'New Jersey engagement photographer',
    'romantic engagement photos',
    'outdoor engagement photography',
    'engagement session locations',
    'engagement photo ideas',
    'best time for engagement photos'
  ],
  'Portrait': [
    'professional portrait photographer',
    'family portrait session',
    'outdoor portrait photography',
    'portrait photography tips',
    'natural light portraits',
    'portrait session what to wear',
    'New Jersey portrait photographer'
  ],
  'Photography Tips': [
    'photography lighting tips',
    'camera settings for beginners',
    'how to pose for photos',
    'photography composition rules',
    'best time for outdoor photos',
    'photography gear recommendations',
    'editing tips for photographers'
  ]
};

// Internal links to add to blog posts
const internalLinks = [
  { text: 'wedding photography services', url: '/services' },
  { text: 'engagement sessions', url: '/portfolio/engagement' },
  { text: 'portrait photography', url: '/portfolio/portrait' },
  { text: 'contact us', url: '/contact' },
  { text: 'portfolio', url: '/portfolio' },
  { text: 'wedding photography packages', url: '/pricing' }
];

// Interface for blog post structure
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt: any;
  updatedAt: any;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  views?: number;
  schemaMarkup?: string;
}

// Schema markup templates
export const getBlogPostSchema = (post: BlogPost) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'image': post.featuredImage,
    'author': {
      '@type': 'Person',
      'name': post.author?.name || 'Hariel Xavier'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Hariel Xavier Photography',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://harielxavierphotography.com/logo.png'
      }
    },
    'datePublished': post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    'dateModified': post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    'description': post.excerpt,
    'keywords': post.tags?.join(', ') || '',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://harielxavierphotography.com/blog/${post.slug}`
    }
  };
};

// Function to enhance a blog post with SEO elements
export const enhanceBlogPostSEO = (post: BlogPost): BlogPost => {
  const category = post.category || 'Wedding';
  const keywords = seoKeywordsByCategory[category] || seoKeywordsByCategory['Wedding'];
  
  // Ensure post has proper meta description
  if (!post.excerpt || post.excerpt.length < 120) {
    post.excerpt = generateMetaDescription(post, category);
  }
  
  // Ensure post has proper tags
  if (!post.tags || post.tags.length < 5) {
    post.tags = generateTags(post, category, keywords);
  }
  
  // Enhance content with proper headings, internal links, and structure
  post.content = enhanceContent(post.content, post.title, category, keywords);
  
  // Add schema markup
  post.schemaMarkup = JSON.stringify(getBlogPostSchema(post));
  
  // Ensure post is published
  if (post.status !== 'published') {
    post.status = 'published';
    
    // If not published, set publish date to now
    if (!post.publishedAt) {
      post.publishedAt = Timestamp.now();
    }
  }
  
  // Optimize featured image with Cloudinary if it's not a local image
  if (post.featuredImage && !post.featuredImage.startsWith('/')) {
    try {
      post.featuredImage = transformImageUrl(post.featuredImage, 1200);
    } catch (error) {
      console.error('Error transforming image URL:', error);
      // Keep the original URL if transformation fails
    }
  }
  
  // Update the updatedAt timestamp
  post.updatedAt = Timestamp.now();
  
  return post;
};

// Generate a meta description if one doesn't exist
const generateMetaDescription = (post: BlogPost, category: string): string => {
  const title = post.title;
  
  const templates = [
    `Discover ${title} in this comprehensive guide from Hariel Xavier Photography. Learn professional insights about ${category.toLowerCase()} photography in New Jersey.`,
    `Explore ${title} with expert tips from Hariel Xavier, a leading ${category.toLowerCase()} photographer in New Jersey. Perfect for couples planning their special day.`,
    `Looking for ${category.toLowerCase()} photography inspiration? Read our guide on ${title} and see how Hariel Xavier captures unforgettable moments in New Jersey.`,
    `${title} - A professional photographer's perspective on creating stunning ${category.toLowerCase()} images that tell your unique story in New Jersey.`
  ];
  
  // Choose a random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

// Generate tags for a blog post
const generateTags = (post: BlogPost, category: string, keywords: string[]): string[] => {
  // Start with the category
  const tags = [category.toLowerCase()];
  
  // Add location tags
  tags.push('new jersey');
  tags.push('nj photographer');
  
  // Add some keywords as tags (converted to lowercase)
  const keywordTags = keywords
    .slice(0, 4)
    .map(keyword => keyword.toLowerCase())
    .filter(keyword => keyword.split(' ').length <= 2); // Only use shorter keywords as tags
  
  return [...tags, ...keywordTags];
};

// Enhance content with proper headings, internal links, and structure
const enhanceContent = (content: string, title: string, category: string, keywords: string[]): string => {
  if (!content) {
    return generateDefaultContent(title, category, keywords);
  }
  
  let enhancedContent = content;
  
  // Check if content has proper heading structure (H2, H3)
  if (!content.includes('<h2>') && !content.includes('<h2 ')) {
    // Add section headings if they don't exist
    enhancedContent = addSectionHeadings(enhancedContent, category);
  }
  
  // Add internal links if they don't exist
  if (!content.includes('href="/')) {
    enhancedContent = addInternalLinks(enhancedContent, internalLinks);
  }
  
  // Add a call to action at the end if it doesn't exist
  if (!content.toLowerCase().includes('contact') && !content.toLowerCase().includes('book')) {
    enhancedContent += generateCallToAction(category);
  }
  
  return enhancedContent;
};

// Add section headings to content
const addSectionHeadings = (content: string, category: string): string => {
  // Split content into paragraphs
  const paragraphs = content.split('</p>');
  
  if (paragraphs.length <= 3) {
    return content; // Not enough content to add headings
  }
  
  // Add a heading after the first paragraph
  paragraphs[0] += '</p>';
  
  // Determine headings based on category
  let headings: string[];
  
  switch (category) {
    case 'Wedding':
      headings = [
        '<h2>Why Wedding Photography Matters</h2>',
        '<h2>Our Approach to Wedding Storytelling</h2>',
        '<h2>Tips for Your Wedding Day Photography</h2>'
      ];
      break;
    case 'Engagement':
      headings = [
        '<h2>Planning Your Engagement Session</h2>',
        '<h2>Choosing the Perfect Location</h2>',
        '<h2>What to Wear for Engagement Photos</h2>'
      ];
      break;
    case 'Portrait':
      headings = [
        '<h2>The Art of Portrait Photography</h2>',
        '<h2>Preparing for Your Portrait Session</h2>',
        '<h2>Making Your Portraits Stand Out</h2>'
      ];
      break;
    case 'Photography Tips':
      headings = [
        '<h2>Essential Photography Techniques</h2>',
        '<h2>Equipment Recommendations</h2>',
        '<h2>Post-Processing and Editing Tips</h2>'
      ];
      break;
    default:
      headings = [
        '<h2>Key Considerations</h2>',
        '<h2>Professional Insights</h2>',
        '<h2>Next Steps</h2>'
      ];
  }
  
  // Insert headings at appropriate positions
  const sectionSize = Math.floor((paragraphs.length - 1) / 3);
  
  for (let i = 0; i < headings.length; i++) {
    const position = 1 + (i * sectionSize);
    if (position < paragraphs.length) {
      paragraphs[position] = headings[i] + paragraphs[position];
    }
  }
  
  return paragraphs.join('</p>');
};

// Add internal links to content
const addInternalLinks = (content: string, links: { text: string, url: string }[]): string => {
  let enhancedContent = content;
  
  // Add 2-3 internal links
  const numberOfLinks = Math.min(3, links.length);
  const usedLinks: number[] = [];
  
  for (let i = 0; i < numberOfLinks; i++) {
    // Choose a random link that hasn't been used yet
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * links.length);
    } while (usedLinks.includes(randomIndex));
    
    usedLinks.push(randomIndex);
    const link = links[randomIndex];
    
    // Replace plain text with linked text
    const regex = new RegExp(`\\b${link.text}\\b`, 'i');
    if (enhancedContent.match(regex)) {
      enhancedContent = enhancedContent.replace(
        regex,
        `<a href="${link.url}" title="${link.text}">${link.text}</a>`
      );
    } else {
      // If the exact text doesn't exist, add it to the end of a random paragraph
      const paragraphs = enhancedContent.split('</p>');
      if (paragraphs.length > 3) {
        const randomParagraphIndex = Math.floor(Math.random() * (paragraphs.length - 2)) + 1;
        paragraphs[randomParagraphIndex] = paragraphs[randomParagraphIndex] + 
          ` Learn more about our <a href="${link.url}" title="${link.text}">${link.text}</a>.`;
        enhancedContent = paragraphs.join('</p>');
      }
    }
  }
  
  return enhancedContent;
};

// Generate a call to action
const generateCallToAction = (category: string): string => {
  const ctas = [
    `<div class="cta-container">
      <h3>Ready to Book Your ${category} Session?</h3>
      <p>Contact Hariel Xavier Photography today to discuss your vision and reserve your date. We're excited to create beautiful memories with you!</p>
      <a href="/contact" class="cta-button">Book Now</a>
    </div>`,
    
    `<div class="cta-container">
      <h3>Let's Create Beautiful ${category} Memories Together</h3>
      <p>Hariel Xavier Photography specializes in capturing authentic moments that tell your unique story. Reach out today to learn more about our ${category.toLowerCase()} photography services.</p>
      <a href="/contact" class="cta-button">Get in Touch</a>
    </div>`,
    
    `<div class="cta-container">
      <h3>Interested in Our ${category} Photography?</h3>
      <p>Don't wait to secure your date! Our calendar fills up quickly, especially during peak seasons. Contact us now to check availability and discuss your vision.</p>
      <a href="/contact" class="cta-button">Check Availability</a>
    </div>`
  ];
  
  // Choose a random CTA
  const randomIndex = Math.floor(Math.random() * ctas.length);
  return ctas[randomIndex];
};

// Generate default content if none exists
const generateDefaultContent = (title: string, category: string, _keywords: string[]): string => {
  // Create a template based on the category
  let template = '';
  
  switch (category) {
    case 'Wedding':
      template = `
        <p>${title} is an essential aspect of preserving your special day. At Hariel Xavier Photography, we understand the importance of capturing every emotional moment and beautiful detail of your wedding.</p>
        
        <h2>Why Wedding Photography Matters</h2>
        <p>Your wedding day will be filled with countless precious moments - from the nervous anticipation as you prepare, to the tears of joy during the ceremony, to the celebration on the dance floor. Professional wedding photography ensures these fleeting moments are preserved forever, allowing you to relive your special day for years to come.</p>
        <p>In New Jersey, we're fortunate to have diverse venues ranging from elegant ballrooms to rustic barns to scenic beaches, each offering unique photographic opportunities.</p>
        
        <h2>Our Approach to Wedding Storytelling</h2>
        <p>At Hariel Xavier Photography, we believe in capturing the authentic story of your wedding day. Rather than just taking posed photographs, we focus on documenting genuine emotions and interactions. Our unobtrusive approach allows us to capture candid moments while ensuring you and your guests feel comfortable throughout the day.</p>
        <p>We combine photojournalistic techniques with artistic direction to create a comprehensive wedding collection that truly reflects your unique love story.</p>
        
        <h2>Tips for Your Wedding Day Photography</h2>
        <p>To ensure the best possible wedding photos, consider these professional tips:</p>
        <ul>
          <li>Schedule a pre-wedding venue visit with your photographer</li>
          <li>Allow ample time for photos in your wedding day timeline</li>
          <li>Consider a "first look" session before the ceremony</li>
          <li>Trust your photographer's expertise and creative vision</li>
          <li>Embrace authentic moments rather than focusing on perfection</li>
        </ul>
        <p>Remember that natural light creates the most flattering images, so consider this when planning your ceremony and portrait times.</p>
        
        <h2>Preserving Your Wedding Memories</h2>
        <p>After your wedding day, we carefully select and edit each image to ensure it meets our high standards. Our wedding packages include digital galleries, but we strongly recommend investing in physical albums and prints. There's something special about holding tangible photographs that digital files simply can't replicate.</p>
        
        <div class="cta-container">
          <h3>Ready to Book Your Wedding Photography?</h3>
          <p>Contact Hariel Xavier Photography today to discuss your vision and reserve your date. We're excited to be part of your special day!</p>
          <a href="/contact" class="cta-button">Book Now</a>
        </div>
      `;
      break;
    
    case 'Engagement':
      template = `
        <p>${title} is a wonderful opportunity to capture the excitement and romance of your engagement period. These photos not only commemorate this special time but also allow you to get comfortable with your photographer before the wedding day.</p>
        
        <h2>Planning Your Engagement Session</h2>
        <p>The best engagement photos reflect your personality as a couple. When planning your session, consider locations that are meaningful to your relationship - perhaps where you first met, a favorite date spot, or somewhere that represents your shared interests.</p>
        <p>Timing is also crucial. We recommend scheduling your session approximately 6-8 months before your wedding, which provides plenty of time to use the images for save-the-dates and other wedding stationery.</p>
        
        <h2>Choosing the Perfect Location</h2>
        <p>New Jersey offers countless beautiful locations for engagement photography. From the historic streets of Princeton to the natural beauty of the Shore, there's something for every couple's style.</p>
        <p>Consider how your location choice will complement your wedding photos. If you're having a formal ballroom wedding, you might want more casual, outdoor engagement photos to provide contrast and show another side of your relationship.</p>
        
        <h2>What to Wear for Engagement Photos</h2>
        <p>Clothing choices can significantly impact the look and feel of your engagement photos. Here are some guidelines:</p>
        <ul>
          <li>Choose complementary rather than matching outfits</li>
          <li>Consider bringing a second outfit for variety</li>
          <li>Avoid large logos or distracting patterns</li>
          <li>Select colors that complement your skin tone and the location</li>
          <li>Dress for the season and location</li>
        </ul>
        <p>Most importantly, wear something that makes you feel confident and comfortable. Your ease will show in the photographs.</p>
        
        <h2>Making the Most of Your Session</h2>
        <p>Engagement sessions typically last 1-2 hours, giving us plenty of time to capture a variety of poses and settings. Don't worry if you feel awkward at first - most couples do! We'll guide you through natural poses and interactions that showcase your authentic connection.</p>
        <p>Consider bringing props that reflect your personalities or tell your story - perhaps your pet, sports jerseys from your favorite team, or items related to how you met.</p>
        
        <div class="cta-container">
          <h3>Ready to Book Your Engagement Session?</h3>
          <p>Contact Hariel Xavier Photography today to discuss your vision and reserve your date. Let's create beautiful images that celebrate your love story!</p>
          <a href="/contact" class="cta-button">Book Now</a>
        </div>
      `;
      break;
    
    default:
      template = `
        <p>${title} is an important topic in professional photography that deserves careful consideration. At Hariel Xavier Photography, we've developed expertise in this area through years of experience serving clients throughout New Jersey.</p>
        
        <h2>Key Considerations</h2>
        <p>When approaching this aspect of photography, it's important to consider both technical and artistic elements. The right balance between these factors creates images that are not only visually stunning but also meaningful and impactful.</p>
        <p>Our clients in New Jersey have come to appreciate our attention to detail and commitment to excellence in every project we undertake.</p>
        
        <h2>Professional Insights</h2>
        <p>Based on our experience, here are some professional insights that can help you understand this topic better:</p>
        <ul>
          <li>Quality always takes precedence over quantity</li>
          <li>Preparation is essential for successful outcomes</li>
          <li>Communication ensures expectations are aligned</li>
          <li>Flexibility allows for adaptation to changing circumstances</li>
          <li>Continuous learning keeps our approach fresh and innovative</li>
        </ul>
        <p>These principles guide our work and help us deliver exceptional results for our clients.</p>
        
        <h2>Next Steps</h2>
        <p>If you're interested in learning more about this topic or discussing how our services might meet your needs, we encourage you to reach out. Our team is always happy to answer questions and provide guidance based on your specific situation.</p>
        <p>We serve clients throughout New Jersey and are committed to providing a personalized experience that exceeds expectations.</p>
        
        <div class="cta-container">
          <h3>Ready to Learn More?</h3>
          <p>Contact Hariel Xavier Photography today to discuss your photography needs and how we can help you achieve your vision.</p>
          <a href="/contact" class="cta-button">Get in Touch</a>
        </div>
      `;
  }
  
  return template;
};

// Function to check and optimize all blog posts
export const checkAndOptimizeBlogPosts = async (): Promise<{
  total: number;
  optimized: number;
  published: number;
  unpublished: number;
  postsWithIssues: any[];
}> => {
  try {
    console.log('Starting blog post optimization...');
    
    // Get all blog posts
    const blogPostsRef = collection(db, 'posts');
    const blogPostsSnapshot = await getDocs(blogPostsRef);
    
    if (blogPostsSnapshot.empty) {
      console.log('No blog posts found.');
      return {
        total: 0,
        optimized: 0,
        published: 0,
        unpublished: 0,
        postsWithIssues: []
      };
    }
    
    console.log(`Found ${blogPostsSnapshot.size} blog posts to optimize.`);
    
    // Results summary
    const results = {
      total: blogPostsSnapshot.size,
      optimized: 0,
      published: 0,
      unpublished: 0,
      postsWithIssues: [] as any[]
    };
    
    // Process each blog post
    const updatePromises: Promise<void>[] = [];
    
    blogPostsSnapshot.forEach(docSnapshot => {
      const post = docSnapshot.data() as BlogPost;
      post.id = docSnapshot.id;
      
      console.log(`Checking post: ${post.title}`);
      
      // Check if post is published
      const isPublished = post.status === 'published';
      if (isPublished) {
        results.published++;
      } else {
        results.unpublished++;
        console.log(`- Post "${post.title}" is not published`);
        
        results.postsWithIssues.push({
          id: post.id,
          title: post.title,
          issue: 'Not published'
        });
      }
      
      // Check if post needs optimization
      const needsOptimization = 
        !isPublished || 
        !post.excerpt || 
        post.excerpt.length < 120 || 
        !post.tags || 
        post.tags.length < 3 || 
        !post.content || 
        (!post.content.includes('<h2') && !post.content.includes('<h1')) || 
        !post.content.includes('href="/');
      
      if (needsOptimization) {
        console.log(`- Optimizing post: ${post.title}`);
        
        // Enhance the post with SEO elements
        const enhancedPost = enhanceBlogPostSEO(post);
        
        // Remove the id field before updating
        const { id, ...postData } = enhancedPost;
        
        // Update the post in Firestore
        if (post.id) {
          const postRef = doc(db, 'posts', post.id);
          updatePromises.push(updateDoc(postRef, postData));
        }
        
        results.optimized++;
      }
    });
    
    // Wait for all updates to complete
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Optimized ${updatePromises.length} blog posts.`);
    } else {
      console.log('All blog posts are already optimized.');
    }
    
    return results;
  } catch (error) {
    console.error('Error optimizing blog posts:', error);
    throw error;
  }
};

// Function to get blog post SEO status
export const getBlogPostsSeoStatus = async (): Promise<{
  total: number;
  published: number;
  unpublished: number;
  optimized: number;
  needsOptimization: number;
  posts: any[];
}> => {
  try {
    // Get all blog posts
    const blogPostsRef = collection(db, 'posts');
    const blogPostsSnapshot = await getDocs(blogPostsRef);
    
    if (blogPostsSnapshot.empty) {
      return {
        total: 0,
        published: 0,
        unpublished: 0,
        optimized: 0,
        needsOptimization: 0,
        posts: []
      };
    }
    
    // Results summary
    const results = {
      total: blogPostsSnapshot.size,
      published: 0,
      unpublished: 0,
      optimized: 0,
      needsOptimization: 0,
      posts: [] as any[]
    };
    
    // Process each blog post
    blogPostsSnapshot.forEach(docSnapshot => {
      const post = docSnapshot.data() as BlogPost;
      post.id = docSnapshot.id;
      
      // Check if post is published
      const isPublished = post.status === 'published';
      if (isPublished) {
        results.published++;
      } else {
        results.unpublished++;
      }
      
      // Check if post is optimized
      const isOptimized = 
        isPublished && 
        post.excerpt && 
        post.excerpt.length >= 120 && 
        post.tags && 
        post.tags.length >= 3 && 
        post.content && 
        (post.content.includes('<h2') || post.content.includes('<h1')) && 
        post.content.includes('href="/');
      
      if (isOptimized) {
        results.optimized++;
      } else {
        results.needsOptimization++;
      }
      
      // Add post to results
      results.posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        isPublished,
        isOptimized,
        issues: {
          notPublished: !isPublished,
          noExcerpt: !post.excerpt || post.excerpt.length < 120,
          noTags: !post.tags || post.tags.length < 3,
          noHeadings: !post.content || (!post.content.includes('<h2') && !post.content.includes('<h1')),
          noInternalLinks: !post.content || !post.content.includes('href="/')
        }
      });
    });
    
    return results;
  } catch (error) {
    console.error('Error getting blog posts SEO status:', error);
    throw error;
  }
};
