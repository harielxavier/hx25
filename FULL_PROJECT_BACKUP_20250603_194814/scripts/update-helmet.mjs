#!/usr/bin/env node

/**
 * Script to update all imports of react-helmet to react-helmet-async
 * This helps fix the UNSAFE_componentWillMount warning in React strict mode
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Count of files updated
let updatedFiles = 0;

/**
 * Process a file to replace react-helmet with react-helmet-async
 */
function processFile(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports react-helmet
    if (content.includes("from 'react-helmet'") || content.includes('from "react-helmet"')) {
      // Replace the import
      const updatedContent = content
        .replace(/from ['"]react-helmet['"]/g, "from 'react-helmet-async'");
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`✅ Updated: ${path.relative(rootDir, filePath)}`);
      updatedFiles++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

/**
 * Recursively walk through directories and process files
 */
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      walkDir(filePath);
    } else if (
      stat.isFile() && 
      (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.js'))
    ) {
      // Process TypeScript and JavaScript files
      processFile(filePath);
    }
  }
}

console.log('🔄 Updating react-helmet imports to react-helmet-async...');
walkDir(srcDir);
console.log(`✨ Done! Updated ${updatedFiles} files.`);
