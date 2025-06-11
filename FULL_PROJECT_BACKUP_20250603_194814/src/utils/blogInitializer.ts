// Blog initialization utilities
import { collection, addDoc, getDocs, query, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getStockImage } from './images';

// Helper function to sanitize image URLs
const sanitizeImageUrl = (url: string | undefined): string => {
  // If URL is undefined, null, or empty string, return a stock image
  if (!url || url === '') {
    return getStockImage('blog');
  }
  
  // If it's a relative path starting with /, it's a valid local image
  if (url.startsWith('/')) {
    return url;
  }
  
  try {
    // Check if URL is valid
    new URL(url);
    
    // Additional validation for common issues
    if (url.includes('undefined') || url === 'null') {
      return getStockImage('blog');
    }
    
    return url;
  } catch (error) {
    // Return a blog stock image if the URL is invalid without logging the error
    return getStockImage('blog');
  }
};

// Sample blog posts with consistent field naming and properly structured data
const blogPosts = [
  {
    title: 'The Art of Wedding Storytelling',
    slug: 'art-of-wedding-storytelling',
    excerpt: 'How to capture the complete narrative of a wedding day through thoughtful photography.',
    content: `
      <p>Wedding photography is more than just capturing beautiful moments—it's about telling a complete story that couples will cherish for a lifetime. In this post, we explore the art of wedding storytelling through photography.</p>
      
      <h2>Start with the Details</h2>
      <p>Every wedding has unique details that set the tone for the day. From the invitation suite to the carefully chosen decor, these elements help establish the visual narrative of your story.</p>
      
      <h2>Document the Emotions</h2>
      <p>The heart of wedding storytelling lies in capturing authentic emotions. The nervous excitement before the ceremony, the joy during the first look, the tears during vows—these emotional moments create the narrative arc of the day.</p>
      
      <h2>Capture the Relationships</h2>
      <p>Weddings bring together important people from all aspects of a couple's life. Documenting these relationships adds depth to the wedding story and preserves connections that might not be captured again.</p>
      
      <h2>Include Environmental Context</h2>
      <p>The venue and surroundings play a crucial role in the wedding story. Wide shots that show the setting provide context and help viewers feel immersed in the day's events.</p>
      
      <h2>Follow the Natural Flow</h2>
      <p>The best wedding stories unfold naturally. While having a shot list is important, being present and responsive to unplanned moments often results in the most meaningful images.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-40.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: true,
    seoTitle: 'The Art of Wedding Storytelling | Capturing Your Complete Wedding Day',
    seoDescription: 'Learn how to document the complete narrative of a wedding day through thoughtful photography that captures emotions, relationships, and meaningful moments.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Lighting Techniques for Outdoor Portrait Sessions',
    slug: 'lighting-techniques-outdoor-portrait-sessions',
    excerpt: 'Master the art of working with natural light and modifiers for stunning outdoor portraits.',
    content: `
      <p>Outdoor portrait photography presents unique lighting challenges and opportunities. This guide will help you master natural light and use modifiers effectively to create stunning portraits in any outdoor setting.</p>
      
      <h2>Understanding the Quality of Light</h2>
      <p>Natural light varies dramatically throughout the day. Morning and evening light offers a soft, golden quality perfect for portraits, while midday sun creates harsh shadows that require different techniques.</p>
      
      <h2>Finding and Using Open Shade</h2>
      <p>Open shade provides even, flattering light for portraits. Look for areas shaded by buildings or large trees with open sky in front to provide gentle illumination.</p>
      
      <h2>Working with Backlighting</h2>
      <p>Placing your subject with the sun behind them creates a beautiful rim light effect. This technique requires careful exposure and potentially fill light or reflectors to properly illuminate your subject's face.</p>
      
      <h2>Essential Light Modifiers</h2>
      <p>Even in natural settings, modifiers can dramatically improve your portraits. 5-in-1 reflectors, diffusers, and portable flash units are valuable tools for outdoor portrait photographers.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-39.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Outdoor Portrait Lighting | Natural Light Photography Guide',
    seoDescription: 'Learn professional techniques for working with natural light and modifiers to create stunning outdoor portrait photography in any environment.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Creating Authentic Moments in Engagement Photography',
    slug: 'authentic-moments-engagement-photography',
    excerpt: 'How to guide couples into natural, meaningful interactions during engagement sessions.',
    content: `
      <p>The most compelling engagement photos capture authentic moments between couples. This post explores techniques for creating genuine interactions that reflect each couple's unique relationship.</p>
      
      <h2>Start with Conversation</h2>
      <p>Begin your session by having couples share their story. Ask about how they met, their proposal, or what they love about each other. This creates emotional connection and natural expressions.</p>
      
      <h2>Movement-Based Prompts</h2>
      <p>Static poses rarely capture authentic emotion. Instead, give couples movement-based prompts: "Walk toward me and whisper something funny in your partner's ear" or "Dance together like no one's watching."</p>
      
      <h2>Create Meaningful Activities</h2>
      <p>Plan activities that reflect the couple's relationship. Whether it's making coffee together, visiting their favorite bookstore, or hiking a meaningful trail, activities create natural moments.</p>
      
      <h2>Capture the In-Between</h2>
      <p>Often the most genuine moments happen between posed shots. Keep your camera ready to capture laughs, glances, and small gestures that happen spontaneously.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-38.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Creating Authentic Moments in Engagement Photography | Natural Couple Photos',
    seoDescription: 'Learn how to guide couples to create genuine, meaningful moments during engagement photo sessions that truly reflect their unique relationship.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Essential Gear for Wedding Photographers in 2025',
    slug: 'essential-gear-wedding-photographers-2025',
    excerpt: 'The must-have equipment for modern wedding photography that balances quality, reliability, and portability.',
    content: `
      <p>The right photography gear can make or break your wedding photography business. This comprehensive guide covers the essential equipment every wedding photographer needs in 2025.</p>
      
      <h2>Camera Bodies: Balancing Features and Size</h2>
      <p>Modern mirrorless cameras offer the perfect balance of image quality, speed, and portability. Look for dual card slots, excellent low-light performance, and reliable autofocus in challenging conditions.</p>
      
      <h2>Versatile Lens Selection</h2>
      <p>A typical wedding kit should include: a 24-70mm f/2.8 for versatility, a 70-200mm f/2.8 for ceremonies and candids, and fast primes like 35mm f/1.4 and 85mm f/1.4 for low light and creative portraits.</p>
      
      <h2>Lighting Equipment</h2>
      <p>At minimum, carry two speedlights with wireless triggers, light stands, and modifiers like bounce cards and small softboxes. These allow for creative lighting in any venue situation.</p>
      
      <h2>Backup Systems</h2>
      <p>Always bring backup for everything: additional camera bodies, batteries, cards, and even a backup lighting system. Wedding days offer no second chances.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Equipment',
    tags: ['wedding photography', 'camera gear', 'equipment'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-37.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Essential Wedding Photography Gear for 2025 | Professional Equipment Guide',
    seoDescription: 'Discover the must-have photography equipment for wedding photographers in 2025, from camera bodies and lenses to lighting and backup systems.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Color Grading Techniques to Define Your Photography Style',
    slug: 'color-grading-techniques-define-photography-style',
    excerpt: 'How to develop and apply consistent color grading that becomes your signature look and attracts your ideal clients.',
    content: `
      <p>Distinctive color grading can define your photography brand and attract clients who resonate with your aesthetic. This guide explores how to develop and implement a consistent color style.</p>
      
      <h2>Finding Your Color Inspiration</h2>
      <p>Before developing your color style, gather inspiration from diverse sources: films, paintings, other photographers, and even interior design. Analyze what attracts you and why certain colors evoke specific emotions.</p>
      
      <h2>Basic Color Theory for Photographers</h2>
      <p>Understanding color relationships is essential. Study complementary colors, analogous colors, and color temperature to make intentional grading decisions that enhance your images.</p>
      
      <h2>Creating Signature Presets</h2>
      <p>Develop a core set of presets that work across different lighting situations but maintain your distinctive look. Consider creating variations for different settings: indoor, outdoor, golden hour, etc.</p>
      
      <h2>Maintaining Consistency Across Projects</h2>
      <p>A cohesive portfolio requires consistent color treatment. Learn how to adapt your signature look to various scenarios while maintaining your recognizable style.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Post-Processing',
    tags: ['editing', 'color grading', 'style development'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-36.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Color Grading Techniques to Define Your Photography Style | Develop Your Look',
    seoDescription: 'Learn how to create and implement consistent color grading that becomes your signature photography style and attracts ideal clients to your business.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Mastering Client Communication for Photographers',
    slug: 'mastering-client-communication-photographers',
    excerpt: 'Effective strategies for clear client communication that leads to better relationships and stunning results.',
    content: `
      <p>Strong client communication skills are as important as your photography technique. This comprehensive guide covers how to communicate effectively with clients throughout their journey with you.</p>
      
      <h2>Setting Clear Expectations</h2>
      <p>The foundation of good client relationships is clear expectations. Learn how to create comprehensive welcome guides, contracts, and pre-shoot questionnaires that align your vision with client needs.</p>
      
      <h2>Effective Pre-Shoot Consultations</h2>
      <p>Discover techniques for conducting consultations that build rapport, gather essential information, and make clients comfortable before they ever step in front of your camera.</p>
      
      <h2>Communication During the Shoot</h2>
      <p>Learn how to give clear, positive direction that helps clients feel confident and natural. Explore the balance between technical instruction and emotional guidance.</p>
      
      <h2>Post-Shoot Client Management</h2>
      <p>Maintain momentum after the shoot with structured communication about timelines, deliverables, and next steps that keeps clients informed and excited.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Business',
    tags: ['client relations', 'communication', 'photography business'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-35.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Client Communication for Photographers | Clear Client Relations',
    seoDescription: 'Learn proven strategies for effective client communication throughout the entire photography process, from inquiry to final delivery.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'building-photography-portfolio-attracts-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that speaks directly to the clients you want to work with.',
    content: `
      <p>Your portfolio is your most powerful marketing tool. This guide explores how to strategically curate images that attract your ideal clients while authentically representing your style.</p>
      
      <h2>Defining Your Ideal Client</h2>
      <p>Before curating your portfolio, clearly define who you want to attract. Create detailed client personas that include demographics, values, aesthetic preferences, and the emotional needs that drive their photography purchases.</p>
      
      <h2>Quality Over Quantity</h2>
      <p>A focused portfolio of 20-30 outstanding images is more effective than hundreds of good ones. Learn how to ruthlessly edit your collection to show only your absolute best work that represents your unique vision.</p>
      
      <h2>Storytelling Through Sequence</h2>
      <p>The order of your images creates a narrative. Discover how to arrange your portfolio to create emotional flow and demonstrate the full range of your capabilities while maintaining coherence.</p>
      
      <h2>Updating Strategically</h2>
      <p>Your portfolio should evolve as your skills and business goals change. Implement a regular review system that keeps your portfolio fresh while consistently representing your core style.</p>
    `,
    featuredImage: getStockImage('wedding'),
    category: 'Business',
    tags: ['portfolio', 'marketing', 'client attraction'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/wedding/wedding-34.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Building a Photography Portfolio That Attracts Your Ideal Clients | Curation Guide',
    seoDescription: 'Learn how to strategically curate a photography portfolio that attracts your ideal clients and authentically showcases your unique style and vision.',
    videoEmbed: '',
    commentsEnabled: true
  }
];

/**
 * Initialize the blog posts collection and create initial posts
 */
export const initializeBlogPosts = async (): Promise<void> => {
  console.log('Starting blog initialization process...');
  
  try {
    // Check if posts collection exists and has any documents
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('Blog posts collection already exists and contains posts. Skipping initialization.');
      return;
    }
    
    console.log('Blog posts collection is empty or does not exist. Creating sample posts...');
    
    // Add all sample posts to Firestore
    const addPostPromises = blogPosts.map(async (post) => {
      try {
        const timestamp = Timestamp.now();
        
        const postData = {
          ...post,
          featuredImage: sanitizeImageUrl(post.featuredImage),
          publishedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log(`Added post: ${post.title} with ID: ${docRef.id}`);
        return docRef.id;
      } catch (error) {
        console.error(`Error adding post "${post.title}":`, error);
        throw error;
      }
    });
    
    await Promise.all(addPostPromises);
    console.log('Successfully initialized all blog posts!');
    
  } catch (error) {
    console.error('Error initializing blog posts:', error);
    throw new Error(`Failed to initialize blog posts: ${error}`);
  }
};

/**
 * Create new blog posts (used for adding more posts after initialization)
 */
export const createNewBlogPosts = async (): Promise<void> => {
  console.log('Creating additional blog posts...');
  
  try {
    // Check if we already have the expected number of posts
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    if (querySnapshot.size >= blogPosts.length) {
      console.log(`Blog already has ${querySnapshot.size} posts. Skipping creation of additional posts.`);
      return;
    }
    
    // Calculate how many more posts we need to add
    const postsToAdd = blogPosts.slice(querySnapshot.size);
    
    if (postsToAdd.length === 0) {
      console.log('No additional posts needed.');
      return;
    }
    
    console.log(`Adding ${postsToAdd.length} more posts...`);
    
    // Add the remaining posts
    for (const post of postsToAdd) {
      try {
        const timestamp = Timestamp.now();
        
        const postData = {
          ...post,
          featuredImage: sanitizeImageUrl(post.featuredImage),
          publishedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log(`Added post: ${post.title} with ID: ${docRef.id}`);
      } catch (error) {
        console.error(`Error adding post "${post.title}":`, error);
      }
    }
    
    console.log('Successfully created additional blog posts!');
  } catch (error) {
    console.error('Error creating new blog posts:', error);
    throw new Error(`Failed to create new blog posts: ${error}`);
  }
};
