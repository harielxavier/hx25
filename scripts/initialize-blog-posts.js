// Script to initialize blog posts in Firestore
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase (make sure this matches your firebase/config.ts)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to calculate read time
const calculateReadTime = (content) => {
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 225);
  return Math.max(2, readTimeMinutes); // Minimum 2 minutes read time
};

// Sample blog posts with correct image paths
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
    featuredImage: '/images/stock/blog/blog-the-art-of-wedding-storytelling.jpg',
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-the-art-of-wedding-storytelling.jpg',
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
      
      <h2>Understanding Natural Light</h2>
      <p>The quality of natural light changes throughout the day. Golden hour (shortly after sunrise or before sunset) provides warm, directional light that's flattering for portraits. Midday sun creates harsh shadows that can be challenging but also dramatic when used intentionally.</p>
      
      <h2>Finding Open Shade</h2>
      <p>Open shade—areas shaded from direct sunlight but still receiving ambient light—creates soft, even lighting perfect for portraits. Look for shade from buildings, trees, or other structures, but be mindful of color casts from nearby surfaces.</p>
      
      <h2>Backlighting Techniques</h2>
      <p>Placing your subject with the sun behind them creates a beautiful rim light that separates them from the background. This technique requires proper exposure compensation or fill light to prevent silhouettes (unless that's the desired effect).</p>
      
      <h2>Essential Light Modifiers</h2>
      <p>Even in natural settings, modifiers can dramatically improve your portraits. 5-in-1 reflectors, diffusers, and portable flash units are valuable tools for outdoor portrait photographers.</p>
    `,
    featuredImage: '/images/stock/blog/blog-lighting-techniques-for-outdoor-portrait-sessions.jpg',
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-lighting-techniques-for-outdoor-portrait-sessions.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Natural Light for Outdoor Portrait Photography',
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
      <p>Begin your session by talking with the couple about their relationship. Ask about how they met, their favorite activities together, and what they love about each other. This helps them relax and focuses their minds on their connection.</p>
      
      <h2>Create Movement</h2>
      <p>Static poses rarely capture authentic emotion. Instead, give couples activities that create natural movement: walking together, dancing, or even simple actions like fixing each other's clothing or brushing hair away from each other's faces.</p>
      
      <h2>Use Prompts, Not Poses</h2>
      <p>Rather than positioning limbs and heads, use verbal prompts that elicit genuine reactions. Ask them to whisper something funny in each other's ear, share a secret, or recall their first date. The resulting expressions will be authentic.</p>
      
      <h2>Capture the In-Between</h2>
      <p>Often the most genuine moments happen between posed shots. Keep your camera ready to capture laughs, glances, and small gestures that happen spontaneously.</p>
    `,
    featuredImage: '/images/stock/blog/blog-creating-authentic-moments-in-engagement-photography.jpg',
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-creating-authentic-moments-in-engagement-photography.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Creating Authentic Moments in Engagement Photography | Connection Guide',
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
      
      <h2>Camera Bodies</h2>
      <p>Modern mirrorless cameras offer the perfect balance of image quality, low-light performance, and portability. Look for models with dual card slots, excellent autofocus systems, and good battery life. Always bring at least two camera bodies to every wedding.</p>
      
      <h2>Versatile Lens Selection</h2>
      <p>A typical wedding kit includes a 24-70mm f/2.8 for versatility, a 70-200mm f/2.8 for ceremonies and portraits, and a fast prime like a 35mm or 50mm f/1.4 for low-light situations. Consider adding a macro lens for detail shots.</p>
      
      <h2>Lighting Equipment</h2>
      <p>Even with today's impressive high ISO performance, quality lighting remains essential. Invest in at least two external flashes, light stands, modifiers, and triggers. Consider adding continuous LED lighting for video work.</p>
      
      <h2>Backup Systems</h2>
      <p>Always bring backup for everything: additional camera bodies, batteries, cards, and even a backup lighting system. Wedding days offer no second chances.</p>
    `,
    featuredImage: '/images/stock/blog/blog-essential-gear-for-wedding-photographers-in-2025.jpg',
    category: 'Equipment',
    tags: ['wedding photography', 'camera gear', 'equipment'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-essential-gear-for-wedding-photographers-in-2025.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Essential Photography Gear for Wedding Photographers in 2025',
    seoDescription: 'Discover the must-have camera equipment, lenses, and accessories that every professional wedding photographer needs in their kit for 2025.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'How to Prepare Clients for Their Engagement Session',
    slug: 'prepare-clients-engagement-session',
    excerpt: 'A comprehensive guide to helping couples prepare for a successful and stress-free engagement photoshoot.',
    content: `
      <p>A successful engagement session starts long before the camera comes out. This guide covers everything you need to help your clients prepare for stunning, stress-free engagement photos.</p>
      
      <h2>Create a Detailed Guide</h2>
      <p>Develop a comprehensive PDF guide that covers everything from clothing selection to location ideas. Send this to clients immediately after booking to give them plenty of preparation time.</p>
      
      <h2>Wardrobe Consultation</h2>
      <p>Offer specific advice on clothing choices that photograph well. Recommend complementary (not matching) outfits, and suggest bringing multiple options. Discourage busy patterns and logos that distract from faces and emotions.</p>
      
      <h2>Location Planning</h2>
      <p>Work with the couple to select meaningful locations that reflect their relationship. Consider lighting conditions at different times of day when scheduling, and have backup locations in case of weather issues.</p>
      
      <h2>Set Expectations</h2>
      <p>Many clients feel awkward in front of the camera initially. Reassure them that this is normal and explain your process for helping them feel comfortable. Share examples of previous sessions to show what to expect.</p>
    `,
    featuredImage: '/images/stock/blog/blog-how-to-prepare-clients-for-their-engagement-session.jpg',
    category: 'Engagement',
    tags: ['engagement photography', 'client preparation', 'photography tips'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-how-to-prepare-clients-for-their-engagement-session.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'How to Prepare Clients for a Successful Engagement Photo Session',
    seoDescription: 'Learn how to help couples prepare for their engagement photoshoot with tips on wardrobe selection, location planning, and creating a stress-free experience.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Capturing Emotional Moments: A Guide to Candid Wedding Photography',
    slug: 'capturing-emotional-moments-candid-wedding-photography',
    excerpt: 'Techniques for anticipating and documenting genuine emotions throughout the wedding day.',
    content: `
      <p>The most treasured wedding photos are often the unscripted, emotional moments that tell the authentic story of the day. This guide explores techniques for capturing these fleeting but powerful images.</p>
      
      <h2>Anticipation is Key</h2>
      <p>Great candid photography requires anticipating moments before they happen. Study the wedding timeline to identify emotionally charged moments, like the first look, ceremony readings, and parent dances.</p>
      
      <h2>Observe and Connect</h2>
      <p>Pay attention to relationships and dynamics among family members and friends. Knowing who is particularly close to the couple helps you focus on the right people at the right times.</p>
      
      <h2>Be Unobtrusive</h2>
      <p>Use longer lenses to capture intimate moments without intruding. Position yourself strategically to anticipate action, and consider silent shooting modes on your camera to remain inconspicuous.</p>
      
      <h2>Capture Reactions</h2>
      <p>For every significant moment, remember to photograph not just the action but the reactions of others. When the couple shares their first kiss, turn around and capture the parents' tears or grandparents' smiles.</p>
    `,
    featuredImage: '/images/stock/blog/blog-capturing-emotional-moments-a-guide-to-candid-wedding-photography.jpg',
    category: 'Wedding',
    tags: ['wedding photography', 'candid moments', 'emotional photography'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-capturing-emotional-moments-a-guide-to-candid-wedding-photography.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Capturing Emotional Moments: The Art of Candid Wedding Photography',
    seoDescription: 'Learn professional techniques for anticipating and documenting genuine emotional moments throughout the wedding day for authentic storytelling.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'building-photography-portfolio-attracts-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that effectively attracts your target market.',
    content: `
      <p>Your portfolio is the most powerful marketing tool you have as a photographer. This guide will help you curate a collection that speaks directly to your ideal clients and books more of the work you love.</p>
      
      <h2>Define Your Ideal Client</h2>
      <p>Before selecting a single image, clearly define who you want to attract. Consider demographics, style preferences, budget range, and personality traits. Your portfolio should speak directly to this specific audience.</p>
      
      <h2>Quality Over Quantity</h2>
      <p>A common portfolio mistake is including too many images. Limit yourself to 20-30 of your absolute best photographs that represent your unique style and the type of work you want to attract.</p>
      
      <h2>Consistent Editing Style</h2>
      <p>Your editing approach should be consistent throughout your portfolio. This doesn't mean every image looks identical, but there should be a recognizable aesthetic that becomes your visual signature.</p>
      
      <h2>Show What You Want to Shoot</h2>
      <p>Your portfolio acts as a filter. Include only the types of photography you want to continue doing, in the style you prefer. Clients will book you based on what they see.</p>
      
      <h2>Update Regularly</h2>
      <p>Your portfolio should evolve as your skills and style develop. Schedule quarterly reviews to add new work and remove images that no longer represent your best efforts.</p>
    `,
    featuredImage: '/images/stock/blog/blog-building-a-photography-portfolio-that-attracts-your-ideal-clients.jpg',
    category: 'Business',
    tags: ['portfolio', 'client attraction', 'photography business'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-building-a-photography-portfolio-that-attracts-your-ideal-clients.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Building a Photography Portfolio That Attracts Your Ideal Clients | Curation Guide',
    seoDescription: 'Learn strategic approaches to curating a photography portfolio that effectively attracts your ideal clients while authentically representing your work and style.',
    videoEmbed: '',
    commentsEnabled: true
  }
];

// Main function to create blog posts
async function createBlogPosts() {
  console.log('Starting blog post creation...');
  
  try {
    // Check if we already have posts
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    // Delete existing posts if any
    if (querySnapshot.size > 0) {
      console.log(`Found ${querySnapshot.size} existing posts. Deleting them before creating new ones...`);
      
      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
        console.log(`Deleted post with ID: ${doc.id}`);
      }
    }
    
    console.log(`Creating ${blogPosts.length} blog posts with distributed dates...`);
    
    // Add posts with distributed dates
    for (let i = 0; i < blogPosts.length; i++) {
      try {
        const post = blogPosts[i];
        
        // Create distributed dates - most recent post is today, others go back exactly 2 weeks per post
        const now = new Date();
        const weeksBack = i * 2; // Each post is exactly 2 weeks apart
        const publishedDate = new Date(now);
        publishedDate.setDate(now.getDate() - (weeksBack * 7)); // Go back by the specified number of weeks
        
        const createdDate = new Date(publishedDate);
        createdDate.setDate(publishedDate.getDate() - 3); // Created 3 days before published
        
        // Calculate read time based on content length
        const readTime = calculateReadTime(post.content);
        
        const postData = {
          ...post,
          status: 'published', // Ensure all posts are published
          readTime,
          publishedAt: Timestamp.fromDate(publishedDate),
          createdAt: Timestamp.fromDate(createdDate),
          updatedAt: Timestamp.fromDate(publishedDate)
        };
        
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log(`Added post: ${post.title} with ID: ${docRef.id} (Published: ${publishedDate.toLocaleDateString()})`);
      } catch (error) {
        console.error(`Error adding post "${blogPosts[i].title}":`, error);
      }
    }
    
    console.log('Successfully created blog posts with distributed dates!');
  } catch (error) {
    console.error('Error creating blog posts:', error);
  }
}

// Run the function
createBlogPosts();
