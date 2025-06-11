// Firebase cleanup script for blog data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration using environment variables directly
// This avoids the issues with importing the config file
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cleanupBlogData = async () => {
  console.log('Starting blog data cleanup...');

  try {
    // 1. Delete all posts from 'posts' collection
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const deletePromises = [];

    console.log(`Found ${postsSnapshot.size} posts to delete`);
    
    postsSnapshot.forEach((document) => {
      console.log(`Deleting post ${document.id}: ${document.data().title}`);
      deletePromises.push(deleteDoc(doc(db, 'posts', document.id)));
    });

    // Wait for all deletions to complete
    await Promise.all(deletePromises);
    console.log('Successfully deleted all blog posts');

    // 2. Delete any blog-related categories or tags if they exist
    const categoriesSnapshot = await getDocs(collection(db, 'blogCategories'));
    const categoryDeletePromises = [];

    if (categoriesSnapshot.size > 0) {
      console.log(`Found ${categoriesSnapshot.size} blog categories to delete`);
      categoriesSnapshot.forEach((document) => {
        categoryDeletePromises.push(deleteDoc(doc(db, 'blogCategories', document.id)));
      });
      await Promise.all(categoryDeletePromises);
      console.log('Successfully deleted all blog categories');
    }

    // 3. Delete any blog comments if they exist
    const commentsSnapshot = await getDocs(collection(db, 'blogComments'));
    const commentDeletePromises = [];

    if (commentsSnapshot.size > 0) {
      console.log(`Found ${commentsSnapshot.size} blog comments to delete`);
      commentsSnapshot.forEach((document) => {
        commentDeletePromises.push(deleteDoc(doc(db, 'blogComments', document.id)));
      });
      await Promise.all(commentDeletePromises);
      console.log('Successfully deleted all blog comments');
    }

    console.log('Blog data cleanup completed successfully!');
    console.log('You can now run the InitBlog component to create fresh blog posts.');

  } catch (error) {
    console.error('Error during blog data cleanup:', error);
  }
};

// Execute the cleanup
cleanupBlogData();
