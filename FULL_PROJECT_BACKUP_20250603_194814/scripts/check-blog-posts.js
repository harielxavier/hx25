/**
 * Blog Post Checker Script
 * 
 * This script checks all blog posts to ensure they are:
 * 1. Published with proper status
 * 2. Have complete content with proper structure
 * 3. Have SEO metadata (title, description, tags)
 * 4. Have valid images that are properly downloaded
 * 5. Follow Google's best practices for SEO
 */

// Import Firebase Admin SDK
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Initialize Firebase Admin with service account
try {
  // Check if the service account file exists
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "harielxavierphotography-18d17.appspot.com"
    });
    
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.log('Service account file not found. Using application default credentials.');
    
    // Initialize with application default credentials
    admin.initializeApp({
      projectId: "harielxavierphotography-18d17",
      storageBucket: "harielxavierphotography-18d17.appspot.com"
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Function to check if an image URL is valid
async function isImageValid(url) {
  // Handle relative URLs
  if (url.startsWith('/')) {
    // Check if the file exists locally
    const localPath = path.join(__dirname, '..', 'public', url);
    return fs.existsSync(localPath);
  }
  
  // Handle absolute URLs
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      
      const req = https.request(
        {
          method: 'HEAD',
          host: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          timeout: 5000
        },
        (res) => {
          resolve(res.statusCode === 200 && 
                 res.headers['content-type'] && 
                 res.headers['content-type'].startsWith('image/'));
        }
      );
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    } catch (error) {
      resolve(false);
    }
  });
}

// Function to check if a blog post has proper SEO metadata
function hasSeoMetadata(post) {
  // Check title (should be 50-60 characters for optimal SEO)
  const titleLength = post.title ? post.title.length : 0;
  const hasGoodTitle = titleLength >= 30 && titleLength <= 60;
  
  // Check meta description (should be 150-160 characters for optimal SEO)
  const excerptLength = post.excerpt ? post.excerpt.length : 0;
  const hasGoodExcerpt = excerptLength >= 120 && excerptLength <= 160;
  
  // Check tags (should have at least 3-5 relevant tags)
  const hasEnoughTags = post.tags && post.tags.length >= 3;
  
  // Check if content has proper heading structure (h1, h2, h3)
  const hasHeadings = post.content && 
                     (post.content.includes('<h1') || 
                      post.content.includes('<h2') || 
                      post.content.includes('<h3'));
  
  return {
    hasGoodTitle,
    hasGoodExcerpt,
    hasEnoughTags,
    hasHeadings,
    isOptimized: hasGoodTitle && hasGoodExcerpt && hasEnoughTags && hasHeadings
  };
}

// Function to check if a blog post has proper content structure
function hasProperContentStructure(post) {
  if (!post.content) return false;
  
  // Check if content has paragraphs
  const hasParagraphs = post.content.includes('<p>') || post.content.includes('<p ');
  
  // Check if content has images
  const hasImages = post.content.includes('<img') || post.content.includes('src=');
  
  // Check if content has links
  const hasLinks = post.content.includes('<a') || post.content.includes('href=');
  
  // Check if content has a reasonable length (at least 300 words)
  const contentText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = contentText.split(' ').length;
  const hasGoodLength = wordCount >= 300;
  
  return {
    hasParagraphs,
    hasImages,
    hasLinks,
    wordCount,
    hasGoodLength,
    isStructured: hasParagraphs && hasGoodLength
  };
}

// Main function to check all blog posts
async function checkBlogPosts() {
  try {
    console.log('Starting blog post check...');
    
    // Get all blog posts
    const blogPostsSnapshot = await db.collection('blogPosts').get();
    
    if (blogPostsSnapshot.empty) {
      console.log('No blog posts found.');
      return;
    }
    
    console.log(`Found ${blogPostsSnapshot.size} blog posts to check.`);
    
    // Results summary
    const results = {
      total: blogPostsSnapshot.size,
      published: 0,
      unpublished: 0,
      withValidImages: 0,
      withInvalidImages: 0,
      seoOptimized: 0,
      needsSeoOptimization: 0,
      completeContent: 0,
      incompleteContent: 0,
      postsWithIssues: []
    };
    
    // Process each blog post
    for (const doc of blogPostsSnapshot.docs) {
      const post = doc.data();
      post.id = doc.id;
      
      console.log(`\nChecking post: ${post.title} (${post.id})`);
      
      // Check if post is published
      const isPublished = post.status === 'published';
      if (isPublished) {
        results.published++;
        console.log('✅ Post is published');
      } else {
        results.unpublished++;
        console.log('❌ Post is NOT published');
      }
      
      // Check featured image
      let featuredImageValid = false;
      if (post.featuredImage) {
        featuredImageValid = await isImageValid(post.featuredImage);
        if (featuredImageValid) {
          results.withValidImages++;
          console.log('✅ Featured image is valid');
        } else {
          results.withInvalidImages++;
          console.log('❌ Featured image is invalid or not accessible');
        }
      } else {
        results.withInvalidImages++;
        console.log('❌ No featured image found');
      }
      
      // Check SEO metadata
      const seoCheck = hasSeoMetadata(post);
      if (seoCheck.isOptimized) {
        results.seoOptimized++;
        console.log('✅ SEO metadata is optimized');
      } else {
        results.needsSeoOptimization++;
        console.log('❌ SEO metadata needs optimization:');
        if (!seoCheck.hasGoodTitle) console.log('  - Title length is not optimal (should be 30-60 characters)');
        if (!seoCheck.hasGoodExcerpt) console.log('  - Meta description length is not optimal (should be 120-160 characters)');
        if (!seoCheck.hasEnoughTags) console.log('  - Not enough tags (should have at least 3-5 tags)');
        if (!seoCheck.hasHeadings) console.log('  - Content lacks proper heading structure');
      }
      
      // Check content structure
      const contentCheck = hasProperContentStructure(post);
      if (contentCheck.isStructured) {
        results.completeContent++;
        console.log('✅ Content structure is good');
        console.log(`  - Word count: ${contentCheck.wordCount}`);
      } else {
        results.incompleteContent++;
        console.log('❌ Content structure needs improvement:');
        if (!contentCheck.hasParagraphs) console.log('  - Content lacks proper paragraphs');
        if (!contentCheck.hasGoodLength) console.log(`  - Content is too short (${contentCheck.wordCount} words, should be at least 300)`);
        if (!contentCheck.hasImages) console.log('  - Content has no embedded images');
        if (!contentCheck.hasLinks) console.log('  - Content has no internal or external links');
      }
      
      // Check for issues
      if (!isPublished || !featuredImageValid || !seoCheck.isOptimized || !contentCheck.isStructured) {
        results.postsWithIssues.push({
          id: post.id,
          title: post.title,
          issues: {
            notPublished: !isPublished,
            invalidImage: !featuredImageValid,
            poorSeo: !seoCheck.isOptimized,
            incompleteContent: !contentCheck.isStructured
          }
        });
      }
    }
    
    // Print summary
    console.log('\n========== BLOG POST CHECK SUMMARY ==========');
    console.log(`Total blog posts: ${results.total}`);
    console.log(`Published: ${results.published} (${Math.round(results.published / results.total * 100)}%)`);
    console.log(`Unpublished: ${results.unpublished} (${Math.round(results.unpublished / results.total * 100)}%)`);
    console.log(`With valid images: ${results.withValidImages} (${Math.round(results.withValidImages / results.total * 100)}%)`);
    console.log(`With invalid images: ${results.withInvalidImages} (${Math.round(results.withInvalidImages / results.total * 100)}%)`);
    console.log(`SEO optimized: ${results.seoOptimized} (${Math.round(results.seoOptimized / results.total * 100)}%)`);
    console.log(`Needs SEO optimization: ${results.needsSeoOptimization} (${Math.round(results.needsSeoOptimization / results.total * 100)}%)`);
    console.log(`Complete content: ${results.completeContent} (${Math.round(results.completeContent / results.total * 100)}%)`);
    console.log(`Incomplete content: ${results.incompleteContent} (${Math.round(results.incompleteContent / results.total * 100)}%)`);
    
    // List posts with issues
    if (results.postsWithIssues.length > 0) {
      console.log('\n========== POSTS WITH ISSUES ==========');
      results.postsWithIssues.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} (${post.id}):`);
        if (post.issues.notPublished) console.log('   - Not published');
        if (post.issues.invalidImage) console.log('   - Invalid or missing featured image');
        if (post.issues.poorSeo) console.log('   - Poor SEO optimization');
        if (post.issues.incompleteContent) console.log('   - Incomplete content structure');
      });
    }
    
    // Save results to file
    const resultsFilePath = path.join(__dirname, '../blog-post-check-results.json');
    fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results saved to: ${resultsFilePath}`);
    
  } catch (error) {
    console.error('Error checking blog posts:', error);
  }
}

// Run the check
checkBlogPosts();
