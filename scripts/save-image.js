import fs from 'fs';
import https from 'https';
import path from 'path';

// Function to download image from URL
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

// Main function
const saveImage = async () => {
  try {
    const imageUrl = process.argv[2];
    const outputPath = process.argv[3];
    
    if (!imageUrl || !outputPath) {
      console.error('Usage: node save-image.js <imageUrl> <outputPath>');
      process.exit(1);
    }
    
    console.log(`Downloading image from ${imageUrl} to ${outputPath}...`);
    await downloadImage(imageUrl, outputPath);
    console.log('Image downloaded successfully!');
  } catch (error) {
    console.error('Error downloading image:', error.message);
    process.exit(1);
  }
};

saveImage();
