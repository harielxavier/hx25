/**
 * Script to set up placeholder images for the Photography Style Slider component
 * This script copies existing images from the project to serve as placeholders
 * until proper images are provided.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination paths
const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'public', 'images');
const destinationPath = path.join(projectRoot, 'public', 'MoStuff', 'style-slider');

// Ensure the destination directory exists
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
  console.log(`Created directory: ${destinationPath}`);
}

// Define the placeholder images to copy
const imagesToCopy = [
  // Documentary style images
  { 
    source: path.join(sourcePath, 'portfolio', 'wedding-1.jpg'),
    destination: path.join(destinationPath, 'documentary1.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'wedding-2.jpg'),
    destination: path.join(destinationPath, 'documentary2.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'wedding-3.jpg'),
    destination: path.join(destinationPath, 'documentary3.jpg')
  },
  
  // Guided style images
  { 
    source: path.join(sourcePath, 'portfolio', 'engagement-1.jpg'),
    destination: path.join(destinationPath, 'guided1.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'engagement-2.jpg'),
    destination: path.join(destinationPath, 'guided2.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'engagement-3.jpg'),
    destination: path.join(destinationPath, 'guided3.jpg')
  },
  
  // Editorial style images
  { 
    source: path.join(sourcePath, 'portfolio', 'portrait-1.jpg'),
    destination: path.join(destinationPath, 'editorial1.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'portrait-2.jpg'),
    destination: path.join(destinationPath, 'editorial2.jpg')
  },
  { 
    source: path.join(sourcePath, 'portfolio', 'portrait-3.jpg'),
    destination: path.join(destinationPath, 'editorial3.jpg')
  },
  
  // Couple images for testimonials
  { 
    source: path.join(sourcePath, 'testimonials', 'couple-1.jpg'),
    destination: path.join(destinationPath, 'couple1.jpg')
  },
  { 
    source: path.join(sourcePath, 'testimonials', 'couple-2.jpg'),
    destination: path.join(destinationPath, 'couple2.jpg')
  },
  { 
    source: path.join(sourcePath, 'testimonials', 'couple-3.jpg'),
    destination: path.join(destinationPath, 'couple3.jpg')
  }
];

// Copy the images
let successCount = 0;
let errorCount = 0;

for (const image of imagesToCopy) {
  try {
    // Check if source exists
    if (!fs.existsSync(image.source)) {
      console.log(`Source file not found: ${image.source}`);
      console.log('Using fallback image instead...');
      
      // Use a fallback image if the source doesn't exist
      const fallbackSource = path.join(sourcePath, 'placeholder-image.jpg');
      if (fs.existsSync(fallbackSource)) {
        fs.copyFileSync(fallbackSource, image.destination);
        console.log(`Copied fallback image to: ${image.destination}`);
        successCount++;
      } else {
        console.error(`Fallback image not found: ${fallbackSource}`);
        errorCount++;
      }
      continue;
    }
    
    // Copy the file
    fs.copyFileSync(image.source, image.destination);
    console.log(`Copied: ${image.destination}`);
    successCount++;
  } catch (error) {
    console.error(`Error copying ${image.source}:`, error.message);
    errorCount++;
  }
}

console.log(`\nSetup complete: ${successCount} images copied, ${errorCount} errors`);
console.log('You can now use the Photography Style Slider component with these placeholder images.');
console.log('Replace them with actual images in the public/MoStuff/style-slider directory when available.');
