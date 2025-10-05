import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@harielxavier.com'; // Update with your admin email
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-password'; // Update with your password

// All sidebar menu items based on your Sidebar.tsx
const sidebarTests = [
  // DASHBOARD Section
  { section: 'DASHBOARD', name: 'Overview', path: '/admin/dashboard' },
  { section: 'DASHBOARD', name: 'Mission Control', path: '/admin/mission-control' },
  { section: 'DASHBOARD', name: 'Activities', path: '/admin/activities' },
  
  // CLIENTS Section
  { section: 'CLIENTS', name: 'Client Database', path: '/admin/clients-page' },
  { section: 'CLIENTS', name: 'Leads', path: '/admin/leads' },
  { section: 'CLIENTS', name: 'Bookings', path: '/admin/bookings' },
  { section: 'CLIENTS', name: 'Communication', path: '/admin/communication' },
  { section: 'CLIENTS', name: 'Contracts', path: '/admin/contracts' },
  { section: 'CLIENTS', name: 'Payments & Invoicing', path: '/admin/invoicing' },
  { section: 'CLIENTS', name: 'Jobs', path: '/admin/jobs' },
  
  // CONTENT Section
  { section: 'CONTENT', name: 'Galleries', path: '/admin/galleries' },
  { section: 'CONTENT', name: 'Blog', path: '/admin/blog-manager' },
  { section: 'CONTENT', name: 'Media Library', path: '/admin/universal-media-manager' },
  
  // SETTINGS Section
  { section: 'SETTINGS', name: 'General', path: '/admin/settings' },
  { section: 'SETTINGS', name: 'Branding', path: '/admin/branding' },
  { section: 'SETTINGS', name: 'SEO', path: '/admin/seo' },
  { section: 'SETTINGS', name: 'Integrations', path: '/admin/integrations' }
];

async function runE2ETest() {
  console.log('🚀 Starting E2E Test for Admin Sidebar\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for CI/CD
    slowMo: 500 // Slow down actions to see what's happening
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  let passed = 0;
  let failed = 0;
  const errors = [];
  
  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Logging in...');
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Check if already logged in
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Already logged in, proceeding with tests...');
    } else {
      console.log('⏳ Attempting login...');
      // Wait for login form (adjust selectors based on your actual login form)
      await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 });
      await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"], input[name="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      
      // Wait for navigation to admin dashboard
      await page.waitForURL('**/admin/**', { timeout: 10000 });
      console.log('✅ Login successful!');
    }
    
    // Step 2: Test each sidebar item
    console.log('\n📋 Step 2: Testing all sidebar navigation items...');
    console.log('=' .repeat(60));
    
    for (const item of sidebarTests) {
      try {
        console.log(`\n🔍 Testing: ${item.section} > ${item.name}`);
        console.log(`   Path: ${item.path}`);
        
        // Navigate to the page
        await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle', timeout: 10000 });
        
        // Wait a bit for page to load
        await page.waitForTimeout(1000);
        
        // Check if we're on the correct page
        const currentUrl = page.url();
        if (!currentUrl.includes(item.path)) {
          throw new Error(`Navigation failed. Expected path: ${item.path}, Got: ${currentUrl}`);
        }
        
        // Check for common error indicators
        const hasError = await page.locator('text=/error|not found|404|500/i').count() > 0;
        if (hasError) {
          const errorText = await page.locator('text=/error|not found|404|500/i').first().textContent();
          throw new Error(`Page shows error: ${errorText}`);
        }
        
        // Check if sidebar is still visible
        const sidebarVisible = await page.locator('text="DASHBOARD"').isVisible().catch(() => false);
        if (!sidebarVisible) {
          console.log('   ⚠️  Warning: Sidebar may not be visible on this page');
        }
        
        // Take screenshot
        await page.screenshot({ 
          path: `./screenshots/admin-${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: false 
        });
        
        console.log(`   ✅ PASSED - Page loaded successfully`);
        passed++;
        
      } catch (error) {
        console.log(`   ❌ FAILED - ${error.message}`);
        failed++;
        errors.push({
          item: `${item.section} > ${item.name}`,
          path: item.path,
          error: error.message
        });
        
        // Take error screenshot
        await page.screenshot({ 
          path: `./screenshots/ERROR-${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: false 
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    errors.push({ item: 'Test Setup', error: error.message });
  } finally {
    await browser.close();
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${sidebarTests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / sidebarTests.length) * 100).toFixed(1)}%`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    console.log('='.repeat(60));
    errors.forEach((err, index) => {
      console.log(`\n${index + 1}. ${err.item}`);
      if (err.path) console.log(`   Path: ${err.path}`);
      console.log(`   Error: ${err.error}`);
    });
  } else {
    console.log('\n🎉 All tests passed! Your admin sidebar is working perfectly!');
  }
  
  console.log('\n📸 Screenshots saved to ./screenshots/ directory');
  console.log('='.repeat(60));
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run the test
runE2ETest().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
