#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Generate JWT secrets for the application
 */
function generateJwtSecrets() {
  // Generate strong random secrets
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
  
  console.log('🔐 Generating JWT secrets...');
  
  // Read existing .env.windsurf file
  const envPath = '.env.windsurf';
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Remove existing JWT secrets if they exist
  envContent = envContent.replace(/^JWT_SECRET=.*$/m, '');
  envContent = envContent.replace(/^JWT_REFRESH_SECRET=.*$/m, '');
  
  // Add new JWT secrets
  const newSecrets = `
# JWT Secrets (Generated ${new Date().toISOString()})
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
`;
  
  envContent = envContent.trim() + newSecrets;
  
  // Write back to file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ JWT secrets generated and saved to .env.windsurf');
  console.log('🔒 Secrets are 64-byte random hex strings for maximum security');
  
  // Also update .env.production if it exists
  const prodEnvPath = '.env.production';
  if (fs.existsSync(prodEnvPath)) {
    let prodEnvContent = fs.readFileSync(prodEnvPath, 'utf8');
    
    // Remove existing JWT secrets if they exist
    prodEnvContent = prodEnvContent.replace(/^JWT_SECRET=.*$/m, '');
    prodEnvContent = prodEnvContent.replace(/^JWT_REFRESH_SECRET=.*$/m, '');
    
    // Add new JWT secrets
    prodEnvContent = prodEnvContent.trim() + newSecrets;
    
    fs.writeFileSync(prodEnvPath, prodEnvContent);
    console.log('✅ JWT secrets also updated in .env.production');
  }
  
  return {
    jwtSecret,
    jwtRefreshSecret
  };
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const secrets = generateJwtSecrets();
    console.log('\n🎉 JWT secrets generation complete!');
    console.log('📝 Make sure to restart your development server to pick up the new secrets.');
  } catch (error) {
    console.error('❌ Error generating JWT secrets:', error);
    process.exit(1);
  }
}

export { generateJwtSecrets };
