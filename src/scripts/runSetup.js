// This script runs the setupFeaturedGalleries function
import { setupFeaturedGalleries } from './setupFeaturedGalleries.js';

// Run the setup function
setupFeaturedGalleries()
  .then(() => {
    console.log('Setup completed successfully!');
  })
  .catch((error) => {
    console.error('Setup failed:', error);
  });
