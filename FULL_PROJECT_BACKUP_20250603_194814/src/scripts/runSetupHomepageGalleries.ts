/**
 * Script to run the setupHomepageGalleries function
 * This will create featured galleries for the homepage if they don't exist
 */

import setupHomepageGalleries from './setupHomepageGalleries';

// Run the setup function
(async () => {
  console.log('Starting homepage galleries setup...');
  try {
    await setupHomepageGalleries();
    console.log('Homepage galleries setup completed successfully!');
  } catch (error) {
    console.error('Error setting up homepage galleries:', error);
  }
})();
