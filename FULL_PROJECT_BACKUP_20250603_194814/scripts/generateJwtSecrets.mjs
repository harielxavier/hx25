#!/usr/bin/env node

/**
 * JWT Secret Generator Script
 * 
 * This script generates secure random strings for JWT tokens
 * and helps update your .env file with the new values.
 * 
 * Usage: node scripts/generateJwtSecrets.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the .env file
const envFilePath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate a random string of specified length
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  return Array.from(
    { length }, 
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

// Generate JWT secrets
function generateJwtSecrets() {
  return {
    accessSecret: generateRandomString(48),
    refreshSecret: generateRandomString(48)
  };
}

// Update .env file with new secrets
function updateEnvFile(secrets) {
  // Check if .env file exists
  const envExists = fs.existsSync(envFilePath);
  
  if (envExists) {
    // Read current .env file
    let envContent = fs.readFileSync(envFilePath, 'utf8');
    
    // Replace or add JWT secrets
    if (envContent.includes('VITE_JWT_ACCESS_SECRET=')) {
      envContent = envContent.replace(
        /VITE_JWT_ACCESS_SECRET=.*/,
        `VITE_JWT_ACCESS_SECRET=${secrets.accessSecret}`
      );
    } else {
      envContent += `\nVITE_JWT_ACCESS_SECRET=${secrets.accessSecret}\n`;
    }
    
    if (envContent.includes('VITE_JWT_REFRESH_SECRET=')) {
      envContent = envContent.replace(
        /VITE_JWT_REFRESH_SECRET=.*/,
        `VITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}`
      );
    } else {
      envContent += `VITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}\n`;
    }
    
    // Write updated content back to .env file
    fs.writeFileSync(envFilePath, envContent);
    console.log('✅ .env file updated with new JWT secrets');
  } else {
    // Create new .env file if it doesn't exist
    let newEnvContent = '';
    
    // First try to copy from .env.example if it exists
    if (fs.existsSync(envExamplePath)) {
      newEnvContent = fs.readFileSync(envExamplePath, 'utf8');
      // Replace any existing placeholder JWT values
      newEnvContent = newEnvContent.replace(
        /VITE_JWT_ACCESS_SECRET=.*/,
        `VITE_JWT_ACCESS_SECRET=${secrets.accessSecret}`
      );
      newEnvContent = newEnvContent.replace(
        /VITE_JWT_REFRESH_SECRET=.*/,
        `VITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}`
      );
      
      // If the replacement didn't happen (keys weren't in .env.example), add them
      if (!newEnvContent.includes('VITE_JWT_ACCESS_SECRET=')) {
        newEnvContent += `\nVITE_JWT_ACCESS_SECRET=${secrets.accessSecret}\n`;
      }
      if (!newEnvContent.includes('VITE_JWT_REFRESH_SECRET=')) {
        newEnvContent += `VITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}\n`;
      }
    } else {
      // Create minimal .env file
      newEnvContent = `# JWT Authentication\nVITE_JWT_ACCESS_SECRET=${secrets.accessSecret}\nVITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}\n`;
    }
    
    // Write new .env file
    fs.writeFileSync(envFilePath, newEnvContent);
    console.log('✅ Created new .env file with JWT secrets');
  }
}

// Main function
function main() {
  console.log('\n🔑 JWT Secret Generator');
  console.log('====================\n');
  
  const secrets = generateJwtSecrets();
  
  console.log('Generated secure JWT secrets:');
  console.log(`ACCESS_SECRET: ${secrets.accessSecret}`);
  console.log(`REFRESH_SECRET: ${secrets.refreshSecret}\n`);
  
  rl.question('Do you want to automatically update your .env file with these secrets? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      updateEnvFile(secrets);
    } else {
      console.log('\nManual setup instructions:');
      console.log('1. Open your .env file');
      console.log('2. Add or update the following lines:');
      console.log(`VITE_JWT_ACCESS_SECRET=${secrets.accessSecret}`);
      console.log(`VITE_JWT_REFRESH_SECRET=${secrets.refreshSecret}`);
    }
    
    console.log('\n✨ Remember to NEVER share these secrets or commit them to version control!');
    console.log('If you need to regenerate them, run this script again.\n');
    
    rl.close();
  });
}

// Run the script
main();
