// Script to initialize blog posts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the service account key
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-service-account.json'), 'utf8')
);

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Initialize Firestore
const db = getFirestore(app);

// Import the blog initializer and run the initialization
import('./src/utils/blogInitializer.ts').then(module => {
  const { initializeBlogPosts } = module;
  
  async function main() {
    try {
      console.log('Starting blog post initialization...');
      await initializeBlogPosts();
      console.log('Blog posts initialized successfully!');
    } catch (error) {
      console.error('Error initializing blog posts:', error);
    }
  }
  
  main();
});
