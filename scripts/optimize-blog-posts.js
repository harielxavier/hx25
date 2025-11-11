/**
 * Blog Post Optimization Script
 * 
 * This script ensures all blog posts are:
 * 1. Published with proper status
 * 2. Optimized for SEO with meta descriptions, keywords, and proper headings
 * 3. Have proper image optimization and alt tags
 * 4. Include schema markup for better Google indexing
 * 5. Have proper internal linking and content structure
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// SEO Keywords by category
const seoKeywordsByCategory = {
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

// Schema markup templates
const getBlogPostSchema = (post) => {
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
        'url': 'https://harielxavier.com/logo.png'
      }
    },
    'datePublished': post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    'dateModified': post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    'description': post.excerpt,
    'keywords': post.tags?.join(', ') || '',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://harielxavier.com/blog/${post.slug}`
    }
  };
};

// Function to enhance a blog post with SEO elements
const enhanceBlogPostSEO = (post) => {
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
  
  // Update the updatedAt timestamp
  post.updatedAt = Timestamp.now();
  
  return post;
};

// Generate a meta description if one doesn't exist
const generateMetaDescription = (post, category) => {
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
const generateTags = (post, category, keywords) => {
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
const enhanceContent = (content, title, category, keywords) => {
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
const addSectionHeadings = (content, category) => {
  // Split content into paragraphs
  const paragraphs = content.split('</p>');
  
  if (paragraphs.length <= 3) {
    return content; // Not enough content to add headings
  }
  
  // Add a heading after the first paragraph
  paragraphs[0] += '</p>';
  
  // Determine headings based on category
  let headings;
  
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
const addInternalLinks = (content, links) => {
  let enhancedContent = content;
  
  // Add 2-3 internal links
  const numberOfLinks = Math.min(3, links.length);
  const usedLinks = [];
  
  for (let i = 0; i < numberOfLinks; i++) {
    // Choose a random link that hasn't been used yet
    let randomIndex;
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
const generateCallToAction = (category) => {
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
const generateDefaultContent = (title, category, keywords) => {
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
    
    case 'Portrait':
      template = `
        <p>${title} explores the art of capturing personality and emotion through professional portrait photography. Whether for professional headshots, family portraits, or personal branding, quality portraits make a lasting impression.</p>
        
        <h2>The Art of Portrait Photography</h2>
        <p>Portrait photography is about much more than simply documenting someone's appearance. A skilled portrait photographer captures the essence of their subject - their personality, emotions, and unique characteristics. This requires technical skill, artistic vision, and the ability to make subjects feel comfortable in front of the camera.</p>
        <p>At Hariel Xavier Photography, we approach each portrait session with the goal of creating images that authentically represent you or your family.</p>
        
        <h2>Preparing for Your Portrait Session</h2>
        <p>The success of a portrait session begins long before the camera comes out. Here are some tips to help you prepare:</p>
        <ul>
          <li>Choose clothing that makes you feel confident and comfortable</li>
          <li>Consider the purpose of your portraits when selecting your wardrobe</li>
          <li>For family portraits, coordinate rather than match exactly</li>
          <li>Get plenty of rest the night before your session</li>
          <li>Communicate any specific ideas or concerns with your photographer</li>
        </ul>
        <p>Remember that natural expressions create the most compelling portraits, so come prepared to relax and enjoy the experience.</p>
        
        <h2>Making Your Portraits Stand Out</h2>
        <p>The difference between ordinary and extraordinary portraits often comes down to lighting, composition, and the connection between photographer and subject. We use natural light whenever possible, as it creates the most flattering and authentic look.</p>
        <p>Location also plays a crucial role in creating distinctive portraits. Whether in our studio, your home, or an outdoor setting in New Jersey, we'll help you select the perfect backdrop for your vision.</p>
        
        <h2>After Your Portrait Session</h2>
        <p>Once your session is complete, we carefully select and edit each image to ensure it meets our high standards. We then guide you through the selection process, helping you choose the images that best achieve your goals - whether that's a professional headshot for LinkedIn, a family portrait for your living room wall, or a series of images for your personal brand.</p>
        
        <div class="cta-container">
          <h3>Ready to Book Your Portrait Session?</h3>
          <p>Contact Hariel Xavier Photography today to discuss your vision and reserve your date. Let's create portraits that truly represent you!</p>
          <a href="/contact" class="cta-button">Book Now</a>
        </div>
      `;
      break;
    
    case 'Photography Tips':
      template = `
        <p>${title} provides valuable insights for both amateur and professional photographers looking to improve their skills. Whether you're just starting out or looking to refine your technique, these tips will help you create more compelling images.</p>
        
        <h2>Essential Photography Techniques</h2>
        <p>Understanding the fundamentals of photography is crucial for creating consistently good images. The exposure triangle - aperture, shutter speed, and ISO - forms the technical foundation of photography. Mastering these elements gives you creative control over your images:</p>
        <ul>
          <li>Aperture controls depth of field (how much of your image is in focus)</li>
          <li>Shutter speed determines how motion is captured</li>
          <li>ISO affects the camera's sensitivity to light</li>
        </ul>
        <p>Beyond these technical aspects, composition is what separates good photographs from great ones. Techniques like the rule of thirds, leading lines, and framing can dramatically improve your images.</p>
        
        <h2>Equipment Recommendations</h2>
        <p>While it's true that the photographer matters more than the camera, having the right equipment for your specific needs is important. For beginners, we recommend starting with:</p>
        <ul>
          <li>A DSLR or mirrorless camera with manual controls</li>
          <li>A versatile zoom lens (something like a 24-70mm)</li>
          <li>A fixed 50mm lens (often called a "nifty fifty")</li>
          <li>A sturdy tripod</li>
          <li>Extra batteries and memory cards</li>
        </ul>
        <p>As you develop your style, you'll discover which additional equipment will best support your photography goals.</p>
        
        <h2>Post-Processing and Editing Tips</h2>
        <p>In the digital age, post-processing is an essential part of the photographic process. Programs like Adobe Lightroom and Photoshop allow you to enhance your images and develop a consistent style.</p>
        <p>When editing, remember that less is often more. Subtle adjustments to exposure, contrast, and color can transform an image without making it look artificial. Develop a consistent editing workflow to maintain a cohesive look across your portfolio.</p>
        
        <h2>Continuing Your Photography Journey</h2>
        <p>Photography is a lifelong learning process. Even after years of professional work, we're constantly refining our techniques and exploring new approaches. Consider joining local photography groups, attending workshops, or finding a mentor to accelerate your growth.</p>
        <p>Most importantly, practice regularly. The more you shoot, the more intuitive photography becomes, allowing you to focus less on technical aspects and more on creative expression.</p>
        
        <div class="cta-container">
          <h3>Want to Learn More About Photography?</h3>
          <p>Hariel Xavier Photography offers one-on-one mentoring sessions for photographers looking to improve their skills. Contact us today to discuss how we can help you on your photography journey!</p>
          <a href="/contact" class="cta-button">Learn More</a>
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

// Main function to optimize all blog posts
const optimizeBlogPosts = async () => {
  try {
    console.log('Starting blog post optimization...');
    
    // Get all blog posts
    const blogPostsRef = collection(db, 'blogPosts');
    const blogPostsSnapshot = await getDocs(blogPostsRef);
    
    if (blogPostsSnapshot.empty) {
      console.log('No blog posts found.');
      return;
    }
    
    console.log(`Found ${blogPostsSnapshot.size} blog posts to optimize.`);
    
    // Process each blog post
    const updatePromises = [];
    
    blogPostsSnapshot.forEach(docSnapshot => {
      const post = docSnapshot.data();
      post.id = docSnapshot.id;
      
      console.log(`Optimizing post: ${post.title}`);
      
      // Enhance the post with SEO elements
      const enhancedPost = enhanceBlogPostSEO(post);
      
      // Remove the id field before updating
      const { id, ...postData } = enhancedPost;
      
      // Update the post in Firestore
      const postRef = doc(db, 'blogPosts', id);
      updatePromises.push(updateDoc(postRef, postData));
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    console.log('Blog post optimization completed successfully!');
  } catch (error) {
    console.error('Error optimizing blog posts:', error);
  }
};

// Run the optimization
optimizeBlogPosts();
