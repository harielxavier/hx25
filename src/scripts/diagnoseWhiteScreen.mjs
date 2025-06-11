// This script diagnoses white screen issues without changing your original design
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('Starting white screen diagnosis...');

// Check main.tsx for issues
function checkMainTsx() {
  const mainPath = path.join(projectRoot, 'src', 'main.tsx');
  
  if (!fs.existsSync(mainPath)) {
    console.error('❌ main.tsx not found!');
    return;
  }
  
  console.log('Checking main.tsx...');
  
  // Read the file content
  const content = fs.readFileSync(mainPath, 'utf8');
  
  // Create a diagnostic version that logs each step of rendering
  const diagnosticContent = `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

console.log('1. main.tsx is executing');

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('GLOBAL ERROR CAUGHT:', event.error);
  // Log the error but don't prevent default to see the actual error in console
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Get the root element
const rootElement = document.getElementById('root');

console.log('2. Root element found:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    console.log('3. Creating React root');
    const root = createRoot(rootElement);
    
    console.log('4. About to render React app');
    root.render(
      <StrictMode>
        <div id="diagnostic-wrapper">
          <div id="diagnostic-header" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(255,0,0,0.8)',
            color: 'white',
            padding: '10px',
            zIndex: 9999,
            fontSize: '14px',
            textAlign: 'center'
          }}>
            DIAGNOSTIC MODE - If you can see this, React is rendering
          </div>
          
          <AuthProvider>
            <App />
          </AuthProvider>
        </div>
      </StrictMode>
    );
    
    console.log('5. React app rendered successfully');
  } catch (error) {
    console.error('ERROR RENDERING REACT APP:', error);
    
    // Fallback rendering if React fails
    rootElement.innerHTML = \`
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Error Loading Application</h1>
        <p>There was a problem loading the application:</p>
        <pre style="background: #f8f8f8; padding: 10px; border-radius: 4px; overflow: auto;">\${error?.message || 'Unknown error'}</pre>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    \`;
  }
}
`;
  
  // Create a backup of the original file
  const backupPath = `${mainPath}.original`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(mainPath, backupPath);
    console.log(`✅ Created backup of original main.tsx at ${backupPath}`);
  }
  
  // Write the diagnostic content
  fs.writeFileSync(mainPath, diagnosticContent);
  console.log('✅ Created diagnostic version of main.tsx');
}

// Check for image issues
function checkImagePaths() {
  console.log('Checking image paths...');
  
  const landingPagePath = path.join(projectRoot, 'src', 'pages', 'LandingPage.tsx');
  
  if (!fs.existsSync(landingPagePath)) {
    console.error('❌ LandingPage.tsx not found!');
    return;
  }
  
  const content = fs.readFileSync(landingPagePath, 'utf8');
  
  // Check for image imports
  const heroImageMatch = content.match(/import HeroPage from ['"](.*?)['"]/);
  const portraitImageMatch = content.match(/import Portrait from ['"](.*?)['"]/);
  
  if (heroImageMatch) {
    const heroImagePath = heroImageMatch[1];
    console.log(`Found HeroPage import: ${heroImagePath}`);
    
    // Check if the file exists
    const absolutePath = path.resolve(projectRoot, heroImagePath.replace(/^\//, ''));
    if (fs.existsSync(absolutePath)) {
      console.log(`✅ HeroPage image exists at ${absolutePath}`);
    } else {
      console.error(`❌ HeroPage image NOT FOUND at ${absolutePath}`);
      
      // Check if it exists in the public folder
      const publicPath = path.join(projectRoot, 'public', heroImagePath.replace(/^\//, ''));
      if (fs.existsSync(publicPath)) {
        console.log(`✅ HeroPage image exists in public folder at ${publicPath}`);
      } else {
        console.error(`❌ HeroPage image NOT FOUND in public folder at ${publicPath}`);
      }
    }
  } else {
    console.error('❌ Could not find HeroPage import in LandingPage.tsx');
  }
  
  if (portraitImageMatch) {
    const portraitImagePath = portraitImageMatch[1];
    console.log(`Found Portrait import: ${portraitImagePath}`);
    
    // Check if the file exists
    const absolutePath = path.resolve(projectRoot, portraitImagePath.replace(/^\//, ''));
    if (fs.existsSync(absolutePath)) {
      console.log(`✅ Portrait image exists at ${absolutePath}`);
    } else {
      console.error(`❌ Portrait image NOT FOUND at ${absolutePath}`);
      
      // Check if it exists in the public folder
      const publicPath = path.join(projectRoot, 'public', portraitImagePath.replace(/^\//, ''));
      if (fs.existsSync(publicPath)) {
        console.log(`✅ Portrait image exists in public folder at ${publicPath}`);
      } else {
        console.error(`❌ Portrait image NOT FOUND in public folder at ${publicPath}`);
      }
    }
  } else {
    console.error('❌ Could not find Portrait import in LandingPage.tsx');
  }
}

// Check for CSS issues
function checkCssImports() {
  console.log('Checking CSS imports...');
  
  const indexCssPath = path.join(projectRoot, 'src', 'index.css');
  
  if (fs.existsSync(indexCssPath)) {
    console.log(`✅ index.css exists at ${indexCssPath}`);
    
    // Check the content of index.css
    const content = fs.readFileSync(indexCssPath, 'utf8');
    console.log(`index.css content length: ${content.length} bytes`);
    
    if (content.includes('@tailwind')) {
      console.log('✅ Tailwind directives found in index.css');
    } else {
      console.error('❌ No Tailwind directives found in index.css');
    }
  } else {
    console.error(`❌ index.css NOT FOUND at ${indexCssPath}`);
  }
}

// Check for Firebase initialization issues
function checkFirebaseInit() {
  console.log('Checking Firebase initialization...');
  
  const firebasePath = path.join(projectRoot, 'src', 'lib', 'firebase.ts');
  
  if (!fs.existsSync(firebasePath)) {
    console.error('❌ firebase.ts not found!');
    return;
  }
  
  const content = fs.readFileSync(firebasePath, 'utf8');
  
  if (content.includes('getApps().length === 0')) {
    console.log('✅ Firebase initialization has duplicate app check');
  } else {
    console.error('❌ Firebase initialization missing duplicate app check');
  }
}

// Create an HTML file that will definitely load
function createFallbackHtml() {
  console.log('Creating fallback HTML...');
  
  const fallbackPath = path.join(projectRoot, 'public', 'fallback.html');
  
  const fallbackContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hariel Xavier Photography - Fallback</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #000;
      color: white;
      padding: 20px;
      text-align: center;
    }
    h1 {
      margin: 0;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      background-color: #000;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    footer {
      background-color: #f8f8f8;
      padding: 20px;
      text-align: center;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <header>
    <h1>Hariel Xavier Photography</h1>
    <p>Wedding Photography in Sparta, NJ</p>
  </header>
  
  <div class="container">
    <div class="content">
      <h2>Welcome to Our Photography Portfolio</h2>
      <p>
        This is a fallback page to verify that your web server is working correctly.
        If you're seeing this page, it means your web server is operational, but there
        might be issues with your React application.
      </p>
      
      <h3>Diagnostic Information:</h3>
      <p>
        If your main application is showing a white screen, please check the browser console
        for error messages (Press F12 or right-click and select "Inspect" then go to "Console").
      </p>
      
      <div>
        <a href="/" class="button">Try Main Site</a>
        <a href="/index.html" class="button">Try Index.html</a>
      </div>
    </div>
  </div>
  
  <footer>
    &copy; 2025 Hariel Xavier Photography. All rights reserved.
  </footer>
</body>
</html>
`;
  
  fs.writeFileSync(fallbackPath, fallbackContent);
  console.log(`✅ Created fallback HTML at ${fallbackPath}`);
}

// Run all checks
async function runDiagnostics() {
  try {
    // Check main.tsx
    checkMainTsx();
    
    // Check image paths
    checkImagePaths();
    
    // Check CSS imports
    checkCssImports();
    
    // Check Firebase initialization
    checkFirebaseInit();
    
    // Create fallback HTML
    createFallbackHtml();
    
    console.log('\n=== Diagnostics completed ===');
    console.log('Please restart your development server (npm run dev)');
    console.log('Then check the browser console for detailed error messages');
    console.log('You can also try accessing the fallback page at: http://localhost:5173/fallback.html');
    
  } catch (error) {
    console.error('Error running diagnostics:', error);
  }
}

// Run the diagnostics
runDiagnostics()
  .then(() => console.log('Diagnostic script completed'))
  .catch(error => console.error('Diagnostic script failed:', error));
