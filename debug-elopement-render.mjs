#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 DEBUGGING ELOPEMENT RENDERING ISSUE');
console.log('=====================================\n');

const pricingPagePath = './src/pages/PricingPage.tsx';
const content = fs.readFileSync(pricingPagePath, 'utf-8');

// Check the structure around the elopement section
console.log('📄 Analyzing PricingPage.tsx structure...\n');

// Find the elopement section
const elopementStart = content.indexOf('Intimate Luxury Elopements');
const elopementEnd = content.indexOf('Single Photographer Collections');

if (elopementStart === -1) {
  console.log('❌ "Intimate Luxury Elopements" text not found!');
  process.exit(1);
}

if (elopementEnd === -1) {
  console.log('❌ "Single Photographer Collections" text not found!');
  process.exit(1);
}

console.log(`✅ Elopement section found at position: ${elopementStart}`);
console.log(`✅ Traditional section found at position: ${elopementEnd}`);

// Extract the section between them
const elopementSection = content.substring(elopementStart - 200, elopementEnd + 100);

console.log('\n📋 ELOPEMENT SECTION CONTEXT:');
console.log('=' .repeat(50));
console.log(elopementSection);
console.log('=' .repeat(50));

// Check for potential issues
const issues = [];

// Check for unclosed JSX tags
const openTags = (elopementSection.match(/<[^/][^>]*>/g) || []).length;
const closeTags = (elopementSection.match(/<\/[^>]*>/g) || []).length;
const selfClosing = (elopementSection.match(/<[^>]*\/>/g) || []).length;

console.log(`\n🔍 JSX TAG ANALYSIS:`);
console.log(`Opening tags: ${openTags}`);
console.log(`Closing tags: ${closeTags}`);
console.log(`Self-closing tags: ${selfClosing}`);

if (openTags !== closeTags + selfClosing) {
  issues.push('❌ Potential unclosed JSX tags');
} else {
  console.log('✅ JSX tags appear balanced');
}

// Check for JavaScript syntax issues
if (elopementSection.includes('CalendarAvailability')) {
  console.log('✅ CalendarAvailability component referenced');
} else {
  issues.push('❌ CalendarAvailability component not found in section');
}

// Check for conditional rendering
if (elopementSection.includes('&&') || elopementSection.includes('?')) {
  issues.push('⚠️ Conditional rendering detected - might be hiding section');
  console.log('⚠️ Found conditional rendering operators');
}

// Check for try/catch or error boundaries
if (elopementSection.includes('try') || elopementSection.includes('catch')) {
  console.log('⚠️ Error handling detected in section');
}

console.log(`\n🎯 POTENTIAL ISSUES FOUND: ${issues.length}`);
issues.forEach(issue => console.log(issue));

if (issues.length === 0) {
  console.log('✅ No obvious structural issues detected');
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Check browser DevTools for JavaScript errors');
  console.log('2. Add console.log statements in the elopement section');
  console.log('3. Temporarily comment out CalendarAvailability component');
  console.log('4. Check if there are any React error boundaries catching errors');
} else {
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Fix the identified issues above');
  console.log('2. Test the page again');
}

console.log('\n🚨 CRITICAL: Code exists but not rendering = Runtime JavaScript error');
