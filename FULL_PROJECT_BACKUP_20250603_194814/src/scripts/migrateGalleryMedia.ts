import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GalleryMedia } from '../services/galleryService';

/**
 * This script updates existing gallery media items with new metadata fields
 * Run this script once to migrate your existing galleries
 */
const migrateGalleryMedia = async () => {
  try {
    console.log('Starting gallery media migration...');
    
    // Get all galleries
    const galleriesRef = collection(db, 'galleries');
    const gallerySnapshot = await getDocs(galleriesRef);
    
    if (gallerySnapshot.empty) {
      console.log('No galleries found to migrate.');
      return;
    }
    
    console.log(`Found ${gallerySnapshot.size} galleries to process.`);
    
    // Process each gallery
    for (const galleryDoc of gallerySnapshot.docs) {
      const galleryId = galleryDoc.id;
      const galleryData = galleryDoc.data();
      
      console.log(`Processing gallery: ${galleryData.title} (${galleryId})`);
      
      // Get all media items for this gallery
      const mediaRef = collection(db, 'galleries', galleryId, 'media');
      const mediaSnapshot = await getDocs(mediaRef);
      
      if (mediaSnapshot.empty) {
        console.log(`No media found in gallery ${galleryId}.`);
        continue;
      }
      
      console.log(`Found ${mediaSnapshot.size} media items in gallery ${galleryId}.`);
      
      // Update each media item
      let updatedCount = 0;
      for (const mediaDoc of mediaSnapshot.docs) {
        try {
          const mediaId = mediaDoc.id;
          const mediaData = mediaDoc.data() as Partial<GalleryMedia>;
          
          // First check if the document already has the new fields
          if (mediaData.viewCount !== undefined && 
              mediaData.downloadCount !== undefined && 
              mediaData.exposureData !== undefined) {
            console.log(`Media ${mediaId} already has the new fields, skipping.`);
            updatedCount++;
            continue;
          }
          
          // Create default metadata fields if they don't exist
          // Only include fields that need to be updated
          const updates: Record<string, any> = {};
          
          if (mediaData.viewCount === undefined) {
            updates.viewCount = 0;
          }
          
          if (mediaData.downloadCount === undefined) {
            updates.downloadCount = 0;
          }
          
          if (!mediaData.exposureData) {
            updates.exposureData = {
              aperture: '',
              shutterSpeed: '',
              iso: 0,
              focalLength: '',
              camera: '',
              lens: ''
            };
          }
          
          if (!mediaData.colorProfile) {
            updates.colorProfile = '';
          }
          
          if (!mediaData.location) {
            updates.location = {
              latitude: null,
              longitude: null,
              placeName: ''
            };
          }
          
          if (!mediaData.categories) {
            updates.categories = [];
          }
          
          if (mediaData.rating === undefined) {
            updates.rating = 0;
          }
          
          if (!mediaData.processingStatus) {
            updates.processingStatus = 'processed';
          }
          
          if (!mediaData.deliveryStatus) {
            updates.deliveryStatus = 'delivered';
          }
          
          if (!mediaData.editHistory) {
            updates.editHistory = [];
          }
          
          // Only update if there are changes to make
          if (Object.keys(updates).length > 0) {
            // Update the document
            const mediaDocRef = doc(db, 'galleries', galleryId, 'media', mediaId);
            await updateDoc(mediaDocRef, updates);
            console.log(`Updated media ${mediaId} with new fields.`);
          } else {
            console.log(`No updates needed for media ${mediaId}.`);
          }
          
          updatedCount++;
          
          // Log progress for every 10 items
          if (updatedCount % 10 === 0) {
            console.log(`Updated ${updatedCount}/${mediaSnapshot.size} media items in gallery ${galleryId}...`);
          }
        } catch (mediaError) {
          console.error(`Error updating media item: ${mediaError}`);
          // Continue with the next media item
        }
      }
      
      console.log(`Completed updating ${updatedCount} media items in gallery ${galleryId}.`);
    }
    
    console.log('Gallery media migration completed successfully!');
  } catch (error) {
    console.error('Error during gallery media migration:', error);
    throw error;
  }
};

export default migrateGalleryMedia;
