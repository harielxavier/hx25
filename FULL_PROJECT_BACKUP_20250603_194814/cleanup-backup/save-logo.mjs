// Script to save the logo image to the public directory
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the directory if it doesn't exist
const logoDir = './public/images/email';
if (!existsSync(logoDir)) {
  mkdirSync(logoDir, { recursive: true });
  console.log(`Created directory: ${logoDir}`);
}

// Save the logo from a URL
const saveLogoFromUrl = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const filePath = join(logoDir, filename);
        writeFileSync(filePath, buffer);
        console.log(`Logo saved to ${filePath}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// URL of the logo (replace with the actual URL)
const logoUrl = 'https://harielxavier.com/logo.png';
const logoFilename = 'hariel-xavier-logo.png';

// Save the logo
saveLogoFromUrl(logoUrl, logoFilename)
  .then((filePath) => {
    console.log(`Logo saved successfully to ${filePath}`);
  })
  .catch((error) => {
    console.error(`Error saving logo: ${error.message}`);
    
    // If downloading fails, create a simple text file as a placeholder
    const placeholderPath = join(logoDir, 'logo-placeholder.txt');
    writeFileSync(placeholderPath, 'Logo placeholder - download failed');
    console.log(`Created placeholder at ${placeholderPath}`);
  });
