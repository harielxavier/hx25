const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configuration
const galleryId = process.argv[2]; // Pass gallery ID as first argument
const imagesDir = process.argv[3]; // Pass images directory as second argument
const galleryName = process.argv[4] || 'New Gallery'; // Optional gallery name

if (!galleryId || !imagesDir) {
  console.error('Usage: node upload-gallery-images.js <galleryId> <imagesPath> [galleryName]');
  process.exit(1);
}

// Check if gallery exists, create if not
async function ensureGalleryExists() {
  const galleryRef = db.collection('galleries').doc(galleryId);
  const galleryDoc = await galleryRef.get();
  
  if (!galleryDoc.exists) {
    console.log(`Creating new gallery: ${galleryName} (${galleryId})`);
    await galleryRef.set({
      title: galleryName,
      slug: galleryId.toLowerCase().replace(/\s+/g, '-'),
      description: `Gallery: ${galleryName}`,
      coverImage: '',
      thumbnailImage: '',
      imageCount: 0,
      isPublished: true,
      isPasswordProtected: false,
      password: '',
      allowDownloads: true,
      allowSharing: true,
      isPublic: true,
      galleryType: 'portfolio',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Gallery created successfully');
  } else {
    console.log(`Using existing gallery: ${galleryId}`);
  }
}

// Upload a single image
async function uploadImage(filePath) {
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(fileName).toLowerCase();
  
  // Only process image files
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  if (!validExtensions.includes(fileExtension)) {
    console.log(`Skipping non-image file: ${fileName}`);
    return null;
  }
  
  // Generate a unique ID for the image
  const imageId = uuidv4();
  
  // Set destination path in Firebase Storage
  const destinationPath = `galleries/${galleryId}/${imageId}${fileExtension}`;
  
  console.log(`Uploading ${fileName} to ${destinationPath}...`);
  
  try {
    // Upload file to Firebase Storage
    await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: {
        contentType: `image/${fileExtension.replace('.', '')}`,
        metadata: {
          originalFilename: fileName
        }
      }
    });
    
    // Get the public URL
    const file = bucket.file(destinationPath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100'
    });
    
    // Get image dimensions (would require an image processing library in a real implementation)
    // For now, we'll use placeholder values
    const width = 1200;
    const height = 800;
    
    // Create a document in the images subcollection
    const imageRef = db.collection('galleries').doc(galleryId).collection('images').doc(imageId);
    await imageRef.set({
      id: imageId,
      filename: `${imageId}${fileExtension}`,
      originalFilename: fileName,
      url: url,
      thumbnailUrl: url, // In a real implementation, you'd create a thumbnail
      type: 'image',
      size: fs.statSync(filePath).size,
      width: width,
      height: height,
      featured: false,
      title: fileName.replace(fileExtension, ''),
      description: '',
      tags: [],
      clientSelected: false,
      photographerSelected: false,
      clientComment: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Uploaded and saved ${fileName} successfully`);
    return imageId;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
    return null;
  }
}

// Update gallery with first image as cover
async function updateGalleryCover(imageIds) {
  if (imageIds.length === 0) return;
  
  const firstImageId = imageIds[0];
  const imageRef = db.collection('galleries').doc(galleryId).collection('images').doc(firstImageId);
  const imageDoc = await imageRef.get();
  
  if (imageDoc.exists) {
    const imageData = imageDoc.data();
    const galleryRef = db.collection('galleries').doc(galleryId);
    
    await galleryRef.update({
      coverImage: imageData.url,
      thumbnailImage: imageData.thumbnailUrl,
      imageCount: imageIds.length,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated gallery cover with image: ${firstImageId}`);
  }
}

// Main function
async function uploadGalleryImages() {
  try {
    // Ensure gallery exists
    await ensureGalleryExists();
    
    // Get all files in the directory
    const files = fs.readdirSync(imagesDir)
      .filter(file => {
        const filePath = path.join(imagesDir, file);
        return fs.statSync(filePath).isFile();
      })
      .map(file => path.join(imagesDir, file));
    
    console.log(`Found ${files.length} files in ${imagesDir}`);
    
    // Upload each file
    const uploadPromises = files.map(file => uploadImage(file));
    const imageIds = (await Promise.all(uploadPromises)).filter(id => id !== null);
    
    // Update gallery with cover image and count
    await updateGalleryCover(imageIds);
    
    console.log(`Successfully uploaded ${imageIds.length} images to gallery ${galleryId}`);
  } catch (error) {
    console.error('Error uploading gallery images:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

// Run the main function
uploadGalleryImages();
