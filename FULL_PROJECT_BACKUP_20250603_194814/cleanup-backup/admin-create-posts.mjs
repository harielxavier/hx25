// Script to create blog posts using Firebase Admin SDK with ES modules
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the service account key
const serviceAccountPath = path.join(__dirname, 'harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize the app with admin privileges
initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore instance
const db = getFirestore();

// Sample blog posts with modern photography topics
const newBlogPosts = [
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
      
      <h2>Follow the Natural Flow</h2>
      <p>The best wedding stories unfold naturally. While having a shot list is important, being present and responsive to unplanned moments often results in the most meaningful images.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fwedding-storytelling.jpg?alt=media',
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: true,
    seoTitle: 'The Art of Wedding Storytelling | Capturing Your Complete Wedding Day',
    seoDescription: 'Learn how professional photographers create a comprehensive visual narrative of your wedding day through thoughtful storytelling techniques.'
  },
  {
    title: 'Lighting Techniques for Outdoor Portrait Sessions',
    slug: 'lighting-techniques-outdoor-portrait-sessions',
    excerpt: 'Master the art of working with natural light and modifiers for stunning outdoor portraits.',
    content: `
      <p>Outdoor portrait photography presents unique lighting challenges and opportunities. This guide will help you master natural light and use modifiers effectively to create stunning portraits in any outdoor setting.</p>
      
      <h2>Understanding Natural Light Quality</h2>
      <p>The quality of natural light varies dramatically throughout the day. This section explores the characteristics of golden hour, blue hour, midday sun, and overcast conditions—and how to work with each effectively.</p>
      
      <h2>Finding and Creating Shade</h2>
      <p>Shade is a portrait photographer's best friend for creating soft, even lighting. Learn how to find optimal shade and how to create it when it's not naturally available.</p>
      
      <h2>Essential Light Modifiers</h2>
      <p>Even in natural settings, modifiers can dramatically improve your portraits. 5-in-1 reflectors, diffusers, and portable flash units are valuable tools for outdoor portrait photographers.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Foutdoor-lighting.jpg?alt=media',
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Outdoor Portrait Lighting | Natural Light Photography Guide',
    seoDescription: 'Learn professional techniques for working with natural light and modifiers to create stunning outdoor portrait photography in any environment.'
  },
  {
    title: 'Creating Authentic Moments in Engagement Photography',
    slug: 'authentic-moments-engagement-photography',
    excerpt: 'How to guide couples into natural, meaningful interactions during engagement sessions.',
    content: `
      <p>The most compelling engagement photos capture authentic moments between couples rather than stiff poses. This guide explores techniques for creating genuine interactions that result in natural, emotional images.</p>
      
      <h2>Building Rapport Before the Camera</h2>
      <p>Authentic moments start with trust. This section covers pre-session communication and in-person techniques to help couples feel comfortable with you and the camera.</p>
      
      <h2>Prompts vs. Poses</h2>
      <p>Rather than positioning couples into static poses, learn how to use action-based prompts that encourage natural movement and genuine emotion.</p>
      
      <h2>Capture the In-Between</h2>
      <p>Often the most genuine moments happen between posed shots. Keep your camera ready to capture laughs, glances, and small gestures that happen spontaneously.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fengagement-authentic.jpg?alt=media',
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Creating Authentic Engagement Photos | Beyond Posed Pictures',
    seoDescription: 'Discover how to guide couples into natural, meaningful interactions that result in authentic engagement photos that truly reflect their relationship.'
  },
  {
    title: 'Developing a Signature Color Style for Your Photography',
    slug: 'signature-color-style-photography',
    excerpt: 'How to create a consistent, recognizable color palette that defines your photographic brand.',
    content: `
      <p>A distinctive color style can set your photography apart and make your work instantly recognizable. This guide explores the process of developing and implementing a signature color approach across your portfolio.</p>
      
      <h2>Color Theory for Photographers</h2>
      <p>Understanding color relationships is essential for developing an intentional style. This section covers basic color theory concepts that photographers should know.</p>
      
      <h2>Analyzing Your Aesthetic Preferences</h2>
      <p>Your signature style should reflect your artistic vision. Learn exercises to identify the color characteristics that resonate with you and complement your subject matter.</p>
      
      <h2>Maintaining Consistency Across Environments</h2>
      <p>Different lighting conditions present challenges for maintaining a consistent look. Learn techniques for adapting your color grading approach while preserving your signature style.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fcolor-grading.jpg?alt=media',
    category: 'Editing',
    tags: ['color grading', 'editing', 'photography style'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Developing a Signature Color Style | Photography Color Grading Guide',
    seoDescription: 'Learn professional color grading techniques to create a consistent, recognizable style across your photography portfolio.'
  },
  {
    title: 'Destination Wedding Photography: A Complete Guide',
    slug: 'destination-wedding-photography-guide',
    excerpt: 'Everything photographers need to know about capturing weddings in unfamiliar locations around the world.',
    content: `
      <p>Destination weddings offer exciting opportunities and unique challenges for photographers. This comprehensive guide covers everything you need to know to successfully photograph weddings anywhere in the world.</p>
      
      <h2>Pre-Trip Planning and Preparation</h2>
      <p>Thorough preparation is essential for destination work. This section covers equipment considerations, travel logistics, backup planning, and location scouting from afar.</p>
      
      <h2>Cultural Awareness and Adaptation</h2>
      <p>Different cultures have different wedding traditions and expectations. Learn how to research and respect cultural elements while still maintaining your photographic style.</p>
      
      <h2>Working with Local Vendors</h2>
      <p>Building relationships with local wedding vendors can enhance your work and provide valuable local knowledge. Learn how to connect and collaborate effectively across cultural and language barriers.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fdestination-wedding.jpg?alt=media',
    category: 'Wedding',
    tags: ['destination wedding', 'travel photography', 'wedding planning'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'The Complete Guide to Destination Wedding Photography',
    seoDescription: 'A comprehensive guide for photographers covering everything you need to know about capturing beautiful destination weddings anywhere in the world.'
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'photography-portfolio-attract-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that resonates with the clients you want to book.',
    content: `
      <p>Your portfolio is your most powerful marketing tool as a photographer. This guide explores how to strategically build and curate a portfolio that attracts your ideal clients while authentically representing your work.</p>
      
      <h2>Defining Your Ideal Client</h2>
      <p>Before you can attract ideal clients, you need to identify who they are. This section walks through exercises to clearly define the clients you want to work with.</p>
      
      <h2>The Psychology of Portfolio Curation</h2>
      <p>Understanding how potential clients view and interpret your work is crucial. Learn the psychological principles that influence how people perceive and respond to photography collections.</p>
      
      <h2>Showcasing Diversity Within Consistency</h2>
      <p>While maintaining a consistent style is important, showing range within that style demonstrates versatility. This section explores how to balance consistency with variety in your portfolio.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fportfolio-building.jpg?alt=media',
    category: 'Business',
    tags: ['portfolio', 'client attraction', 'photography business'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Creating a Client-Attracting Photography Portfolio | Strategic Curation Guide',
    seoDescription: 'Learn how to strategically build and curate a photography portfolio that authentically represents your style while attracting your ideal clients.'
  },
  {
    title: 'Modern Approaches to Family Photography',
    slug: 'modern-approaches-family-photography',
    excerpt: 'Moving beyond traditional posed portraits to create contemporary family images with lasting impact.',
    content: `
      <p>Family photography has evolved significantly beyond the formal studio portraits of previous generations. This guide explores contemporary approaches to creating meaningful family images that reflect authentic connections and modern aesthetics.</p>
      
      <h2>Documentary Family Photography</h2>
      <p>Documentary approaches focus on capturing real family life as it unfolds. This section discusses techniques for observing and photographing genuine family moments without direction or intervention.</p>
      
      <h2>Lifestyle Family Sessions</h2>
      <p>Lifestyle photography blends natural moments with gentle direction. Learn how to guide families into activities and interactions that produce authentic-looking images while ensuring flattering results.</p>
      
      <h2>Environmental Family Portraits</h2>
      <p>Location plays a crucial role in contemporary family photography. This section explores how to use meaningful environments to add context and depth to family portraits.</p>
    `,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fmodern-family.jpg?alt=media',
    category: 'Family',
    tags: ['family photography', 'documentary', 'lifestyle'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Modern Family Photography | Contemporary Approaches and Techniques',
    seoDescription: 'Discover contemporary approaches to family photography that go beyond traditional poses to capture authentic connections and create meaningful images.'
  }
];

// Function to create blog posts
async function createBlogPosts() {
  try {
    console.log('Starting to create blog posts with admin privileges...');
    
    // First, check if the posts collection exists
    const postsCollection = db.collection('posts');
    
    // Add each blog post
    for (const post of newBlogPosts) {
      // Check if post with this slug already exists
      const existingPosts = await postsCollection.where('slug', '==', post.slug).limit(1).get();
      
      if (existingPosts.empty) {
        // Add timestamp fields
        const now = Timestamp.now();
        const postWithTimestamps = {
          ...post,
          createdAt: now,
          updatedAt: now,
          publishedAt: now
        };
        
        // Add the post
        await postsCollection.add(postWithTimestamps);
        console.log(`Added post: ${post.title}`);
      } else {
        console.log(`Post with slug ${post.slug} already exists, skipping`);
      }
    }
    
    console.log('Successfully created all blog posts!');
  } catch (error) {
    console.error('Error creating blog posts:', error);
  }
}

// Execute the function
createBlogPosts()
  .then(() => {
    console.log('Blog posts creation process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to create blog posts:', error);
    process.exit(1);
  });
