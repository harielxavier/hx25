// Script to delete all blog posts from Firestore
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

async function deleteAllBlogPosts() {
  try {
    console.log('Starting deletion of all blog posts...');
    
    // Get all documents from the posts collection
    const postsRef = db.collection('posts');
    const snapshot = await postsRef.get();
    
    if (snapshot.empty) {
      console.log('No blog posts found in Firestore. Nothing to delete.');
      return;
    }
    
    console.log(`Found ${snapshot.size} blog posts to delete.`);
    
    // Delete each document
    const batch = db.batch();
    let count = 0;
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      count++;
      console.log(`Queued post for deletion: ${doc.id}`);
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`Successfully deleted ${count} blog posts from Firestore.`);
    
  } catch (error) {
    console.error('Error deleting blog posts:', error);
  }
}

// Run the deletion function
deleteAllBlogPosts()
  .then(() => console.log('Blog post deletion process completed.'))
  .catch(error => console.error('Error in deletion process:', error));
