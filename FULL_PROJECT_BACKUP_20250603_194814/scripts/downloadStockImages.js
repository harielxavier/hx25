import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Unsplash wedding collection URLs (free to use, attribution not required for this usage)
const weddingImageUrls = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  'https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=800&q=80',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
  'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=800&q=80',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&q=80',
  'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80',
  'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?w=800&q=80',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80',
  'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=800&q=80',
  'https://images.unsplash.com/photo-1522333323-5a5dca5b1f30?w=800&q=80',
  'https://images.unsplash.com/photo-1548985507-93e879e98a4b?w=800&q=80',
  'https://images.unsplash.com/photo-1525772764200-be829a350797?w=800&q=80',
  'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=800&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
  'https://images.unsplash.com/photo-1583939411023-c19bdbfe9f34?w=800&q=80',
  'https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  'https://images.unsplash.com/photo-1523438097888-8484b5f661e5?w=800&q=80',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80',
  'https://images.unsplash.com/photo-1522333323-5a5dca5b1f30?w=800&q=80',
  'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80',
  'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?w=800&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'
];

// Create directory if it doesn't exist
const targetDir = path.join(__dirname, '../public/images/stock/wedding');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Generate metadata for the images
function generateMetadata(images) {
  const metadata = {
    images: images.map((img, index) => {
      // Extract dimensions from filename (if available)
      const dimensions = img.dimensions || { width: 800, height: Math.floor(600 + Math.random() * 400) };
      
      return {
        id: `wedding-${index + 1}`,
        path: `/images/stock/wedding/${path.basename(img.filename)}`,
        alt: `Wedding photo ${index + 1}`,
        width: dimensions.width,
        height: dimensions.height,
        category: 'wedding',
        tags: ['wedding', 'stock', 'photography'],
      };
    })
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../public/images/stock/wedding/metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('Generated metadata file');
}

// Main function to download all images
async function downloadAllImages() {
  console.log('Starting download of wedding stock images...');
  
  const downloadedImages = [];
  
  for (let i = 0; i < weddingImageUrls.length; i++) {
    const url = weddingImageUrls[i];
    const filename = path.join(targetDir, `wedding-${i + 1}.jpg`);
    
    try {
      await downloadImage(url, filename);
      downloadedImages.push({
        filename,
        originalUrl: url
      });
    } catch (error) {
      console.error(`Error downloading ${url}:`, error.message);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate metadata
  generateMetadata(downloadedImages);
  
  console.log(`Downloaded ${downloadedImages.length} wedding stock images`);
}

// Run the download function
try {
  await downloadAllImages();
} catch (error) {
  console.error(error);
}
