#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 TESTING ELOPEMENT SECTION RENDERING');
console.log('=====================================\n');

const pricingPagePath = './src/pages/PricingPage.tsx';
const content = fs.readFileSync(pricingPagePath, 'utf-8');

// Find the exact boundaries
const heroEnd = content.indexOf('</section>');
const elopementStart = content.indexOf('Intimate Luxury Elopements');
const traditionalStart = content.indexOf('Single Photographer Collections');

console.log(`Hero section ends at: ${heroEnd}`);
console.log(`Elopement section starts at: ${elopementStart}`);
console.log(`Traditional section starts at: ${traditionalStart}`);

// Extract the section between hero and traditional
const sectionBetween = content.substring(heroEnd, traditionalStart);

console.log('\n📋 SECTION BETWEEN HERO AND TRADITIONAL:');
console.log('=' .repeat(80));
console.log(sectionBetween.substring(0, 1000) + '...');
console.log('=' .repeat(80));

// Check if elopement section is actually in the right place
if (sectionBetween.includes('Intimate Luxury Elopements')) {
  console.log('✅ Elopement section IS in the correct position');
} else {
  console.log('❌ Elopement section NOT found between hero and traditional');
}

// Check for potential React errors
const potentialIssues = [];

// Check for missing imports
if (!content.includes("import CalendarAvailability")) {
  potentialIssues.push('❌ CalendarAvailability not imported');
} else {
  console.log('✅ CalendarAvailability is imported');
}

// Check for conditional rendering that might hide the section
const conditionalPatterns = [
  /\{.*&&.*Intimate Luxury Elopements/,
  /\{.*\?.*Intimate Luxury Elopements/,
  /if.*Intimate Luxury Elopements/
];

conditionalPatterns.forEach((pattern, index) => {
  if (pattern.test(content)) {
    potentialIssues.push(`⚠️ Conditional rendering pattern ${index + 1} detected`);
  }
});

// Check for try/catch blocks that might be swallowing errors
if (content.includes('try') && content.includes('catch')) {
  console.log('⚠️ Try/catch blocks detected - might be hiding errors');
}

console.log(`\n🎯 POTENTIAL ISSUES: ${potentialIssues.length}`);
potentialIssues.forEach(issue => console.log(issue));

// Look for the exact structure around the elopement section
const elopementContext = content.substring(elopementStart - 500, elopementStart + 500);
console.log('\n📋 ELOPEMENT SECTION CONTEXT:');
console.log('=' .repeat(50));
console.log(elopementContext);
console.log('=' .repeat(50));

console.log('\n🚨 DIAGNOSIS:');
if (potentialIssues.length === 0) {
  console.log('✅ No obvious code issues found');
  console.log('💡 The issue might be:');
  console.log('   1. A runtime JavaScript error in the browser');
  console.log('   2. A React component crash');
  console.log('   3. CSS hiding the section');
  console.log('   4. A build/compilation issue');
} else {
  console.log('🔧 Found potential issues that need fixing');
}
