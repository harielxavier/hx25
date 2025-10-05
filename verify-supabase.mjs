#!/usr/bin/env node
/**
 * Supabase Setup Verification Script
 * Checks if everything is configured correctly
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 SUPABASE SETUP VERIFICATION\n');
console.log('='.repeat(50));

const checks = {
  config: false,
  connection: false,
  tables: false,
  storage: false,
  auth: false,
};

// Check 1: Environment Variables
console.log('\n✓ Checking environment variables...');
if (!supabaseUrl || !supabaseKey) {
  console.log('   ❌ Missing Supabase credentials in .env');
  console.log('   Add: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}
console.log('   ✅ Environment variables found');
checks.config = true;

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Check 2: Connection
console.log('\n✓ Checking Supabase connection...');
try {
  const { data, error } = await supabase.from('posts').select('count').limit(1);
  if (error && error.code !== '42P01') {
    throw error;
  }
  console.log('   ✅ Connected to Supabase');
  checks.connection = true;
} catch (error) {
  console.log('   ❌ Cannot connect to Supabase');
  console.log('   Error:', error.message);
  process.exit(1);
}

// Check 3: Tables
console.log('\n✓ Checking database tables...');
const requiredTables = ['posts', 'galleries', 'clients', 'jobs', 'leads', 'visitors'];
const tableStatus = {};

for (const table of requiredTables) {
  try {
    const { error } = await supabase.from(table).select('count').limit(1);
    if (error && error.code === '42P01') {
      tableStatus[table] = false;
    } else {
      tableStatus[table] = true;
    }
  } catch {
    tableStatus[table] = false;
  }
}

const missingTables = Object.entries(tableStatus)
  .filter(([_, exists]) => !exists)
  .map(([table]) => table);

if (missingTables.length > 0) {
  console.log(`   ⚠️  Missing tables: ${missingTables.join(', ')}`);
  console.log('   Run the SQL from SUPABASE_SETUP.txt STEP 3');
} else {
  console.log('   ✅ All required tables exist');
  checks.tables = true;
}

// Check 4: Storage Buckets
console.log('\n✓ Checking storage buckets...');
try {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) throw error;
  
  const requiredBuckets = ['galleries', 'blog-images', 'profile-images', 'documents'];
  const existingBuckets = buckets.map(b => b.name);
  const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
  
  if (missingBuckets.length > 0) {
    console.log(`   ⚠️  Missing buckets: ${missingBuckets.join(', ')}`);
    console.log('   Create them in Supabase Dashboard → Storage');
  } else {
    console.log('   ✅ All required storage buckets exist');
    checks.storage = true;
  }
} catch (error) {
  console.log('   ⚠️  Could not check storage buckets');
  console.log('   Error:', error.message);
}

// Check 5: Authentication
console.log('\n✓ Checking authentication setup...');
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log('   ⚠️  Auth check failed:', error.message);
  } else {
    console.log('   ✅ Authentication is configured');
    if (data.session) {
      console.log(`   👤 Logged in as: ${data.session.user.email}`);
    } else {
      console.log('   ℹ️  No active session (this is normal)');
    }
    checks.auth = true;
  }
} catch (error) {
  console.log('   ⚠️  Could not check auth');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('VERIFICATION SUMMARY\n');

const results = [
  ['Environment Config', checks.config],
  ['Database Connection', checks.connection],
  ['Database Tables', checks.tables],
  ['Storage Buckets', checks.storage],
  ['Authentication', checks.auth],
];

results.forEach(([check, passed]) => {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${check}`);
});

const allPassed = Object.values(checks).every(v => v);

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('\n🎉 SUCCESS! Your Supabase setup is complete!\n');
  console.log('Next steps:');
  console.log('  1. Run: node migrate-to-supabase.mjs (to migrate data)');
  console.log('  2. Run: ./switch-to-supabase.sh (to update imports)');
  console.log('  3. Start dev server: npm run dev\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Fix the issues above and try again.\n');
  console.log('See SUPABASE_SETUP.txt for detailed instructions.\n');
  process.exit(1);
}
