import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin with your project credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": "harielxavierphotography-18d17",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@harielxavierphotography-18d17.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40harielxavierphotography-18d17.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize the app
const app = initializeApp({
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
    content: `<p>Wedding photography is more than just capturing beautiful moments—it's about telling a complete story.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fwedding-storytelling.jpg?alt=media',
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: true
  },
  {
    title: 'Lighting Techniques for Outdoor Portrait Sessions',
    slug: 'lighting-techniques-outdoor-portrait-sessions',
    excerpt: 'Master the art of working with natural light and modifiers for stunning outdoor portraits.',
    content: `<p>Outdoor portrait photography presents unique lighting challenges and opportunities.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Foutdoor-lighting.jpg?alt=media',
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  },
  {
    title: 'Creating Authentic Moments in Engagement Photography',
    slug: 'authentic-moments-engagement-photography',
    excerpt: 'How to guide couples into natural, meaningful interactions during engagement sessions.',
    content: `<p>The most compelling engagement photos capture authentic moments between couples rather than stiff poses.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fengagement-authentic.jpg?alt=media',
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  },
  {
    title: 'Developing a Signature Color Style for Your Photography',
    slug: 'signature-color-style-photography',
    excerpt: 'How to create a consistent, recognizable color palette that defines your photographic brand.',
    content: `<p>A distinctive color style can set your photography apart and make your work instantly recognizable.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fcolor-grading.jpg?alt=media',
    category: 'Editing',
    tags: ['color grading', 'editing', 'photography style'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  },
  {
    title: 'Destination Wedding Photography: A Complete Guide',
    slug: 'destination-wedding-photography-guide',
    excerpt: 'Everything photographers need to know about capturing weddings in unfamiliar locations around the world.',
    content: `<p>Destination weddings offer exciting opportunities and unique challenges for photographers.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fdestination-wedding.jpg?alt=media',
    category: 'Wedding',
    tags: ['destination wedding', 'travel photography', 'wedding planning'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'photography-portfolio-attract-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that resonates with the clients you want to book.',
    content: `<p>Your portfolio is your most powerful marketing tool as a photographer.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fportfolio-building.jpg?alt=media',
    category: 'Business',
    tags: ['portfolio', 'client attraction', 'photography business'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  },
  {
    title: 'Modern Approaches to Family Photography',
    slug: 'modern-approaches-family-photography',
    excerpt: 'Moving beyond traditional posed portraits to create contemporary family images with lasting impact.',
    content: `<p>Family photography has evolved significantly beyond the formal studio portraits of previous generations.</p>`,
    featuredImage: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/blog%2Fmodern-family.jpg?alt=media',
    category: 'Family',
    tags: ['family photography', 'documentary', 'lifestyle'],
    author: {
      name: 'Hariel Xavier',
      avatar: 'https://firebasestorage.googleapis.com/v0/b/harielxavierphotography-18d17.appspot.com/o/team%2Fhariel.jpg?alt=media'
    },
    status: 'published',
    views: 0,
    featured: false
  }
];

// Function to create blog posts
async function createBlogPosts() {
  try {
    console.log('Starting to create blog posts...');
    
    // Reference to the posts collection
    const postsCollection = db.collection('posts');
    
    // Add each blog post
    for (const post of newBlogPosts) {
      // Check if post with this slug already exists
      const existingPosts = await postsCollection.where('slug', '==', post.slug).limit(1).get();
      
      if (existingPosts.empty) {
        // Add timestamp fields
        const now = new Date();
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
try {
  await createBlogPosts();
  console.log('Blog posts creation process completed');
  process.exit(0);
} catch (error) {
  console.error('Failed to create blog posts:', error);
  process.exit(1);
}
