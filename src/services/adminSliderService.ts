import * as path from 'path';
import { adminStorage } from '../lib/firebase-admin';

/**
 * Upload a file to Firebase Storage using Admin SDK
 * 
 * @param filePath - Local file path
 * @param destination - Destination path in Firebase Storage
 * @returns Promise with download URL
 */
export const uploadFileWithAdmin = async (
  filePath: string,
  destination: string
): Promise<string> => {
  try {
    const bucket = adminStorage.bucket();
    
    // Upload the file
    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'image/jpeg',
      },
    });
    
    // Make the file publicly accessible
    const file = bucket.file(destination);
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file with admin SDK:', error);
    throw error;
  }
};

/**
 * Upload slider images to Firebase Storage using Admin SDK
 * 
 * @param sliderId - Slider ID (e.g., 'slider1')
 * @returns Promise with the download URLs
 */
export const uploadSliderImagesWithAdmin = async (
  sliderId: string
): Promise<{ left: string; right: string }> => {
  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    
    // Local file paths
    const leftImagePath = path.join(publicDir, 'mostuff', sliderId, `${sliderId}left.jpg`);
    const rightImagePath = path.join(publicDir, 'mostuff', sliderId, `${sliderId}right.jpg`);
    
    // Firebase Storage destinations
    const leftDestination = `sliders/${sliderId}/${sliderId}left.jpg`;
    const rightDestination = `sliders/${sliderId}/${sliderId}right.jpg`;
    
    // Upload the files
    const leftUrl = await uploadFileWithAdmin(leftImagePath, leftDestination);
    const rightUrl = await uploadFileWithAdmin(rightImagePath, rightDestination);
    
    return {
      left: leftUrl,
      right: rightUrl
    };
  } catch (error) {
    console.error(`Error uploading slider images for ${sliderId}:`, error);
    throw error;
  }
};

/**
 * Get slider images from Firebase Storage
 * 
 * @param sliderId - Slider ID (e.g., 'slider1')
 * @returns Promise with the download URLs
 */
export const getSliderImagesFromAdmin = async (
  sliderId: string
): Promise<{ left: string; right: string }> => {
  try {
    const bucket = adminStorage.bucket();
    
    // Firebase Storage file paths
    const leftFilePath = `sliders/${sliderId}/${sliderId}left.jpg`;
    const rightFilePath = `sliders/${sliderId}/${sliderId}right.jpg`;
    
    // Get the files
    const leftFile = bucket.file(leftFilePath);
    const rightFile = bucket.file(rightFilePath);
    
    // Check if files exist
    const [leftExists] = await leftFile.exists();
    const [rightExists] = await rightFile.exists();
    
    if (!leftExists || !rightExists) {
      // Upload the files if they don't exist
      return await uploadSliderImagesWithAdmin(sliderId);
    }
    
    // Get the download URLs
    const leftUrl = `https://storage.googleapis.com/${bucket.name}/${leftFilePath}`;
    const rightUrl = `https://storage.googleapis.com/${bucket.name}/${rightFilePath}`;
    
    return {
      left: leftUrl,
      right: rightUrl
    };
  } catch (error) {
    console.error(`Error getting slider images for ${sliderId}:`, error);
    // Return local paths as fallback
    return {
      left: `/mostuff/${sliderId}/${sliderId}left.jpg`,
      right: `/mostuff/${sliderId}/${sliderId}right.jpg`
    };
  }
};
