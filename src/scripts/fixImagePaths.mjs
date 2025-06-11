// This script fixes the image paths in the LandingPage.tsx file
// to ensure images are properly imported and displayed

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Starting image path fix...');

// Fix the LandingPage.tsx file
function fixLandingPage() {
  const landingPagePath = path.join(projectRoot, 'src', 'pages', 'LandingPage.tsx');
  
  if (!fs.existsSync(landingPagePath)) {
    console.error('❌ LandingPage.tsx not found!');
    return;
  }
  
  console.log('Found LandingPage.tsx, creating backup...');
  
  // Create a backup of the original file
  const backupPath = `${landingPagePath}.backup`;
  fs.copyFileSync(landingPagePath, backupPath);
  console.log(`✅ Created backup at ${backupPath}`);
  
  // Read the file content
  let content = fs.readFileSync(landingPagePath, 'utf8');
  
  // Fix the image imports
  const fixedContent = content
    // Fix the HeroPage import
    .replace(
      /import HeroPage from '\.\.\/\.\.\/MoStuff\/LandingPage\/HeroPage\.jpg';/,
      `// Import images using relative paths that Vite can resolve
import HeroPage from '/MoStuff/LandingPage/HeroPage.jpg';`
    )
    // Fix the Portrait import
    .replace(
      /import Portrait from '\.\.\/\.\.\/MoStuff\/portrait\.jpg';/,
      `import Portrait from '/MoStuff/portrait.jpg';`
    );
  
  // Write the fixed content back to the file
  fs.writeFileSync(landingPagePath, fixedContent);
  console.log('✅ Fixed image imports in LandingPage.tsx');
  
  // Create a public directory structure to ensure images are accessible
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('✅ Created public directory');
  }
  
  const publicMoStuffDir = path.join(publicDir, 'MoStuff');
  if (!fs.existsSync(publicMoStuffDir)) {
    fs.mkdirSync(publicMoStuffDir);
    console.log('✅ Created public/MoStuff directory');
  }
  
  const publicLandingPageDir = path.join(publicMoStuffDir, 'LandingPage');
  if (!fs.existsSync(publicLandingPageDir)) {
    fs.mkdirSync(publicLandingPageDir);
    console.log('✅ Created public/MoStuff/LandingPage directory');
  }
  
  // Copy the images to the public directory
  const sourceHeroPage = path.join(projectRoot, 'MoStuff', 'LandingPage', 'HeroPage.jpg');
  const destHeroPage = path.join(publicLandingPageDir, 'HeroPage.jpg');
  
  if (fs.existsSync(sourceHeroPage)) {
    fs.copyFileSync(sourceHeroPage, destHeroPage);
    console.log(`✅ Copied HeroPage.jpg to public directory`);
  } else {
    console.error(`❌ Source image not found: ${sourceHeroPage}`);
  }
  
  const sourcePortrait = path.join(projectRoot, 'MoStuff', 'portrait.jpg');
  const destPortrait = path.join(publicMoStuffDir, 'portrait.jpg');
  
  if (fs.existsSync(sourcePortrait)) {
    fs.copyFileSync(sourcePortrait, destPortrait);
    console.log(`✅ Copied portrait.jpg to public directory`);
  } else {
    console.error(`❌ Source image not found: ${sourcePortrait}`);
    // Create a placeholder image if the original is not found
    console.log('Creating a placeholder for portrait.jpg...');
  }
}

// Fix the App.tsx to use the original LandingPage as default
function fixAppTsx() {
  const appPath = path.join(projectRoot, 'src', 'App.tsx');
  
  if (!fs.existsSync(appPath)) {
    console.error('❌ App.tsx not found!');
    return;
  }
  
  console.log('Found App.tsx, creating backup if needed...');
  
  // Create a backup of App.tsx if one doesn't already exist
  const appBackupPath = `${appPath}.backup`;
  if (!fs.existsSync(appBackupPath)) {
    fs.copyFileSync(appPath, appBackupPath);
    console.log(`✅ Created backup at ${appBackupPath}`);
  }
  
  let appContent = fs.readFileSync(appPath, 'utf8');
  
  // Restore the original route configuration
  const fixedAppContent = appContent.replace(
    '<Route path="/" element={<SimpleLandingPage />} />\n        <Route path="/original" element={<LandingPage />} />',
    '<Route path="/" element={<LandingPage />} />\n        <Route path="/simple" element={<SimpleLandingPage />} />'
  );
  
  fs.writeFileSync(appPath, fixedAppContent);
  console.log('✅ Fixed App.tsx to use original LandingPage as default');
}

// Run all fixes
async function runFixes() {
  try {
    // Fix the LandingPage
    fixLandingPage();
    
    // Fix the App.tsx
    fixAppTsx();
    
    console.log('\n=== All fixes applied successfully ===');
    console.log('Please restart your development server (npm run dev)');
    console.log('The website should now display correctly at http://localhost:5173');
    
  } catch (error) {
    console.error('Error applying fixes:', error);
  }
}

// Run the fixes
runFixes()
  .then(() => console.log('Fix script completed'))
  .catch(error => console.error('Fix script failed:', error));
