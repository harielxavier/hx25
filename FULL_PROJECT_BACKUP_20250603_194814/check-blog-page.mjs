import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

async function checkBlogPage() {
  try {
    console.log('Checking blog page functionality...');
    
    // Check if the blog page is accessible
    const blogUrl = 'http://localhost:5178/blog';
    console.log(`Fetching blog page from ${blogUrl}...`);
    
    try {
      const response = await fetch(blogUrl);
      if (response.ok) {
        console.log('✅ Blog page is accessible');
        console.log(`Status: ${response.status} ${response.statusText}`);
      } else {
        console.error('❌ Blog page returned an error');
        console.error(`Status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch blog page:', error.message);
    }
    
    // Check if the blog service is using the fixed version
    const originalPath = path.resolve('./src/services/blogService.ts');
    const backupPath = path.resolve('./src/services/blogService.ts.bak');
    
    // Check if backup exists
    try {
      await fs.access(backupPath);
      console.log('✅ Blog service backup exists, fix has been applied');
    } catch (error) {
      console.log('❌ Blog service backup not found, fix may not have been applied');
    }
    
    // Check the content of the current blog service
    try {
      const content = await fs.readFile(originalPath, 'utf8');
      
      if (content.includes('client-side filtering')) {
        console.log('✅ Blog service is using client-side filtering (fixed version)');
      } else if (content.includes('orderBy(')) {
        console.log('❌ Blog service is still using complex Firestore queries that require composite indexes');
      } else {
        console.log('⚠️ Unable to determine if blog service is using the fixed version');
      }
    } catch (error) {
      console.error('❌ Failed to read blog service file:', error.message);
    }
    
    // Check if the BlogManagerFix.css file exists
    const cssPath = path.resolve('./src/pages/admin/BlogManagerFix.css');
    try {
      await fs.access(cssPath);
      console.log('✅ BlogManagerFix.css exists');
    } catch (error) {
      console.log('❌ BlogManagerFix.css not found');
    }
    
    // Check if the BlogManagerActions.js file exists
    const jsPath = path.resolve('./src/pages/admin/BlogManagerActions.js');
    try {
      await fs.access(jsPath);
      console.log('✅ BlogManagerActions.js exists');
    } catch (error) {
      console.log('❌ BlogManagerActions.js not found');
    }
    
    // Check if the script is included in index.html
    const indexPath = path.resolve('./index.html');
    try {
      const indexContent = await fs.readFile(indexPath, 'utf8');
      if (indexContent.includes('BlogManagerActions.js')) {
        console.log('✅ BlogManagerActions.js is included in index.html');
      } else {
        console.log('❌ BlogManagerActions.js is not included in index.html');
      }
    } catch (error) {
      console.error('❌ Failed to read index.html:', error.message);
    }
    
    console.log('\nSummary of fixes:');
    console.log('1. Blog service has been updated to use client-side filtering instead of complex Firestore queries');
    console.log('2. CSS fixes have been applied to ensure action buttons are visible in the blog manager');
    console.log('3. Custom action buttons script has been added to provide additional UI enhancements');
    
    console.log('\nTo verify the fixes:');
    console.log('1. Visit the blog page at /blog to check if it loads correctly');
    console.log('2. Log in to the admin area and go to /admin/blog-manager');
    console.log('3. Verify that the action buttons (view, edit, delete) are visible in the last column');
    
  } catch (error) {
    console.error('Error checking blog page:', error);
  }
}

checkBlogPage();
