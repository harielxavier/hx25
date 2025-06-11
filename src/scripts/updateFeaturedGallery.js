// Simple script to update the first featured gallery title
import { updateFirstFeaturedGallery } from '../services/galleryService.js';

console.log('Starting to update the first featured gallery...');

try {
  const galleryId = await updateFirstFeaturedGallery();
  if (galleryId) {
    console.log(`Successfully updated gallery ${galleryId} to "Anna and Jose's Wedding"`);
  } else {
    console.log('No gallery was updated');
  }
} catch (error) {
  console.error('Error running update script:', error);
}
