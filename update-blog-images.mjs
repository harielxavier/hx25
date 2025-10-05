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

// Map of slug to new featured image
const imageUpdates = {
  '15-breathtaking-wedding-venues-new-jersey-2024': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  'top-10-wedding-photo-locations-new-jersey': 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
  'nj-beach-wedding-photography-planning-guide': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'fall-wedding-photography-new-jersey-foliage': 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
  'art-of-wedding-storytelling': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
  'lighting-techniques-outdoor-portrait-sessions': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80',
  'authentic-moments-engagement-photography': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
  'color-grading-consistent-photography-style': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
  'destination-wedding-photography-complete-guide': 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80',
  'building-photography-portfolio-attracts-ideal-clients': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80',
  'modern-approaches-family-photography': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80'
};

async function updateBlogImages() {
  try {
    console.log('Updating blog post images...\n');
    
    const postsRef = collection(db, 'posts');
    let updated = 0;
    let notFound = 0;

    for (const [slug, imageUrl] of Object.entries(imageUpdates)) {
      const q = query(postsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const postDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'posts', postDoc.id), {
          featured_image: imageUrl
        });
        console.log(`✅ Updated image for: ${slug}`);
        updated++;
      } else {
        console.log(`⚠️  Post not found: ${slug}`);
        notFound++;
      }
    }
    
    console.log(`\n🎉 Update complete!`);
    console.log(`   Updated: ${updated} posts`);
    if (notFound > 0) {
      console.log(`   Not found: ${notFound} posts`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating blog images:', error);
    process.exit(1);
  }
}

updateBlogImages();
