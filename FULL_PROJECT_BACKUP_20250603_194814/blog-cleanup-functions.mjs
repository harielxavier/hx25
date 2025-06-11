import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, storage } from './src/firebase/config.js';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';

// 1. Remove draft posts older than a specified date
async function cleanupOldDraftPosts(daysOld = 90) {
  console.log(`Cleaning up draft posts older than ${daysOld} days...`);
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = cutoffDate.getTime() / 1000;
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      // Check if it's a draft and older than the cutoff date
      if (
        postData.status === 'draft' && 
        postData.updatedAt && 
        postData.updatedAt.seconds < cutoffTimestamp
      ) {
        await deleteDoc(doc(db, 'posts', postDoc.id));
        count++;
        console.log(`Deleted old draft post: ${postData.title || postDoc.id}`);
      }
    }
    
    console.log(`Deleted ${count} old draft posts`);
  } catch (error) {
    console.error('Error cleaning up old draft posts:', error);
  }
}

// 2. Optimize blog post images (remove unused images from storage)
async function cleanupUnusedBlogImages() {
  console.log('Cleaning up unused blog images...');
  
  try {
    // Get all posts to check which images are in use
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    // Create a set of all image URLs used in posts
    const usedImages = new Set();
    
    postsSnapshot.docs.forEach(postDoc => {
      const postData = postDoc.data();
      
      // Add featured image
      if (postData.featuredImage || postData.image) {
        const imageUrl = postData.featuredImage || postData.image;
        usedImages.add(imageUrl);
      }
      
      // Add SEO image
      if (postData.seo && postData.seo.ogImage) {
        usedImages.add(postData.seo.ogImage);
      }
      
      // Check for images in content (simple regex check)
      if (postData.content) {
        const imgRegex = /src=["'](https:\/\/[^"']+)["']/g;
        let match;
        while ((match = imgRegex.exec(postData.content)) !== null) {
          usedImages.add(match[1]);
        }
      }
    });
    
    // List all images in the blog-images folder
    const blogImagesRef = ref(storage, 'blog-images');
    const imagesList = await listAll(blogImagesRef);
    
    let count = 0;
    
    // Check each image to see if it's used
    for (const imageRef of imagesList.items) {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${imageRef.bucket}/o/${encodeURIComponent(imageRef.fullPath)}?alt=media`;
      
      if (!usedImages.has(imageUrl)) {
        await deleteObject(imageRef);
        count++;
        console.log(`Deleted unused image: ${imageRef.name}`);
      }
    }
    
    console.log(`Deleted ${count} unused blog images`);
  } catch (error) {
    console.error('Error cleaning up unused blog images:', error);
  }
}

// 3. Fix missing slugs in blog posts
async function fixMissingSlugs() {
  console.log('Fixing missing slugs in blog posts...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      // Check if slug is missing or empty
      if (!postData.slug) {
        // Generate slug from title or use ID
        let slug = '';
        
        if (postData.title) {
          slug = postData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        } else {
          slug = postDoc.id;
        }
        
        // Update the post with the new slug
        await updateDoc(doc(db, 'posts', postDoc.id), { slug });
        count++;
        console.log(`Fixed missing slug for post: ${postData.title || postDoc.id} -> ${slug}`);
      }
    }
    
    console.log(`Fixed ${count} posts with missing slugs`);
  } catch (error) {
    console.error('Error fixing missing slugs:', error);
  }
}

// 4. Remove HTML tags from excerpts
async function cleanupExcerptHtml() {
  console.log('Cleaning up HTML tags from excerpts...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      // Check if excerpt contains HTML tags
      if (postData.excerpt && /<[^>]*>/g.test(postData.excerpt)) {
        // Remove HTML tags
        const cleanExcerpt = postData.excerpt.replace(/<[^>]*>/g, '');
        
        // Update the post with the clean excerpt
        await updateDoc(doc(db, 'posts', postDoc.id), { excerpt: cleanExcerpt });
        count++;
        console.log(`Cleaned HTML from excerpt for post: ${postData.title || postDoc.id}`);
      }
    }
    
    console.log(`Cleaned HTML from ${count} post excerpts`);
  } catch (error) {
    console.error('Error cleaning up excerpt HTML:', error);
  }
}

// 5. Update read time for all posts
async function updateReadTimes() {
  console.log('Updating read times for all posts...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      // Calculate read time based on content length
      if (postData.content) {
        const wordsPerMinute = 200;
        const wordCount = postData.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        const readTimeStr = `${readTime} min read`;
        
        // Only update if read time is different
        if (postData.readTime !== readTimeStr) {
          await updateDoc(doc(db, 'posts', postDoc.id), { readTime: readTimeStr });
          count++;
          console.log(`Updated read time for post: ${postData.title || postDoc.id} -> ${readTimeStr}`);
        }
      }
    }
    
    console.log(`Updated read times for ${count} posts`);
  } catch (error) {
    console.error('Error updating read times:', error);
  }
}

// 6. Fix missing SEO metadata
async function fixMissingSeoMetadata() {
  console.log('Fixing missing SEO metadata...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      let needsUpdate = false;
      
      // Create SEO object if it doesn't exist
      const seo = postData.seo || {};
      
      // Fix missing SEO title
      if (!seo.title && postData.title) {
        seo.title = postData.title;
        needsUpdate = true;
      }
      
      // Fix missing SEO description
      if (!seo.description && postData.excerpt) {
        seo.description = postData.excerpt;
        needsUpdate = true;
      }
      
      // Fix missing SEO keywords
      if (!seo.keywords || seo.keywords.length === 0) {
        seo.keywords = postData.tags || [];
        needsUpdate = true;
      }
      
      // Fix missing SEO image
      if (!seo.ogImage && (postData.featuredImage || postData.image)) {
        seo.ogImage = postData.featuredImage || postData.image;
        needsUpdate = true;
      }
      
      // Update the post if any SEO fields were fixed
      if (needsUpdate) {
        await updateDoc(doc(db, 'posts', postDoc.id), { seo });
        count++;
        console.log(`Fixed SEO metadata for post: ${postData.title || postDoc.id}`);
      }
    }
    
    console.log(`Fixed SEO metadata for ${count} posts`);
  } catch (error) {
    console.error('Error fixing SEO metadata:', error);
  }
}

// 7. Remove duplicate tags from posts
async function removeDuplicateTags() {
  console.log('Removing duplicate tags from posts...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      // Check if post has tags
      if (postData.tags && Array.isArray(postData.tags) && postData.tags.length > 0) {
        // Convert tags to lowercase and remove duplicates
        const originalTags = postData.tags;
        const uniqueTags = Array.from(new Set(originalTags.map(tag => tag.toLowerCase())));
        
        // Only update if there were duplicates
        if (uniqueTags.length !== originalTags.length) {
          await updateDoc(doc(db, 'posts', postDoc.id), { tags: uniqueTags });
          count++;
          console.log(`Removed duplicate tags for post: ${postData.title || postDoc.id}`);
        }
      }
    }
    
    console.log(`Removed duplicate tags from ${count} posts`);
  } catch (error) {
    console.error('Error removing duplicate tags:', error);
  }
}

// 8. Fix missing author information
async function fixMissingAuthorInfo() {
  console.log('Fixing missing author information...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    // Default author information
    const defaultAuthor = {
      name: 'Hariel Xavier',
      avatar: '/images/author.jpg',
      bio: 'Professional photographer with over 10 years of experience capturing life\'s precious moments.'
    };
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      let needsUpdate = false;
      
      // Check if author info is missing or incomplete
      if (!postData.author) {
        // Author is completely missing
        await updateDoc(doc(db, 'posts', postDoc.id), { author: defaultAuthor });
        count++;
        console.log(`Added missing author for post: ${postData.title || postDoc.id}`);
      } else {
        // Check for incomplete author info
        const author = { ...postData.author };
        
        if (!author.name) {
          author.name = defaultAuthor.name;
          needsUpdate = true;
        }
        
        if (!author.avatar) {
          author.avatar = defaultAuthor.avatar;
          needsUpdate = true;
        }
        
        if (!author.bio) {
          author.bio = defaultAuthor.bio;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await updateDoc(doc(db, 'posts', postDoc.id), { author });
          count++;
          console.log(`Fixed incomplete author info for post: ${postData.title || postDoc.id}`);
        }
      }
    }
    
    console.log(`Fixed author information for ${count} posts`);
  } catch (error) {
    console.error('Error fixing author information:', error);
  }
}

// 9. Normalize categories (ensure consistent capitalization)
async function normalizeCategories() {
  console.log('Normalizing blog categories...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    // Get all categories and create a mapping to normalized versions
    const categories = new Map();
    
    postsSnapshot.docs.forEach(postDoc => {
      const postData = postDoc.data();
      if (postData.category) {
        const category = postData.category.trim();
        const lowerCategory = category.toLowerCase();
        
        // If this is a new category (case-insensitive), add it to the map
        if (!Array.from(categories.keys()).some(key => key.toLowerCase() === lowerCategory)) {
          // Use the first occurrence as the normalized version
          categories.set(category, category);
        }
      }
    });
    
    // Update posts with normalized categories
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      if (postData.category) {
        const currentCategory = postData.category.trim();
        const lowerCategory = currentCategory.toLowerCase();
        
        // Find the normalized version
        const normalizedCategory = Array.from(categories.entries())
          .find(([key]) => key.toLowerCase() === lowerCategory)?.[1];
        
        // Update if different from current
        if (normalizedCategory && normalizedCategory !== currentCategory) {
          await updateDoc(doc(db, 'posts', postDoc.id), { category: normalizedCategory });
          count++;
          console.log(`Normalized category for post: ${postData.title || postDoc.id} (${currentCategory} -> ${normalizedCategory})`);
        }
      }
    }
    
    console.log(`Normalized categories for ${count} posts`);
  } catch (error) {
    console.error('Error normalizing categories:', error);
  }
}

// 10. Clean up broken links in post content
async function cleanupBrokenLinks() {
  console.log('Cleaning up broken links in post content...');
  
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    if (postsSnapshot.empty) {
      console.log('No posts found');
      return;
    }
    
    let count = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      if (postData.content) {
        // Find links in the content
        const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g;
        let content = postData.content;
        let match;
        let hasChanges = false;
        
        // Check each link
        while ((match = linkRegex.exec(postData.content)) !== null) {
          const fullLink = match[0];
          const url = match[1];
          const linkText = match[2];
          
          // Check for common broken link patterns
          if (
            url.includes('undefined') || 
            url === '#' || 
            url === 'javascript:void(0)' ||
            url.includes('localhost') ||
            url.includes('127.0.0.1')
          ) {
            // Replace the link with just the text
            content = content.replace(fullLink, linkText);
            hasChanges = true;
            console.log(`Removed broken link (${url}) from post: ${postData.title || postDoc.id}`);
          }
        }
        
        // Update the post if any links were fixed
        if (hasChanges) {
          await updateDoc(doc(db, 'posts', postDoc.id), { content });
          count++;
          console.log(`Fixed broken links in post: ${postData.title || postDoc.id}`);
        }
      }
    }
    
    console.log(`Fixed broken links in ${count} posts`);
  } catch (error) {
    console.error('Error cleaning up broken links:', error);
  }
}

// Main function to run all cleanup functions
async function runAllCleanupFunctions() {
  console.log('Starting blog cleanup...');
  
  try {
    // Run all cleanup functions
    await cleanupOldDraftPosts();
    await cleanupUnusedBlogImages();
    await fixMissingSlugs();
    await cleanupExcerptHtml();
    await updateReadTimes();
    await fixMissingSeoMetadata();
    await removeDuplicateTags();
    await fixMissingAuthorInfo();
    await normalizeCategories();
    await cleanupBrokenLinks();
    
    console.log('Blog cleanup completed successfully!');
  } catch (error) {
    console.error('Error during blog cleanup:', error);
  }
}

// Export all functions
export {
  cleanupOldDraftPosts,
  cleanupUnusedBlogImages,
  fixMissingSlugs,
  cleanupExcerptHtml,
  updateReadTimes,
  fixMissingSeoMetadata,
  removeDuplicateTags,
  fixMissingAuthorInfo,
  normalizeCategories,
  cleanupBrokenLinks,
  runAllCleanupFunctions
};

// If this script is run directly, execute all cleanup functions
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAllCleanupFunctions();
}
