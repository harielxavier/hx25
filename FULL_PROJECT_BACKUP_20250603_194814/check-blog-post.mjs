// Script to check if blog posts exist in Firestore
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the service account key
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-service-account.json'), 'utf8')
);

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Initialize Firestore
const db = getFirestore(app);

async function checkBlogPosts() {
  try {
    console.log('Checking for blog posts in Firestore...');
    
    // Get all documents from the posts collection
    const postsRef = db.collection('posts');
    const snapshot = await postsRef.get();
    
    if (snapshot.empty) {
      console.log('No blog posts found in Firestore.');
      return;
    }
    
    console.log(`Found ${snapshot.size} blog posts in Firestore:`);
    
    // Print details of each post
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`\nPost ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Status: ${data.status}`);
      console.log(`Featured: ${data.featured ? 'Yes' : 'No'}`);
      console.log(`Category: ${data.category}`);
      console.log(`Slug: ${data.slug}`);
      console.log(`Created At: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A'}`);
      console.log(`Published At: ${data.publishedAt ? new Date(data.publishedAt.seconds * 1000).toLocaleString() : 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error checking blog posts:', error);
  }
}

// Run the check function
checkBlogPosts()
  .then(() => console.log('\nBlog post check completed.'))
  .catch(error => console.error('Error in check process:', error));
