// Initialize sample galleries for the photography website
import { createSampleGalleries } from '../services/galleryService';

// This script initializes the Firebase database with sample galleries
// Run this script once to set up the initial data

async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  try {
    console.log('Creating sample galleries...');
    await createSampleGalleries();
    console.log('✅ Sample galleries created successfully!');
    
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Run the initialization function
initializeDatabase();
