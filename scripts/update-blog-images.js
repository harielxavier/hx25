#!/usr/bin/env node

// Script to update blog post images in Firestore
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs/promises';
import path from 'path';

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(await fs.readFile('./hxkeyserv.json', 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore();

// Categories and corresponding image paths
const categoryImages = {
  'Wedding': [
    '/images/stock/wedding/wedding-1.jpg',
    '/images/stock/wedding/wedding-5.jpg',
    '/images/stock/wedding/wedding-10.jpg',
    '/images/stock/wedding/wedding-15.jpg',
    '/images/stock/wedding/wedding-20.jpg'
  ],
  'Engagement': [
    '/images/stock/wedding/wedding-25.jpg',
    '/images/stock/wedding/wedding-30.jpg',
    '/images/stock/wedding/wedding-35.jpg'
  ],
  'Portrait': [
    '/images/stock/wedding/wedding-2.jpg',
    '/images/stock/wedding/wedding-7.jpg',
    '/images/stock/wedding/wedding-12.jpg'
  ],
  'Gear': [
    '/images/stock/wedding/wedding-3.jpg',
    '/images/stock/wedding/wedding-8.jpg'
  ],
  'Tips': [
    '/images/stock/wedding/wedding-4.jpg',
    '/images/stock/wedding/wedding-9.jpg',
    '/images/stock/wedding/wedding-14.jpg'
  ],
  'Venues': [
    '/images/stock/wedding/wedding-6.jpg',
    '/images/stock/wedding/wedding-11.jpg',
    '/images/stock/wedding/wedding-16.jpg'
  ]
};

// Default category if none matches
const defaultImages = [
  '/images/stock/wedding/wedding-18.jpg',
  '/images/stock/wedding/wedding-19.jpg',
  '/images/stock/wedding/wedding-21.jpg',
  '/images/stock/wedding/wedding-22.jpg'
];

// Function to get a random image for a category
const getRandomImageForCategory = (category) => {
  const categoryKey = Object.keys(categoryImages).find(key => 
    category.toLowerCase().includes(key.toLowerCase())
  );
  
  const imageArray = categoryKey ? categoryImages[categoryKey] : defaultImages;
  return imageArray[Math.floor(Math.random() * imageArray.length)];
};

// Update blog posts with proper images
const updateBlogPostImages = async () => {
  try {
    const postsRef = db.collection('posts');
    const snapshot = await postsRef.get();
    
    if (snapshot.empty) {
      console.log('No blog posts found');
      return;
    }
    
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const post = doc.data();
      
      // Check if the post needs an image update
      if (!post.featuredImage || post.featuredImage.includes('unsplash') || post.featuredImage.includes('undefined')) {
        // Assign a new image based on the post category
        const newImage = getRandomImageForCategory(post.category || '');
        
        // Update the post
        await postsRef.doc(doc.id).update({
          featuredImage: newImage,
          updatedAt: new Date()
        });
        
        console.log(`Updated image for post: ${post.title} (${doc.id})`);
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} blog posts with new images`);
  } catch (error) {
    console.error('Error updating blog post images:', error);
  }
};

// Run the update function
updateBlogPostImages()
  .then(() => console.log('Blog post image update complete'))
  .catch(err => console.error('Error in update process:', err));
