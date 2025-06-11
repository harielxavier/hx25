import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getFirestore } from 'firebase-admin/firestore';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import service account dynamically
const serviceAccountPath = path.resolve(__dirname, '../harielxavierphotography-18d17-firebase-adminsdk-fbsvc-7ce82ba6ec.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK with service account
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

const bucket = getStorage().bucket();
const db = getFirestore();

/**
 * Upload a file to Firebase Storage
 * 
 * @param {string} localFilePath - Path to local file
 * @param {string} destinationPath - Path in Firebase Storage
 * @param {Object} metadata - Additional metadata for the file
 * @returns {Promise<string>} - Download URL
 */
async function uploadFile(localFilePath, destinationPath, metadata = {}) {
  try {
    console.log(`Uploading ${localFilePath} to ${destinationPath}...`);
    
    // Check if file exists locally
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file ${localFilePath} does not exist`);
    }
    
    // Upload file to Firebase Storage
    const [file] = await bucket.upload(localFilePath, {
      destination: destinationPath,
      metadata: {
        contentType: getContentType(localFilePath),
        metadata: {
          isPublic: 'true',
          ...metadata
        }
      }
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    console.log(`Successfully uploaded to ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${localFilePath}:`, error);
    throw error;
  }
}

/**
 * Get content type based on file extension
 * 
 * @param {string} filePath - Path to the file
 * @returns {string} - Content type
 */
function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Upload slider images to Firebase Storage
 */
async function uploadSliderImages() {
  try {
    const publicDir = path.resolve(__dirname, '../public');
    const sliderDir = path.join(publicDir, 'mostuff', 'slider1');
    
    // Check if directory exists
    if (!fs.existsSync(sliderDir)) {
      console.error(`Slider directory not found: ${sliderDir}`);
      return;
    }
    
    console.log(`Uploading slider images from ${sliderDir}...`);
    
    // Upload slider1 images
    const leftUrl = await uploadFile(
      path.join(sliderDir, 'slider1left.jpg'),
      'sliders/slider1/slider1left.jpg',
      { category: 'slider', sliderId: 'slider1', position: 'left' }
    );
    
    const rightUrl = await uploadFile(
      path.join(sliderDir, 'slider1right.jpg'),
      'sliders/slider1/slider1right.jpg',
      { category: 'slider', sliderId: 'slider1', position: 'right' }
    );
    
    // Store references in Firestore
    await db.collection('sliders').doc('slider1').set({
      left: leftUrl,
      right: rightUrl,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('Successfully uploaded slider images and updated Firestore');
  } catch (error) {
    console.error('Error uploading slider images:', error);
  }
}

/**
 * Upload gallery images to Firebase Storage
 * 
 * @param {string} galleryId - Gallery ID
 * @param {string} localPath - Local path to gallery images
 */
async function uploadGalleryImages(galleryId, localPath) {
  try {
    const galleryDir = path.resolve(__dirname, '../public', localPath);
    
    // Check if directory exists
    if (!fs.existsSync(galleryDir)) {
      console.error(`Gallery directory not found: ${galleryDir}`);
      return;
    }
    
    console.log(`Uploading gallery images for ${galleryId} from ${galleryDir}...`);
    
    // Get all files in the directory
    const files = fs.readdirSync(galleryDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    
    if (files.length === 0) {
      console.log(`No images found in ${galleryDir}`);
      return;
    }
    
    console.log(`Found ${files.length} images to upload`);
    
    // Create a batch for Firestore
    const batch = db.batch();
    const galleryRef = db.collection('galleries').doc(galleryId);
    
    // Create gallery document if it doesn't exist
    await galleryRef.set({
      id: galleryId,
      name: galleryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      imageCount: files.length,
      updatedAt: new Date()
    }, { merge: true });
    
    // Upload each file and create a document in the images subcollection
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageId = `${galleryId}-${i + 1}`;
      const destinationPath = `galleries/${galleryId}/${imageId}${path.extname(file)}`;
      
      // Upload the file
      const imageUrl = await uploadFile(
        path.join(galleryDir, file),
        destinationPath,
        { 
          category: 'gallery', 
          galleryId, 
          imageId,
          originalFilename: file
        }
      );
      
      // Add to Firestore batch
      const imageRef = galleryRef.collection('images').doc(imageId);
      batch.set(imageRef, {
        id: imageId,
        galleryId,
        url: imageUrl,
        originalFilename: file,
        order: i + 1,
        createdAt: new Date()
      });
      
      console.log(`Uploaded ${i + 1}/${files.length}: ${file}`);
    }
    
    // Commit the batch
    await batch.commit();
    console.log(`Successfully uploaded ${files.length} images for gallery ${galleryId}`);
  } catch (error) {
    console.error(`Error uploading gallery ${galleryId}:`, error);
  }
}

/**
 * Upload Jackie and Chris gallery images
 */
async function uploadJackieChrisGallery() {
  const galleryId = 'jackie-chris';
  const localPath = 'images/galleries/jackie-chris';
  
  await uploadGalleryImages(galleryId, localPath);
}

/**
 * Main function to upload all images
 */
async function uploadAllImages() {
  try {
    console.log('Starting image upload process...');
    
    // Upload slider images
    await uploadSliderImages();
    
    // Upload Jackie and Chris gallery
    await uploadJackieChrisGallery();
    
    // Add more galleries here as needed
    
    console.log('Image upload process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error in upload process:', error);
    process.exit(1);
  }
}

// Run the script based on command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Available commands:');
  console.log('  all - Upload all images');
  console.log('  sliders - Upload slider images only');
  console.log('  gallery [galleryId] [localPath] - Upload a specific gallery');
  console.log('  jackie-chris - Upload Jackie and Chris gallery');
  process.exit(0);
}

const command = args[0];

switch (command) {
  case 'all':
    uploadAllImages();
    break;
  case 'sliders':
    uploadSliderImages().then(() => process.exit(0));
    break;
  case 'gallery':
    if (args.length < 3) {
      console.error('Error: gallery command requires galleryId and localPath arguments');
      process.exit(1);
    }
    uploadGalleryImages(args[1], args[2]).then(() => process.exit(0));
    break;
  case 'jackie-chris':
    uploadJackieChrisGallery().then(() => process.exit(0));
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
