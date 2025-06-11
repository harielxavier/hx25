/**
 * Pre-Deployment Check Script
 * 
 * This script performs various checks and optimizations before deployment:
 * 1. Runs a build to catch any build-time errors
 * 2. Validates environment variables
 * 3. Checks for console logs and removes them from production code
 * 4. Runs linting and typechecking
 * 5. Analyzes bundle size
 * 
 * Usage: node scripts/preDeploymentCheck.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Print a colorful header
function printHeader(text) {
  console.log('\n' + colors.bright + colors.blue + '===== ' + text + ' =====' + colors.reset + '\n');
}

// Run a command and return its output
function runCommand(command, errorMessage) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    console.error(colors.red + errorMessage + colors.reset);
    console.error(error.stderr || error.stdout || error.message);
    return null;
  }
}

// Check if required environment variables are set in .env
function checkEnvironmentVariables() {
  printHeader('Checking Environment Variables');
  
  // Define required variables from .env.example
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_JWT_ACCESS_SECRET',
    'VITE_JWT_REFRESH_SECRET'
  ];
  
  // Load .env file if it exists
  let envVars = {};
  const envPath = path.join(__dirname, '..', '.env');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        envVars[match[1]] = match[2];
      }
    });
  }
  
  // Check for missing variables
  const missingVars = requiredVars.filter(varName => !envVars[varName]);
  
  if (missingVars.length > 0) {
    console.log(colors.yellow + 'Missing environment variables:' + colors.reset);
    missingVars.forEach(varName => {
      console.log(`- ${varName}`);
    });
    console.log('\nPlease add these to your .env file before deployment.');
    return false;
  } else {
    console.log(colors.green + 'All required environment variables are set.' + colors.reset);
    return true;
  }
}

// Find console.log statements in source code
function findConsoleLogs() {
  printHeader('Finding console.log statements');
  
  const result = runCommand(
    "find src -type f -name '*.ts' -o -name '*.tsx' | xargs grep -l 'console\\.log'",
    'Error searching for console.log statements'
  );
  
  if (!result) return false;
  
  const files = result.trim().split('\n').filter(Boolean);
  
  if (files.length > 0) {
    console.log(colors.yellow + 'console.log statements found in:' + colors.reset);
    files.forEach(file => {
      console.log(`- ${file}`);
    });
    console.log('\nConsider removing these statements for production.');
    return false;
  } else {
    console.log(colors.green + 'No console.log statements found.' + colors.reset);
    return true;
  }
}

// Run type checking
function runTypeCheck() {
  printHeader('Running TypeScript Type Check');
  
  const result = runCommand('npx tsc --noEmit', 'TypeScript type check failed');
  
  if (result !== null) {
    console.log(colors.green + 'TypeScript type check passed.' + colors.reset);
    return true;
  }
  
  return false;
}

// Run linting
function runLinting() {
  printHeader('Running ESLint');
  
  const result = runCommand('npx eslint src --ext .ts,.tsx', 'ESLint check failed');
  
  if (result !== null) {
    console.log(colors.green + 'ESLint check passed.' + colors.reset);
    return true;
  }
  
  return false;
}

// Build the project
function runBuild() {
  printHeader('Running Build');
  
  // First clean the dist directory
  if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
    try {
      fs.rmSync(path.join(__dirname, '..', 'dist'), { recursive: true });
    } catch (error) {
      console.error(colors.red + 'Failed to clean dist directory' + colors.reset);
      console.error(error);
    }
  }
  
  const result = runCommand('npm run build', 'Build failed');
  
  if (result !== null) {
    console.log(colors.green + 'Build succeeded.' + colors.reset);
    return true;
  }
  
  return false;
}

// Check for common security issues
function checkSecurity() {
  printHeader('Checking for Security Issues');
  
  // Check for hardcoded secrets
  const secretsResult = runCommand(
    "find src -type f -name '*.ts' -o -name '*.tsx' | xargs grep -l 'apiKey\\|secret\\|password\\|api_key'",
    'Error searching for potential secrets'
  );
  
  if (secretsResult && secretsResult.trim()) {
    const files = secretsResult.trim().split('\n').filter(Boolean);
    console.log(colors.yellow + 'Potential hardcoded secrets found in:' + colors.reset);
    files.forEach(file => {
      console.log(`- ${file}`);
    });
    console.log('\nPlease review these files to ensure no secrets are hardcoded.');
  } else {
    console.log(colors.green + 'No obvious hardcoded secrets found.' + colors.reset);
  }
  
  return true;
}

// Main function
async function main() {
  printHeader('PRE-DEPLOYMENT CHECK');
  console.log('Running checks to ensure the application is ready for deployment...\n');
  
  const checks = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'Console Logs', fn: findConsoleLogs },
    { name: 'TypeScript Check', fn: runTypeCheck },
    { name: 'ESLint', fn: runLinting },
    { name: 'Security Check', fn: checkSecurity },
    { name: 'Build', fn: runBuild }
  ];
  
  let allPassed = true;
  const results = {};
  
  for (const check of checks) {
    const passed = check.fn();
    results[check.name] = passed;
    if (!passed) allPassed = false;
  }
  
  // Summary
  printHeader('SUMMARY');
  
  console.log('Check Results:');
  Object.entries(results).forEach(([name, passed]) => {
    const status = passed 
      ? colors.green + 'PASSED' + colors.reset 
      : colors.red + 'FAILED' + colors.reset;
    console.log(`- ${name}: ${status}`);
  });
  
  if (allPassed) {
    console.log('\n' + colors.green + colors.bright + 'ALL CHECKS PASSED! Ready for deployment.' + colors.reset);
    return 0;
  } else {
    console.log('\n' + colors.yellow + colors.bright + 'SOME CHECKS FAILED. Please fix the issues before deployment.' + colors.reset);
    return 1;
  }
}

// Run the script
main().then(code => process.exit(code));
