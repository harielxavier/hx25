import { createSampleGalleries } from '../services/galleryService';

// This script creates sample galleries for testing
const initializeGalleries = async () => {
  try {
    console.log('Creating sample galleries...');
    await createSampleGalleries();
    console.log('Sample galleries created successfully!');
  } catch (error) {
    console.error('Error creating sample galleries:', error);
  }
};

// Run the initialization
initializeGalleries();

export default initializeGalleries;
