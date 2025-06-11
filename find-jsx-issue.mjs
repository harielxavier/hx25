#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 DEEP JSX ANALYSIS - FINDING THE EXACT ISSUE');
console.log('==============================================\n');

const pricingPagePath = './src/pages/PricingPage.tsx';
const content = fs.readFileSync(pricingPagePath, 'utf-8');

// Find the exact positions
const sarahAIEnd = content.indexOf('</PricingSection>');
const elopementStart = content.indexOf('/* Elopement Collections - GOLDMINE PACKAGES */');
const singlePhotographerStart = content.indexOf('/* Single Photographer Collections */');

console.log('📍 SECTION POSITIONS:');
console.log(`Sarah AI ends at: ${sarahAIEnd}`);
console.log(`Elopement comment at: ${elopementStart}`);
console.log(`Single Photographer at: ${singlePhotographerStart}`);

// Extract the problematic area
const problemArea = content.substring(sarahAIEnd, singlePhotographerStart + 200);

console.log('\n📋 PROBLEM AREA (Sarah AI end to Single Photographer):');
console.log('=' .repeat(80));
console.log(problemArea);
console.log('=' .repeat(80));

// Check for specific issues
const lines = problemArea.split('\n');
let openBraces = 0;
let openParens = 0;
let openBrackets = 0;
let inJSX = false;
let jsxDepth = 0;

console.log('\n🔍 LINE-BY-LINE ANALYSIS:');
lines.forEach((line, index) => {
  const lineNum = index + 1;
  
  // Count braces, parens, brackets
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '(') openParens++;
    if (char === ')') openParens--;
    if (char === '[') openBrackets++;
    if (char === ']') openBrackets--;
    
    // Track JSX
    if (char === '<' && line[line.indexOf(char) + 1] !== '/') jsxDepth++;
    if (char === '<' && line[line.indexOf(char) + 1] === '/') jsxDepth--;
  }
  
  // Flag suspicious lines
  let flags = [];
  if (openBraces !== 0) flags.push(`braces:${openBraces}`);
  if (openParens !== 0) flags.push(`parens:${openParens}`);
  if (jsxDepth < 0) flags.push('jsx-negative');
  if (line.includes('PricingSection') && !line.includes('//')) flags.push('PricingSection');
  
  if (flags.length > 0 || line.trim().length > 0) {
    console.log(`${lineNum.toString().padStart(3)}: ${flags.join(' ')} | ${line}`);
  }
});

console.log(`\n📊 FINAL COUNTS:`);
console.log(`Open braces: ${openBraces}`);
console.log(`Open parens: ${openParens}`);
console.log(`Open brackets: ${openBrackets}`);
console.log(`JSX depth: ${jsxDepth}`);

// Look for the exact issue
console.log('\n🎯 SPECIFIC ISSUES:');

// Check if there's a missing closing tag for the Sarah AI section
const sarahAISection = content.substring(content.lastIndexOf('<PricingSection', sarahAIEnd), sarahAIEnd + 20);
console.log('Sarah AI section end:', sarahAISection);

// Check if elopement section starts properly
const elopementSectionStart = content.substring(elopementStart, elopementStart + 300);
console.log('\nElopement section start:', elopementSectionStart);

// Check for React component errors
if (content.includes('CalendarAvailability')) {
  console.log('\n✅ CalendarAvailability import found');
} else {
  console.log('\n❌ CalendarAvailability import missing');
}

// Check for syntax errors that would break React
const syntaxIssues = [];
if (content.includes('className="') && content.includes('class="')) {
  syntaxIssues.push('Mixed className and class attributes');
}

if (content.match(/\{[^}]*\{[^}]*\}/)) {
  syntaxIssues.push('Nested curly braces detected');
}

if (syntaxIssues.length > 0) {
  console.log('\n⚠️ SYNTAX ISSUES:');
  syntaxIssues.forEach(issue => console.log(`  - ${issue}`));
}

console.log('\n🔧 RECOMMENDATION:');
if (openBraces !== 0) {
  console.log(`❌ CRITICAL: ${Math.abs(openBraces)} ${openBraces > 0 ? 'missing closing' : 'extra'} braces`);
} else if (jsxDepth !== 0) {
  console.log(`❌ CRITICAL: ${Math.abs(jsxDepth)} ${jsxDepth > 0 ? 'unclosed' : 'extra'} JSX tags`);
} else {
  console.log('✅ No obvious syntax errors - issue might be runtime/component related');
}
