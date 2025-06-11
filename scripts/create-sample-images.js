/**
 * Script to create sample Crysta & David wedding images
 * This will create placeholder images that can be used for testing
 * until the actual images are available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory for the sample images
const targetDir = path.join(__dirname, '../public/Crysta & David');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// List of image filenames based on the Finder window
const imageFilenames = [
  'cdw-25.jpg',
  'cdw-55.jpg',
  'cdw-64.jpg',
  'cdw-127.jpg',
  'cdw-160.jpg',
  'cdw-169.jpg',
  'cdw-170.jpg',
  'cdw-174.jpg',
  'cdw-185.jpg',
  'cdw-186.jpg',
  'cdw-188.jpg',
  'cdw-198.jpg',
  'cdw-203.jpg',
  'cdw-210.jpg',
  'cdw-219.jpg',
  'cdw-225.jpg',
  'cdw-240.jpg',
  'cdw-248.jpg',
  'cdw-255.jpg',
  'cdw-261.jpg',
  'cdw-265.jpg',
  'cdw-270.jpg',
  'cdw-278.jpg',
  'cdw-290.jpg',
  'cdw-314.jpg',
  'cdw-322.jpg',
  'cdw-330.jpg',
  'cdw-333.jpg',
  'cdw-377.jpg',
  'cdw-381.jpg',
  'cdw-384.jpg',
  'cdw-387.jpg',
  'cdw-390.jpg',
  'cdw-391.jpg',
  'cdw-401.jpg',
  'cdw-405.jpg',
  'cdw-414.jpg',
  'cdw-415.jpg',
  'cdw-425.jpg',
  'cdw-428.jpg'
];

// Create a simple 1x1 pixel JPEG as a placeholder
// This is a base64-encoded 1x1 pixel JPEG
const placeholderJpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';

// Create each sample image
for (const filename of imageFilenames) {
  const filePath = path.join(targetDir, filename);
  
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(placeholderJpegBase64, 'base64');
  
  // Write the file
  fs.writeFileSync(filePath, imageBuffer);
  console.log(`Created sample image: ${filename}`);
}

console.log(`Created ${imageFilenames.length} sample images in ${targetDir}`);
