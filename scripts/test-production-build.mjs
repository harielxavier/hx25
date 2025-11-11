#!/usr/bin/env node

/**
 * Production Build Runtime Test
 * Tests the built application in a local preview to catch runtime errors
 * Run this after build validation to ensure the site actually loads
 */

import { spawn } from 'child_process';
import { chromium } from 'playwright';

console.log('🧪 Testing production build runtime...\n');

let previewServer;
let browser;

async function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣  Starting preview server...');

    previewServer = spawn('npm', ['run', 'preview', '--', '--port', '4173', '--host'], {
      stdio: 'pipe',
      shell: true
    });

    previewServer.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('http://localhost:4173')) {
        console.log('   ✅ Preview server started\n');
        resolve();
      }
    });

    previewServer.stderr.on('data', (data) => {
      console.error('Preview server error:', data.toString());
    });

    previewServer.on('error', reject);

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('Preview server failed to start within 10 seconds'));
    }, 10000);
  });
}

async function testWithBrowser() {
  console.log('2️⃣  Launching browser test...');

  browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const consoleErrors = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  try {
    console.log('   Loading http://localhost:4173...');

    // Navigate to the site
    await page.goto('http://localhost:4173', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for React to initialize
    await page.waitForTimeout(2000);

    // Check if app rendered
    const appRendered = await page.evaluate(() => {
      return document.querySelector('#root')?.children.length > 0;
    });

    if (!appRendered) {
      throw new Error('App failed to render - #root is empty');
    }

    // Check for specific React initialization errors
    const hasReactError = errors.some(err =>
      err.includes('Cannot set properties of undefined') ||
      err.includes('Cannot access') ||
      err.includes('before initialization') ||
      err.includes('AsyncMode')
    );

    if (hasReactError) {
      console.error('   ❌ CRITICAL: React initialization error detected!');
      errors.forEach(err => console.error(`      ${err}`));
      throw new Error('React initialization failed');
    }

    // Check console for errors
    if (consoleErrors.length > 0) {
      console.log('   ⚠️  Console errors detected:');
      consoleErrors.slice(0, 5).forEach(err => console.log(`      ${err}`));
      // Don't fail on console errors, just warn
    }

    if (errors.length > 0) {
      console.error('   ❌ Page errors detected:');
      errors.forEach(err => console.error(`      ${err}`));
      throw new Error('Page errors detected');
    }

    console.log('   ✅ App loaded successfully');
    console.log('   ✅ No React initialization errors');
    console.log('   ✅ Page rendered correctly\n');

    return true;
  } catch (error) {
    console.error('   ❌ Browser test failed:', error.message);
    throw error;
  }
}

async function cleanup() {
  if (browser) {
    await browser.close();
  }
  if (previewServer) {
    previewServer.kill();
  }
}

async function main() {
  try {
    await startPreviewServer();
    await testWithBrowser();

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 PRODUCTION BUILD RUNTIME TEST PASSED!');
    console.log('✅ Build loads without errors');
    console.log('✅ React initializes correctly');
    console.log('✅ Safe to deploy');
    console.log('═══════════════════════════════════════════════════════\n');

    await cleanup();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ PRODUCTION BUILD RUNTIME TEST FAILED!');
    console.error('⛔ DO NOT DEPLOY - Fix runtime errors first\n');

    await cleanup();
    process.exit(1);
  }
}

main();
