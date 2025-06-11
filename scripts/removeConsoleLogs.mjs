#!/usr/bin/env node

/**
 * Console Log Removal Script
 * 
 * This script removes console.log statements from production code by transforming
 * them into no-op functions when in production mode. This approach allows you to keep
 * console logs in development for debugging but removes them in production.
 * 
 * Usage: node scripts/removeConsoleLogs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the src directory
const srcDir = path.join(__dirname, '..', 'src');

// Path to the utils directory
const utilsDir = path.join(srcDir, 'utils');

// Check if logger.ts exists, if not create it
const loggerFilePath = path.join(utilsDir, 'logger.ts');

// Create logger.ts if it doesn't exist
if (!fs.existsSync(loggerFilePath)) {
  console.log('Creating logger utility file at', loggerFilePath);
  
  const loggerContent = `/**
 * Logger utility for consistent logging across the application
 * Automatically disables logs in production environment
 */

const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: any[]) => void;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

/**
 * Production logger that suppresses all logs except errors and warnings
 */
const productionLogger: Logger = {
  debug: () => {},
  log: () => {},
  info: () => {},
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};

/**
 * Development logger that outputs all logs
 */
const developmentLogger: Logger = {
  debug: (...args) => console.debug(...args),
  log: (...args) => console.log(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};

// Export the appropriate logger based on environment
export const logger: Logger = isProduction ? productionLogger : developmentLogger;

/**
 * Track occurrences of events (in dev mode only)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!isProduction) {
    logger.debug(\`[EVENT] \${eventName}\`, properties || {});
  }
  // In production, this would connect to your actual analytics system
}

export default logger;
`;

  fs.writeFileSync(loggerFilePath, loggerContent);
  console.log('Created logger.ts utility file');
}

// Check if vite.config.ts exists
const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  console.log('Updating Vite config to remove console logs in production');
  
  let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if the config already includes console removal
  if (!viteConfigContent.includes('drop_console')) {
    // Find the build section or create it
    if (viteConfigContent.includes('build:')) {
      // Append to existing build section
      viteConfigContent = viteConfigContent.replace(
        /build:\s*{/,
        `build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },`
      );
    } else {
      // Add new build section before the closing defineConfig
      viteConfigContent = viteConfigContent.replace(
        /}\s*\)\s*$/,
        `  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  }
})
`
      );
    }
    
    fs.writeFileSync(viteConfigPath, viteConfigContent);
    console.log('Updated Vite config to remove console logs in production');
  } else {
    console.log('Vite config already contains console log removal configuration');
  }
}

console.log('\nConsole Log Management Setup Complete!');
console.log('--------------------------------------');
console.log('To use the new logger instead of console.log:');
console.log('1. Import: import logger from "../../utils/logger"');
console.log('2. Replace: logger.log("message") instead of console.log("message")');
console.log('3. For tracking analytics events: import { trackEvent } from "../../utils/logger"');
console.log('\nThe next production build will remove all console.log statements automatically!');
