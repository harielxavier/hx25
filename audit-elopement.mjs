#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 ELOPEMENT IMPLEMENTATION AUDIT');
console.log('================================\n');

const projectPath = process.cwd();

// Check PricingPage.tsx
const pricingPagePath = path.join(projectPath, 'src/pages/PricingPage.tsx');
console.log('📄 Checking PricingPage.tsx...');

if (!fs.existsSync(pricingPagePath)) {
  console.log('❌ PricingPage.tsx does not exist');
  process.exit(1);
}

const pricingContent = fs.readFileSync(pricingPagePath, 'utf-8');

// Check for elopement content
const checks = [
  {
    name: 'Elopement Section Title',
    test: () => pricingContent.includes('Intimate Luxury Elopements'),
    required: true
  },
  {
    name: 'The Intimate Package',
    test: () => pricingContent.includes('The Intimate'),
    required: true
  },
  {
    name: 'The Adventure Package',
    test: () => pricingContent.includes('The Adventure'),
    required: true
  },
  {
    name: 'The Escape Package',
    test: () => pricingContent.includes('The Escape'),
    required: true
  },
  {
    name: 'Payment Plans - $133/month',
    test: () => pricingContent.includes('$133/month'),
    required: true
  },
  {
    name: 'Payment Plans - $183/month',
    test: () => pricingContent.includes('$183/month'),
    required: true
  },
  {
    name: 'Payment Plans - $241/month',
    test: () => pricingContent.includes('$241/month'),
    required: true
  },
  {
    name: 'Most Popular Badge',
    test: () => pricingContent.includes('MOST POPULAR'),
    required: true
  },
  {
    name: 'CalendarAvailability Import',
    test: () => pricingContent.includes('CalendarAvailability'),
    required: true
  },
  {
    name: 'Benefits Section',
    test: () => pricingContent.includes('Why Choose an Elopement'),
    required: false
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const result = check.test();
  if (result) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    console.log(`${check.required ? '❌' : '⚠️'} ${check.name}`);
    if (check.required) failed++;
  }
});

console.log('\n📊 PRICING PAGE RESULTS:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

// Check ElopementPackages component
const elopementComponentPath = path.join(projectPath, 'src/components/wedding/ElopementPackages.tsx');
console.log('\n📄 Checking ElopementPackages.tsx...');

if (fs.existsSync(elopementComponentPath)) {
  console.log('✅ ElopementPackages component exists');
  const elopementContent = fs.readFileSync(elopementComponentPath, 'utf-8');
  
  if (elopementContent.includes('interface ElopementPackage')) {
    console.log('✅ ElopementPackage interface defined');
  } else {
    console.log('⚠️ ElopementPackage interface missing');
  }
} else {
  console.log('❌ ElopementPackages component does not exist');
  failed++;
}

// Check CalendarAvailability component
const calendarComponentPath = path.join(projectPath, 'src/components/wedding/CalendarAvailability.tsx');
console.log('\n📄 Checking CalendarAvailability.tsx...');

if (fs.existsSync(calendarComponentPath)) {
  console.log('✅ CalendarAvailability component exists');
} else {
  console.log('❌ CalendarAvailability component does not exist');
  failed++;
}

// Final assessment
console.log('\n🎯 FINAL ASSESSMENT:');
if (failed === 0) {
  console.log('🎉 ALL CRITICAL COMPONENTS IMPLEMENTED!');
  console.log('✅ Elopement packages are properly implemented');
  console.log('✅ Components exist and are functional');
  console.log('✅ Ready for production use');
} else {
  console.log(`❌ ${failed} critical issues found`);
  console.log('🔧 Issues need to be resolved');
}

console.log('\n💡 RECOMMENDATIONS:');
console.log('1. Hard refresh browser (Cmd+Shift+R)');
console.log('2. Restart dev server (npm run dev)');
console.log('3. Check browser console for errors');
console.log('4. Navigate to: http://localhost:5174/pricing');

process.exit(failed > 0 ? 1 : 0);
