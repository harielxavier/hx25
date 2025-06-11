import fs from 'fs/promises';
import path from 'path';

async function fixBlogService() {
  try {
    console.log('Starting blog service fix...');
    
    // Backup the original file
    const originalPath = path.resolve('./src/services/blogService.ts');
    const backupPath = path.resolve('./src/services/blogService.ts.bak');
    
    console.log(`Backing up original file to ${backupPath}`);
    await fs.copyFile(originalPath, backupPath);
    
    // Copy the fixed file to replace the original
    const fixedPath = path.resolve('./src/services/blogService.fixed.ts');
    
    console.log(`Copying fixed file to ${originalPath}`);
    const fixedContent = await fs.readFile(fixedPath, 'utf8');
    await fs.writeFile(originalPath, fixedContent);
    
    console.log('Blog service fix applied successfully!');
    console.log('The blog service now uses simpler Firestore queries that don\'t require composite indexes.');
    console.log('This should fix the white screen issue on the blog page.');
    
    console.log('\nChanges made:');
    console.log('1. Modified getAllPosts to use client-side filtering and sorting');
    console.log('2. Updated getFeaturedPosts to use client-side filtering');
    console.log('3. Fixed getPostsByCategory, getPostsByTag, and searchPosts to use client-side filtering');
    console.log('4. Improved error handling throughout the service');
    
    console.log('\nTo test the fix:');
    console.log('1. Visit the blog page at /blog');
    console.log('2. Check if blog posts are displayed correctly');
    console.log('3. Visit the admin blog manager at /admin/blog-manager');
    console.log('4. Verify that the action buttons (view, edit, delete) are visible');
    
  } catch (error) {
    console.error('Error applying blog service fix:', error);
    process.exit(1);
  }
}

fixBlogService();
