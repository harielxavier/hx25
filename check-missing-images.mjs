import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkMissingImages() {
  try {
    console.log('Checking for blog posts without images...\n');
    
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    const postsWithoutImages = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.featured_image || data.featured_image.includes('firebasestorage') || data.featured_image === '') {
        postsWithoutImages.push({
          id: doc.id,
          title: data.title,
          slug: data.slug,
          currentImage: data.featured_image || 'NO IMAGE'
        });
      }
    });
    
    console.log(`Found ${postsWithoutImages.length} posts without proper images:\n`);
    postsWithoutImages.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}"`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Current: ${post.currentImage}\n`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMissingImages();
