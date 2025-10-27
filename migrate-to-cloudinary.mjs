/**
 * Cloudinary Migration Script
 *
 * This script uploads all images from public/MoStuff to Cloudinary
 * and generates a mapping file for updating code references.
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dos0qac90',
  api_key: process.env.VITE_CLOUDINARY_API_KEY || '732256417531588',
  api_secret: process.env.CLOUDINARY_API_SECRET, // This must be set in .env
});

const SOURCE_DIR = './public/MoStuff';
const CLOUDINARY_FOLDER = 'hariel-xavier-photography/MoStuff';

// Mapping of old paths to new Cloudinary URLs
const urlMapping = {};

/**
 * Get all image files recursively from a directory
 */
function getAllImageFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Upload a single file to Cloudinary
 */
async function uploadToCloudinary(localPath) {
  try {
    // Get relative path from public/MoStuff
    const relativePath = relative(SOURCE_DIR, localPath);

    // Create Cloudinary public_id (path without extension)
    // Replace special characters that Cloudinary doesn't allow
    const cleanPath = relativePath
      .replace(/&/g, 'and')           // Replace & with 'and'
      .replace(/'/g, '')              // Remove apostrophes
      .replace(/[^\w\s\-./]/g, '_')  // Replace other special chars with underscore
      .replace(/\s+/g, '_')          // Replace spaces with underscore
      .replace(/\.[^/.]+$/, '');     // Remove extension

    const publicId = `${CLOUDINARY_FOLDER}/${cleanPath}`;

    console.log(`Uploading: ${relativePath}...`);

    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
      invalidate: true,
    });

    // Store mapping
    const oldPath = `/MoStuff/${relativePath}`;
    urlMapping[oldPath] = result.secure_url;

    console.log(`✅ Uploaded: ${relativePath} -> ${result.secure_url}`);
    return result;

  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

/**
 * Upload all images with rate limiting
 */
async function uploadAllImages() {
  console.log('🔍 Finding all images in MoStuff...');
  const imageFiles = getAllImageFiles(SOURCE_DIR);
  console.log(`📸 Found ${imageFiles.length} images to upload\n`);

  let uploaded = 0;
  let failed = 0;

  // Upload in batches to respect API rate limits
  const BATCH_SIZE = 50; // Increased for faster upload

  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);

    console.log(`\n📤 Uploading batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(imageFiles.length / BATCH_SIZE)}...`);

    const results = await Promise.all(
      batch.map(file => uploadToCloudinary(file))
    );

    uploaded += results.filter(r => r !== null).length;
    failed += results.filter(r => r === null).length;

    // Progress update
    console.log(`\n📊 Progress: ${uploaded} uploaded, ${failed} failed, ${imageFiles.length - (uploaded + failed)} remaining`);

    // Small delay to avoid overwhelming the API
    if (i + BATCH_SIZE < imageFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    }
  }

  return { uploaded, failed, total: imageFiles.length };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Cloudinary migration...\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Destination: Cloudinary folder "${CLOUDINARY_FOLDER}"\n`);

  // Check if API secret is configured
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: CLOUDINARY_API_SECRET not found in environment variables');
    console.error('Please add it to your .env file:');
    console.error('CLOUDINARY_API_SECRET=your_api_secret_here');
    process.exit(1);
  }

  try {
    const { uploaded, failed, total } = await uploadAllImages();

    console.log('\n✅ Migration complete!');
    console.log(`📊 Final results:`);
    console.log(`   Total images: ${total}`);
    console.log(`   Successfully uploaded: ${uploaded}`);
    console.log(`   Failed: ${failed}`);

    // Save URL mapping to a file
    const mappingFile = './cloudinary-url-mapping.json';
    writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2), 'utf8');
    console.log(`\n💾 URL mapping saved to: ${mappingFile}`);
    console.log(`   This file contains ${Object.keys(urlMapping).length} path mappings`);

    console.log('\n🔄 Next steps:');
    console.log('1. Run the code update script to replace all /MoStuff/ references');
    console.log('2. Test locally to ensure all images load correctly');
    console.log('3. Deploy to Vercel');

    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
