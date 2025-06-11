// Script to upload the truck couple image to Firebase Storage
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Initialize Firebase Admin with service account
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'harielxavierphotography-18d17.appspot.com'
});

const bucket = admin.storage().bucket();

// Function to upload a file to Firebase Storage
async function uploadFile(localFilePath, destinationPath) {
  try {
    // Get the MIME type based on file extension
    const contentType = mime.lookup(localFilePath) || 'application/octet-stream';
    
    // Upload the file to Firebase Storage
    const [file] = await bucket.upload(localFilePath, {
      destination: destinationPath,
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    console.log(`File uploaded successfully to ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Path to the local image file
const localFilePath = path.join(__dirname, '../public/MoStuff/jmt/jackiethumb.jpg');

// Destination path in Firebase Storage
const destinationPath = 'galleries/jmt/jackiechris-truck.jpg';

// Upload the file
uploadFile(localFilePath, destinationPath)
  .then(url => {
    console.log('Upload completed successfully');
    console.log('Public URL:', url);
    process.exit(0);
  })
  .catch(error => {
    console.error('Upload failed:', error);
    process.exit(1);
  });
