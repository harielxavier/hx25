// Simple script to run the createNewBlogPosts function
import { createNewBlogPosts } from '../utils/blogInitializer.js';

console.log('Starting blog post creation...');

// Using top-level await (ES Modules feature)
try {
  await createNewBlogPosts();
  console.log('Successfully created new blog posts!');
  process.exit(0);
} catch (error) {
  console.error('Error creating blog posts:', error);
  process.exit(1);
}
