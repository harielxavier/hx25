/**
 * Script to generate sample images for Crysta & David wedding gallery
 * This creates placeholder images with the correct filenames
 * that can be uploaded to Firebase Storage
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to save the generated images
const outputDir = path.resolve(__dirname, '../public/Crysta & David');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// List of image IDs to generate
const imageIds = [
  // Preparation section
  'cdw-25', 'cdw-55', 'cdw-64',
  
  // Ceremony section
  'cdw-127', 'cdw-160', 'cdw-169', 'cdw-170',
  
  // Portraits section
  'cdw-174', 'cdw-185', 'cdw-186', 'cdw-188', 'cdw-198', 'cdw-203',
  
  // Reception section
  'cdw-210', 'cdw-219', 'cdw-225', 'cdw-240', 'cdw-248', 'cdw-255', 
  'cdw-261', 'cdw-265', 'cdw-270', 'cdw-278', 'cdw-290', 'cdw-314', 
  'cdw-322', 'cdw-330', 'cdw-333', 'cdw-377', 'cdw-381', 'cdw-384', 
  'cdw-387', 'cdw-390', 'cdw-391', 'cdw-401', 'cdw-405', 'cdw-414', 
  'cdw-415', 'cdw-425', 'cdw-428'
];

// Function to generate a sample image
function generateSampleImage(imageId, width = 1200, height = 800) {
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with a gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f9a8d4');  // Light pink
  gradient.addColorStop(1, '#be185d');  // Dark pink
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Crysta & David Wedding`, width/2, height/2 - 30);
  ctx.fillText(`Image ID: ${imageId}`, width/2, height/2 + 30);
  
  // Save to file
  const outputPath = path.join(outputDir, `${imageId}.jpg`);
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  
  return outputPath;
}

// Generate all sample images
console.log('Generating sample images for Crysta & David wedding gallery...');

for (const imageId of imageIds) {
  const outputPath = generateSampleImage(imageId);
  console.log(`Generated: ${outputPath}`);
}

console.log('Sample image generation complete!');
