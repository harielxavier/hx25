import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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

// Beautiful, relevant images for each blog post
const imageUpdates = {
  'color-grading-techniques-define-photography-style': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80',
  'essential-gear-wedding-photographers-2025': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80',
  'mastering-client-communication-wedding-photographers': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80',
  'color-grading-consistent-photography-style': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
  'destination-wedding-photography-complete-guide': 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80',
  'modern-approaches-family-photography': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80'
};

async function fixAllBlogImages() {
  try {
    console.log('🎨 Fixing all blog post images...\n');
    
    const postsRef = collection(db, 'posts');
    let updated = 0;
    let skipped = 0;

    for (const [slug, imageUrl] of Object.entries(imageUpdates)) {
      const q = query(postsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const postDoc = querySnapshot.docs[0];
        const currentImage = postDoc.data().featured_image;
        
        // Update if no image or firebase storage image
        if (!currentImage || currentImage.includes('firebasestorage') || currentImage === '') {
          await updateDoc(doc(db, 'posts', postDoc.id), {
            featured_image: imageUrl
          });
          console.log(`✅ Added image to: ${postDoc.data().title}`);
          updated++;
        } else {
          console.log(`⏭️  Already has image: ${postDoc.data().title}`);
          skipped++;
        }
      } else {
        console.log(`⚠️  Post not found: ${slug}`);
      }
    }
    
    console.log(`\n🎉 Image update complete!`);
    console.log(`   ✅ Updated: ${updated} posts`);
    console.log(`   ⏭️  Skipped: ${skipped} posts (already had images)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

fixAllBlogImages();
