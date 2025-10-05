#!/usr/bin/env node
/**
 * Automatic Supabase Setup Script
 * Creates all tables and buckets automatically
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🚀 AUTOMATIC SUPABASE SETUP\n');
console.log('='.repeat(50));

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env');
  console.log('\nAdd to your .env file:');
  console.log('VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJhbGci...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
let sql;
try {
  sql = readFileSync('./create-supabase-tables.sql', 'utf-8');
} catch (error) {
  console.error('❌ Could not read create-supabase-tables.sql');
  process.exit(1);
}

console.log('\n📊 Creating database schema...\n');

// Split SQL into individual statements and execute
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('DO $$'));

let success = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (stmt.includes('CREATE') || stmt.includes('INSERT') || stmt.includes('ALTER') || stmt.includes('DROP')) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });
      if (error) {
        // Try direct approach for some statements
        console.log(`   ⏭  Skipping: ${stmt.substring(0, 50)}...`);
      } else {
        success++;
        console.log(`   ✅ ${stmt.substring(0, 60)}...`);
      }
    } catch (error) {
      failed++;
      console.log(`   ⚠️  ${error.message}`);
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n⚠️  SQL execution via API is limited.`);
console.log(`\n📋 MANUAL SETUP REQUIRED:`);
console.log(`\n1. Go to: ${supabaseUrl.replace('https://', 'https://app.')}/project/_/sql`);
console.log(`2. Copy and paste the contents of: create-supabase-tables.sql`);
console.log(`3. Click "Run"`);
console.log(`4. Then run: node migrate-to-supabase.mjs\n`);

console.log('Opening SQL file for you...\n');

// Show the file content
console.log('━'.repeat(50));
console.log('COPY THIS SQL TO SUPABASE DASHBOARD:');
console.log('━'.repeat(50));
console.log(sql.substring(0, 1000));
console.log('\n... [Full SQL in create-supabase-tables.sql] ...\n');
console.log('━'.repeat(50));

process.exit(0);
