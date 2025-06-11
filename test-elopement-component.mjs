#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 TESTING ELOPEMENT COMPONENT ISOLATION');
console.log('=======================================\n');

const pricingPagePath = './src/pages/PricingPage.tsx';
const content = fs.readFileSync(pricingPagePath, 'utf-8');

// Extract just the elopement section
const elopementStart = content.indexOf('/* Elopement Collections - GOLDMINE PACKAGES */');
const traditionalStart = content.indexOf('/* Single Photographer Collections */');

if (elopementStart === -1) {
  console.log('❌ Elopement section comment not found');
  process.exit(1);
}

if (traditionalStart === -1) {
  console.log('❌ Traditional section comment not found');
  process.exit(1);
}

const elopementSection = content.substring(elopementStart, traditionalStart);

console.log('📋 ELOPEMENT SECTION EXTRACTED:');
console.log('=' .repeat(80));
console.log(elopementSection.substring(0, 500) + '...');
console.log('=' .repeat(80));

// Check for potential React issues
const issues = [];

// Check for unclosed JSX tags in the elopement section
const openTags = (elopementSection.match(/<[^\/][^>]*>/g) || []).length;
const closeTags = (elopementSection.match(/<\/[^>]*>/g) || []).length;
const selfCloseTags = (elopementSection.match(/<[^>]*\/>/g) || []).length;

console.log(`\n🔍 JSX TAG ANALYSIS:`);
console.log(`Opening tags: ${openTags}`);
console.log(`Closing tags: ${closeTags}`);
console.log(`Self-closing tags: ${selfCloseTags}`);

if (openTags !== closeTags + selfCloseTags) {
  issues.push(`❌ JSX tag mismatch: ${openTags} open vs ${closeTags + selfCloseTags} closed`);
}

// Check for JavaScript errors
if (elopementSection.includes('className=')) {
  console.log('✅ React className syntax found');
} else {
  issues.push('⚠️ No className attributes found - might be HTML instead of JSX');
}

// Check for missing key props in map functions
const mapFunctions = elopementSection.match(/\.map\([^)]*\)/g) || [];
console.log(`\n🔍 MAP FUNCTIONS FOUND: ${mapFunctions.length}`);

mapFunctions.forEach((mapFunc, index) => {
  console.log(`  ${index + 1}. ${mapFunc.substring(0, 50)}...`);
  
  // Check if the map has a key prop
  const mapContext = elopementSection.substring(
    elopementSection.indexOf(mapFunc) - 100,
    elopementSection.indexOf(mapFunc) + 200
  );
  
  if (!mapContext.includes('key=')) {
    issues.push(`⚠️ Map function ${index + 1} missing key prop`);
  }
});

// Check for potential component errors
if (elopementSection.includes('CalendarAvailability')) {
  console.log('✅ CalendarAvailability component referenced');
} else {
  issues.push('❌ CalendarAvailability component not found in elopement section');
}

// Check for potential syntax errors
const potentialErrors = [
  { pattern: /className="[^"]*"[^>]*className=/g, message: 'Duplicate className attributes' },
  { pattern: /\{[^}]*\{[^}]*\}/g, message: 'Nested curly braces (potential JSX error)' },
  { pattern: /onClick=\{[^}]*\}/g, message: 'onClick handlers found' }
];

potentialErrors.forEach(({ pattern, message }) => {
  const matches = elopementSection.match(pattern);
  if (matches) {
    console.log(`⚠️ ${message}: ${matches.length} instances`);
  }
});

console.log(`\n🎯 ISSUES FOUND: ${issues.length}`);
issues.forEach(issue => console.log(issue));

if (issues.length === 0) {
  console.log('\n✅ No obvious React/JSX issues found in elopement section');
  console.log('💡 The issue might be:');
  console.log('   1. A runtime error in CalendarAvailability component');
  console.log('   2. A CSS issue hiding the section');
  console.log('   3. A conditional rendering issue');
  console.log('   4. An import/dependency issue');
} else {
  console.log('\n🔧 Found potential issues that need fixing');
}

// Create a minimal test component
const testComponent = `
import React from 'react';
import { Check } from 'lucide-react';

const TestElopementSection = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid red' }}>
      <h2>TEST: Elopement Section</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-4 border">
          <h3>The Intimate</h3>
          <div className="text-3xl">$1,595</div>
          <div className="space-y-2">
            {[
              "3 hours coverage",
              "200 professionally edited images"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestElopementSection;
`;

fs.writeFileSync('./src/components/TestElopementSection.tsx', testComponent);
console.log('\n📝 Created test component: src/components/TestElopementSection.tsx');
console.log('💡 You can import and test this component to isolate the issue');
