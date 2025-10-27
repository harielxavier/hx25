/**
 * Update Image Paths Script
 *
 * This script updates all /MoStuff/ references in the codebase
 * to use Cloudinary URLs from the mapping file.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Load URL mapping from migration script
const MAPPING_FILE = './cloudinary-url-mapping.json';

let urlMapping = {};

try {
  urlMapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf8'));
  console.log(`✅ Loaded ${Object.keys(urlMapping).length} URL mappings\n`);
} catch (error) {
  console.error('❌ Could not load URL mapping file:', MAPPING_FILE);
  console.error('Please run migrate-to-cloudinary.mjs first');
  process.exit(1);
}

// Files to update (from grep results)
const FILES_TO_UPDATE = [
  'src/pages/LandingPage.tsx',
  'src/pages/landing/WeddingPhotography.tsx',
  'src/pages/landing/SuperDealLandingPage.tsx',
  'src/components/PhotographyStyleSlider.tsx',
  'src/components/FeaturedGalleries.tsx',
  'src/components/HeroSection.tsx',
  'src/components/WeddingSliderSettings.tsx',
  'src/data/judyMikeImages.ts',
  'src/data/karniZilvinasImages.ts',
  'src/data/ansimonMinaImages.ts',
  'src/data/jackieChrisImages.ts',
  'src/data/amandaAlexImages.ts',
  'src/data/biancaJeffreyImages.ts',
  'src/data/crystaDavidImages.ts',
  'src/data/anaJoseImages.ts',
  'src/pages/gallery/JudyMikeGalleryPage.tsx',
  'src/pages/gallery/KarniZilvinasGalleryPage.tsx',
  'src/pages/gallery/AnsimonMinaGalleryPage.tsx',
  'src/pages/gallery/JackieChrisGalleryPage.tsx',
  'src/pages/gallery/AmandaAlexGalleryPage.tsx',
  'src/pages/gallery/BiancaJeffreyGalleryPage.tsx',
  'src/pages/gallery/CrystaDavidGalleryPage.tsx',
  'src/pages/gallery/AnaJoseGalleryPage.tsx',
];

/**
 * Get all TypeScript/JavaScript files recursively
 */
function getAllCodeFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    // Skip node_modules, dist, and other build directories
    if (stat.isDirectory() && !['node_modules', 'dist', 'build', '.git'].includes(file)) {
      getAllCodeFiles(filePath, fileList);
    } else if (/\.(tsx?|jsx?)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Replace /MoStuff/ paths in file content with Cloudinary URLs
 */
function updateFileContent(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  let replacements = 0;

  // Sort paths by length (longest first) to avoid partial replacements
  const sortedPaths = Object.keys(urlMapping).sort((a, b) => b.length - a.length);

  for (const oldPath of sortedPaths) {
    const cloudinaryUrl = urlMapping[oldPath];

    // Match various patterns:
    // '/MoStuff/path/to/image.jpg'
    // "/MoStuff/path/to/image.jpg"
    // `/MoStuff/path/to/image.jpg`

    const patterns = [
      new RegExp(`['"\`]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g'),
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        // Preserve the quote type used
        content = content.replace(pattern, (match) => {
          const quote = match[0];
          replacements++;
          return `${quote}${cloudinaryUrl}${quote}`;
        });
        modified = true;
      }
    }
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath} (${replacements} replacements)`);
    return replacements;
  }

  return 0;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting code update...\n');

  let totalReplacements = 0;
  let filesModified = 0;

  console.log('📂 Scanning codebase for /MoStuff/ references...\n');

  // Get all code files from src directory
  const allCodeFiles = getAllCodeFiles('./src');

  console.log(`📁 Found ${allCodeFiles.length} code files to check\n`);

  for (const file of allCodeFiles) {
    const replacements = updateFileContent(file);
    if (replacements > 0) {
      totalReplacements += replacements;
      filesModified++;
    }
  }

  console.log('\n✅ Code update complete!');
  console.log(`📊 Summary:`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Total replacements: ${totalReplacements}`);

  if (filesModified === 0) {
    console.log('\n⚠️  Warning: No files were modified');
    console.log('   This might mean:');
    console.log('   - All paths have already been updated');
    console.log('   - The URL mapping file is incorrect');
    console.log('   - The image paths use a different format');
  } else {
    console.log('\n🔄 Next steps:');
    console.log('1. Test locally: npm run dev');
    console.log('2. Check that all images load from Cloudinary');
    console.log('3. Commit changes: git add . && git commit -m "Migrate images to Cloudinary"');
    console.log('4. Deploy to Vercel: git push');
  }
}

main();
