// Simple script to create 7 sample blog posts using ES modules
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit, where, serverTimestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

/**
 * Creates new blog posts in Firestore
 */
const createNewBlogPosts = async () => {
  try {
    console.log('Creating new blog posts...');
    
    // Add each new post
    const postsRef = collection(db, 'posts');
    
    for (const post of newBlogPosts) {
      const now = serverTimestamp();
      
      // Check if a post with this slug already exists
      const slugQuery = query(postsRef, where('slug', '==', post.slug), limit(1));
      const slugSnapshot = await getDocs(slugQuery);
      
      if (slugSnapshot.empty) {
        await addDoc(collection(db, 'posts'), {
          ...post,
          createdAt: now,
          updatedAt: now,
          publishedAt: now
        });
        console.log(`Added post: ${post.title}`);
      } else {
        console.log(`Post with slug ${post.slug} already exists, skipping`);
      }
    }
    
    console.log('New blog posts creation complete!');
  } catch (error) {
    console.error('Error creating new blog posts:', error);
  }
};

// Execute the function
createNewBlogPosts().then(() => {
  console.log('Successfully created 7 sample blog posts!');
}).catch(err => {
  console.error('Error creating blog posts:', err);
});
