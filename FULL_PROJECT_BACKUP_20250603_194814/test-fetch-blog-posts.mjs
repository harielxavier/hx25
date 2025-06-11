// Script to test fetching blog posts using the Firebase client SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "195040006099",
  appId: "1:195040006099:web:4d670ea2b5d859ab606926",
  measurementId: "G-SB0Q9ER7KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchBlogPosts() {
  try {
    console.log('Attempting to fetch blog posts from Firestore...');
    
    // Create a query to get all published posts
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    );
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No blog posts found in Firestore.');
      return;
    }
    
    console.log(`Found ${querySnapshot.size} blog posts in Firestore:`);
    
    // Print details of each post
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`\nPost ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Status: ${data.status}`);
      console.log(`Featured: ${data.featured ? 'Yes' : 'No'}`);
      console.log(`Category: ${data.category}`);
      console.log(`Slug: ${data.slug}`);
      
      // Check if publishedAt exists and is a valid timestamp
      if (data.publishedAt && data.publishedAt.seconds) {
        console.log(`Published At: ${new Date(data.publishedAt.seconds * 1000).toLocaleString()}`);
      } else {
        console.log('Published At: N/A');
      }
    });
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
  }
}

// Run the fetch function
fetchBlogPosts()
  .then(() => console.log('\nBlog post fetch test completed.'))
  .catch(error => console.error('Error in fetch test:', error));
