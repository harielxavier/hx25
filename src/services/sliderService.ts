import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Interface for slider image data
 */
export interface SliderImage {
  id: string;
  url: string;
  position: 'left' | 'right';
}

/**
 * Ensure user is authenticated before uploading
 * Note: Only needed for write operations after rule update
 */
const ensureAuthentication = async () => {
  const auth = getAuth();
  
  // Check if user is already signed in
  if (!auth.currentUser) {
    try {
      // Use the service account credentials from the hxkeyserv.json file
      // These should be environment variables in production
      await signInWithEmailAndPassword(
        auth, 
        "admin@harielxavier.com", 
        "HXPhoto2023!"
      );
      console.log("Authenticated successfully for storage operations");
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }
  
  return auth.currentUser;
};

/**
 * Upload a file to Firebase Storage
 */
const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Ensure user is authenticated for write operations
    await ensureAuthentication();
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw error;
  }
};

/**
 * Upload slider images to Firebase Storage
 * 
 * @returns Promise with the download URLs
 */
export const uploadSliderImagesToFirebase = async (): Promise<{left: string, right: string}> => {
  try {
    // Ensure user is authenticated for write operations
    await ensureAuthentication();
    
    // Fetch the local images
    const leftResponse = await fetch('/mostuff/slider1/slider1left.jpg');
    const leftBlob = await leftResponse.blob();
    const leftFile = new File([leftBlob], 'slider1left.jpg', { type: 'image/jpeg' });
    
    const rightResponse = await fetch('/mostuff/slider1/slider1right.jpg');
    const rightBlob = await rightResponse.blob();
    const rightFile = new File([rightBlob], 'slider1right.jpg', { type: 'image/jpeg' });
    
    // Upload to Firebase Storage
    const leftImageUrl = await uploadFile(leftFile, 'sliders/slider1/slider1left.jpg');
    const rightImageUrl = await uploadFile(rightFile, 'sliders/slider1/slider1right.jpg');
    
    return {
      left: leftImageUrl,
      right: rightImageUrl
    };
  } catch (error) {
    console.error('Error uploading slider images to Firebase:', error);
    // Return local paths as fallback
    return {
      left: '/mostuff/slider1/slider1left.jpg',
      right: '/mostuff/slider1/slider1right.jpg'
    };
  }
};

/**
 * Get slider images from Firebase Storage
 * 
 * @param sliderId - The ID of the slider
 * @returns Promise with the slider images
 */
export const getSliderImages = async (sliderId: string): Promise<{left: string, right: string}> => {
  try {
    // No authentication needed for reading slider images after rule update
    
    // Get left image URL
    const leftImageRef = ref(storage, `sliders/${sliderId}/${sliderId}left.jpg`);
    const leftImageUrl = await getDownloadURL(leftImageRef);
    
    // Get right image URL
    const rightImageRef = ref(storage, `sliders/${sliderId}/${sliderId}right.jpg`);
    const rightImageUrl = await getDownloadURL(rightImageRef);
    
    return {
      left: leftImageUrl,
      right: rightImageUrl
    };
  } catch (error) {
    console.error(`Error getting slider images for ${sliderId}:`, error);
    
    // Try to upload the images if they don't exist
    try {
      console.log(`Attempting to upload slider images for ${sliderId}...`);
      return await uploadSliderImagesToFirebase();
    } catch (uploadError) {
      console.error(`Failed to upload slider images for ${sliderId}:`, uploadError);
      // Return local paths as fallback
      return {
        left: `/mostuff/${sliderId}/${sliderId}left.jpg`,
        right: `/mostuff/${sliderId}/${sliderId}right.jpg`
      };
    }
  }
};
