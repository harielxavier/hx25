/**
 * This script helps identify and fix pages with double AdminLayout wrappers
 * Run with: node fix-double-sidebar.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminPagesDir = path.join(__dirname, 'src', 'pages', 'admin');
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');

// Read App.tsx to check which routes are already wrapped in AdminLayout
const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
const routeRegex = /<Route path="\/admin\/([^"]+)".+?<AdminLayout>/gs;
const wrappedRoutes = [];

let match;
while ((match = routeRegex.exec(appTsxContent)) !== null) {
  const routePath = match[1];
  wrappedRoutes.push(routePath);
}

console.log('Routes already wrapped in AdminLayout in App.tsx:');
console.log(wrappedRoutes);
console.log('\n');

// Process each admin page file
const adminFiles = fs.readdirSync(adminPagesDir).filter(file => file.endsWith('.tsx'));

let filesWithDoubleLayout = 0;
let filesFixed = 0;

adminFiles.forEach(file => {
  const filePath = path.join(adminPagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file imports AdminLayout
  if (content.includes('import AdminLayout from')) {
    // Check if the component is wrapped in AdminLayout in its return statement
    if (content.includes('<AdminLayout>')) {
      // Extract the component name from the file
      const componentNameMatch = content.match(/export\s+default\s+function\s+(\w+)/);
      if (!componentNameMatch) return;
      
      const componentName = componentNameMatch[1];
      
      // Check if this component is used in a route that's already wrapped in AdminLayout
      const isDoubleWrapped = wrappedRoutes.some(route => {
        // Convert route path to potential component name (e.g., "galleries/upload" -> "GalleryManager")
        const routeParts = route.split('/');
        const lastPart = routeParts[routeParts.length - 1];
        
        // Simple heuristic: check if component name contains the route name
        return componentName.toLowerCase().includes(lastPart.toLowerCase()) ||
               file.toLowerCase().includes(lastPart.toLowerCase());
      });
      
      if (isDoubleWrapped) {
        filesWithDoubleLayout++;
        console.log(`File ${file} has double AdminLayout wrapper for component ${componentName}`);
        
        // Fix the file by removing the AdminLayout wrapper
        const fixedContent = content.replace(/<AdminLayout>\s*([\s\S]*?)\s*<\/AdminLayout>/g, '$1');
        
        // Write the fixed content back to the file
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        filesFixed++;
        console.log(`Fixed ${file}`);
      }
    }
  }
});

console.log(`\nFound ${filesWithDoubleLayout} files with double AdminLayout wrappers`);
console.log(`Fixed ${filesFixed} files`);
