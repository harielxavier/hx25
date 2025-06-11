// This script helps debug rendering issues with the website
// It will check for common problems and provide solutions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Starting website rendering debug...');
console.log(`Project root: ${projectRoot}`);

// Check if the images directory exists and is accessible
function checkImagesDirectory() {
  console.log('\nChecking image directories...');
  
  const moStuffPath = path.join(projectRoot, 'MoStuff');
  
  if (!fs.existsSync(moStuffPath)) {
    console.error('❌ MoStuff directory is missing!');
    console.log('Creating MoStuff directory...');
    fs.mkdirSync(moStuffPath, { recursive: true });
    console.log('✅ MoStuff directory created.');
  } else {
    console.log('✅ MoStuff directory exists.');
    
    // List files in MoStuff directory
    const files = fs.readdirSync(moStuffPath);
    console.log(`Found ${files.length} files in MoStuff directory.`);
    
    if (files.length === 0) {
      console.warn('⚠️ MoStuff directory is empty. This may cause missing images on the website.');
    } else {
      console.log('Some files in MoStuff directory:');
      files.slice(0, 5).forEach(file => console.log(`  - ${file}`));
      if (files.length > 5) console.log(`  ... and ${files.length - 5} more`);
    }
  }
  
  // Check for specific required images
  const requiredImages = [
    'black.png',
    'faviconhx.png',
    'LandingPage/HeroPage.jpg',
    'portrait.jpg'
  ];
  
  console.log('\nChecking for required images:');
  let missingImages = false;
  
  for (const image of requiredImages) {
    const imagePath = path.join(moStuffPath, image);
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Required image missing: ${image}`);
      missingImages = true;
    } else {
      console.log(`✅ Found required image: ${image}`);
    }
  }
  
  if (missingImages) {
    console.warn('⚠️ Some required images are missing. This will cause rendering issues.');
  }
}

// Check CSS files to ensure styles are loading
function checkCssFiles() {
  console.log('\nChecking CSS files...');
  
  const indexCssPath = path.join(projectRoot, 'src', 'index.css');
  
  if (!fs.existsSync(indexCssPath)) {
    console.error('❌ index.css is missing!');
  } else {
    console.log('✅ index.css exists.');
    
    // Check if index.css imports Tailwind
    const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');
    if (!indexCssContent.includes('@tailwind')) {
      console.warn('⚠️ index.css might not be importing Tailwind CSS correctly.');
    } else {
      console.log('✅ index.css correctly imports Tailwind CSS.');
    }
  }
}

// Check for any console.error calls in the code that might be stopping rendering
function checkForConsoleErrors() {
  console.log('\nChecking for console.error calls that might stop rendering...');
  
  const srcDir = path.join(projectRoot, 'src');
  const jsFiles = findJsFiles(srcDir);
  
  console.log(`Scanning ${jsFiles.length} JavaScript/TypeScript files...`);
  
  const errorPatterns = [
    'throw new Error',
    'console.error',
    'process.exit'
  ];
  
  let potentialIssuesFound = false;
  
  for (const file of jsFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const pattern of errorPatterns) {
        if (content.includes(pattern)) {
          console.warn(`⚠️ Potential issue in ${path.relative(projectRoot, file)}: Contains "${pattern}"`);
          potentialIssuesFound = true;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}: ${error.message}`);
    }
  }
  
  if (!potentialIssuesFound) {
    console.log('✅ No obvious error-throwing code found that would stop rendering.');
  }
}

// Find all JavaScript and TypeScript files in a directory recursively
function findJsFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findJsFiles(itemPath));
    } else if (
      item.endsWith('.js') || 
      item.endsWith('.jsx') || 
      item.endsWith('.ts') || 
      item.endsWith('.tsx')
    ) {
      results.push(itemPath);
    }
  }
  
  return results;
}

// Check for issues in the AuthContext that might prevent rendering
function checkAuthContext() {
  console.log('\nChecking AuthContext for issues...');
  
  const authContextPath = path.join(projectRoot, 'src', 'contexts', 'AuthContext.tsx');
  
  if (!fs.existsSync(authContextPath)) {
    console.error('❌ AuthContext.tsx is missing!');
    return;
  }
  
  console.log('✅ AuthContext.tsx exists.');
  
  try {
    const content = fs.readFileSync(authContextPath, 'utf8');
    
    // Check for common issues in AuthContext
    if (!content.includes('setLoading(false)')) {
      console.warn('⚠️ AuthContext might not be setting loading to false, which could cause infinite loading.');
    } else {
      console.log('✅ AuthContext correctly sets loading to false.');
    }
    
    if (content.includes('throw new Error')) {
      console.warn('⚠️ AuthContext contains error throwing that might prevent rendering.');
    }
  } catch (error) {
    console.error(`Error reading AuthContext: ${error.message}`);
  }
}

// Create a fix for common issues
function createFixes() {
  console.log('\nCreating fixes for common issues...');
  
  // 1. Create a minimal index.html for testing
  const testHtmlPath = path.join(projectRoot, 'public', 'test.html');
  const testHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Page</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Test Page</h1>
  <p>If you can see this page, your web server is working correctly.</p>
  
  <div class="card">
    <h2>Next Steps</h2>
    <p>Try these troubleshooting steps:</p>
    <ol>
      <li>Clear your browser cache completely</li>
      <li>Try accessing the site in an incognito/private window</li>
      <li>Check browser console for any errors</li>
      <li>Try a different browser</li>
    </ol>
  </div>
  
  <script>
    console.log('Test page loaded successfully');
  </script>
</body>
</html>
  `;
  
  try {
    // Create public directory if it doesn't exist
    const publicDir = path.join(projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(testHtmlPath, testHtmlContent);
    console.log(`✅ Created test page at ${testHtmlPath}`);
    console.log('You can access this page at: http://localhost:5173/test.html');
  } catch (error) {
    console.error(`Error creating test page: ${error.message}`);
  }
  
  // 2. Create a simple component to test rendering
  const testComponentPath = path.join(projectRoot, 'src', 'components', 'TestComponent.tsx');
  const testComponentContent = `
import React from 'react';

export default function TestComponent() {
  return (
    <div className="p-4 m-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold mb-2">Test Component</h2>
      <p>If you can see this component, React rendering is working correctly.</p>
    </div>
  );
}
  `;
  
  try {
    fs.writeFileSync(testComponentPath, testComponentContent);
    console.log(`✅ Created test component at ${testComponentPath}`);
  } catch (error) {
    console.error(`Error creating test component: ${error.message}`);
  }
  
  // 3. Create a modified version of App.tsx that includes the test component
  const appPath = path.join(projectRoot, 'src', 'App.tsx');
  
  if (fs.existsSync(appPath)) {
    try {
      let appContent = fs.readFileSync(appPath, 'utf8');
      
      // Create a backup of the original App.tsx
      fs.writeFileSync(`${appPath}.backup`, appContent);
      console.log(`✅ Created backup of App.tsx at ${appPath}.backup`);
      
      // Add the test component import
      if (!appContent.includes('import TestComponent')) {
        appContent = appContent.replace(
          'import React from',
          'import React from\'react\';\nimport TestComponent from \'./components/TestComponent\';'
        );
        
        // Add the test component to the Routes
        appContent = appContent.replace(
          '<Route path="/" element={<LandingPage />} />',
          '<Route path="/" element={<><TestComponent /><LandingPage /></>} />'
        );
        
        fs.writeFileSync(appPath, appContent);
        console.log(`✅ Modified App.tsx to include the test component`);
      }
    } catch (error) {
      console.error(`Error modifying App.tsx: ${error.message}`);
    }
  }
}

// Main function to run all checks
async function debugRenderingIssues() {
  console.log('=== Website Rendering Debug Tool ===');
  
  // Run all checks
  checkImagesDirectory();
  checkCssFiles();
  checkForConsoleErrors();
  checkAuthContext();
  
  // Create fixes
  createFixes();
  
  console.log('\n=== Debug Complete ===');
  console.log('Please try the following:');
  console.log('1. Access the test page at: http://localhost:5173/test.html');
  console.log('2. Restart your development server: npm run dev');
  console.log('3. Clear your browser cache completely');
  console.log('4. Try accessing the site in an incognito/private window');
}

// Run the debug function
debugRenderingIssues()
  .then(() => console.log('Debug script completed'))
  .catch(error => console.error('Debug script failed:', error));
