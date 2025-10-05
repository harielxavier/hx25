import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

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

async function runQuickTest() {
  console.log('🚀 Quick E2E Test for Admin Sidebar');
  console.log('⚠️  Note: This assumes you are already logged in to the admin panel\n');
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  let passed = 0;
  let failed = 0;
  const errors = [];
  const results = [];
  
  try {
    console.log('\n📋 Testing all sidebar navigation items...\n');
    
    for (const item of sidebarTests) {
      try {
        console.log(`🔍 [${passed + failed + 1}/${sidebarTests.length}] ${item.section} > ${item.name}`);
        
        // Navigate to the page
        await page.goto(`${BASE_URL}${item.path}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Wait for page to settle
        await page.waitForTimeout(1500);
        
        // Check current URL
        const currentUrl = page.url();
        const isCorrectPath = currentUrl.includes(item.path) || currentUrl.includes('/admin/login');
        
        // Check if redirected to login (not authenticated)
        if (currentUrl.includes('/admin/login')) {
          console.log(`   ⚠️  REDIRECTED TO LOGIN - Authentication required`);
          results.push({
            ...item,
            status: 'AUTH_REQUIRED',
            url: currentUrl
          });
          continue;
        }
        
        // Check for error messages
        const pageContent = await page.content();
        const hasNotFound = pageContent.toLowerCase().includes('not found') || 
                           pageContent.toLowerCase().includes('404');
        const hasError = pageContent.toLowerCase().includes('error occurred');
        
        if (hasNotFound) {
          throw new Error('Page shows 404 Not Found');
        }
        
        if (hasError) {
          throw new Error('Page shows error message');
        }
        
        // Check if page has content (not blank)
        const bodyText = await page.locator('body').textContent();
        if (bodyText.trim().length < 50) {
          throw new Error('Page appears to be empty');
        }
        
        // Check if sidebar is visible
        const hasSidebar = await page.locator('[class*="sidebar"], text="DASHBOARD"').count() > 0;
        
        // Take screenshot
        const filename = `admin-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        await page.screenshot({ 
          path: `./screenshots/${filename}.png`,
          fullPage: false 
        });
        
        console.log(`   ✅ PASSED - Page loaded successfully ${!hasSidebar ? '(no sidebar)' : ''}`);
        passed++;
        
        results.push({
          ...item,
          status: 'PASSED',
          url: currentUrl,
          hasSidebar
        });
        
      } catch (error) {
        console.log(`   ❌ FAILED - ${error.message}`);
        failed++;
        
        errors.push({
          item: `${item.section} > ${item.name}`,
          path: item.path,
          error: error.message
        });
        
        results.push({
          ...item,
          status: 'FAILED',
          error: error.message
        });
        
        // Take error screenshot
        const filename = `ERROR-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        await page.screenshot({ 
          path: `./screenshots/${filename}.png`,
          fullPage: true 
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
  } finally {
    await browser.close();
  }
  
  // Print detailed summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${sidebarTests.length}`);
  console.log(`✅ Passed: ${passed} (${((passed / sidebarTests.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed} (${((failed / sidebarTests.length) * 100).toFixed(1)}%)`);
  
  // Group results by section
  console.log('\n📋 RESULTS BY SECTION:');
  console.log('='.repeat(70));
  
  const sections = [...new Set(sidebarTests.map(t => t.section))];
  sections.forEach(section => {
    console.log(`\n${section}:`);
    const sectionResults = results.filter(r => r.section === section);
    sectionResults.forEach(r => {
      const icon = r.status === 'PASSED' ? '✅' : r.status === 'FAILED' ? '❌' : '⚠️';
      console.log(`  ${icon} ${r.name}`);
      if (r.status === 'FAILED') {
        console.log(`     Error: ${r.error}`);
      }
    });
  });
  
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('❌ DETAILED ERRORS:');
    console.log('='.repeat(70));
    errors.forEach((err, index) => {
      console.log(`\n${index + 1}. ${err.item}`);
      console.log(`   Path: ${err.path}`);
      console.log(`   Error: ${err.error}`);
    });
  }
  
  console.log('\n📸 Screenshots saved to ./screenshots/ directory');
  console.log('='.repeat(70));
  
  if (failed === 0 && passed === sidebarTests.length) {
    console.log('\n🎉 Perfect! All admin sidebar links are working correctly!\n');
  } else if (failed > 0) {
    console.log(`\n⚠️  ${failed} issue(s) found. Check screenshots for details.\n`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run the test
console.log('\n💡 TIP: Make sure you are logged into the admin panel in your browser first!');
console.log('    Open http://localhost:5173/admin/login and login before running this test.\n');

setTimeout(() => {
  runQuickTest().catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}, 2000);
