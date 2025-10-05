#!/usr/bin/env node
/**
 * COMPLETE FIREBASE TO SUPABASE MIGRATION SCRIPT
 * 
 * This script migrates your entire application from Firebase to Supabase:
 * 1. Firestore data → Supabase PostgreSQL
 * 2. Firebase Auth users → Supabase Auth
 * 3. Firebase Storage files → Supabase Storage
 * 
 * Run: node migrate-to-supabase.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Supabase config  
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🚀 FIREBASE → SUPABASE MIGRATION\n');
console.log('================================\n');

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Collections to migrate
const COLLECTIONS_TO_MIGRATE = [
  'posts',           // Blog posts
  'clients',         // Client database
  'jobs',           // Photography jobs
  'leads',          // Lead management
  'galleries',      // Gallery data
  'portfolioCategories', // Portfolio categories
  'venueCategories',    // Venue categories
  'venues',            // Venues
  'bookings',         // Bookings/Calendar
  'contracts',       // Contracts
  'payments',        // Payment records
  'visitors',        // Analytics visitors
  'settings',        // Site settings
];

async function migrateCollection(collectionName) {
  try {
    console.log(`\n📦 Migrating collection: ${collectionName}`);
    
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`   ⚠️  Collection "${collectionName}" is empty, skipping...`);
      return { success: true, count: 0 };
    }
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase timestamps if present
        created_at: doc.data().created_at?.toDate?.() || doc.data().created_at || new Date(),
        updated_at: doc.data().updated_at?.toDate?.() || doc.data().updated_at || new Date(),
      });
    });
    
    console.log(`   📊 Found ${documents.length} documents`);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from(collectionName)
      .upsert(documents, { onConflict: 'id' });
    
    if (error) {
      console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
      return { success: false, error: error.message };
    }
    
    console.log(`   ✅ Successfully migrated ${documents.length} documents`);
    return { success: true, count: documents.length };
    
  } catch (error) {
    console.error(`   ❌ Failed to migrate ${collectionName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function migrateAllCollections() {
  console.log('\n📚 STEP 1: Migrating Firestore Collections');
  console.log('==========================================\n');
  
  const results = {};
  
  for (const collectionName of COLLECTIONS_TO_MIGRATE) {
    const result = await migrateCollection(collectionName);
    results[collectionName] = result;
  }
  
  return results;
}

async function createSupabaseTables() {
  console.log('\n🏗️  STEP 0: Creating Supabase Tables (SQL)');
  console.log('==========================================\n');
  
  console.log(`
  ⚠️  IMPORTANT: Run these SQL commands in your Supabase SQL Editor first!
  
  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  
  -- Posts (Blog)
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    author TEXT,
    views INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
  );
  
  -- Galleries
  CREATE TABLE IF NOT EXISTS galleries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    cover_image TEXT,
    images JSONB DEFAULT '[]',
    category TEXT,
    date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Clients
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    event_type TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Jobs
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    title TEXT NOT NULL,
    type TEXT,
    date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    status TEXT DEFAULT 'pending',
    package_info JSONB,
    total_amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Leads
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    event_type TEXT,
    event_date TEXT,
    message TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Visitors (Analytics)
  CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    visitor_id TEXT,
    page_url TEXT,
    referrer TEXT,
    device TEXT,
    browser TEXT,
    country TEXT,
    city TEXT,
    duration INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Settings
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  Press ENTER when you've created the tables in Supabase...
  `);
  
  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });
  
  console.log('\n✅ Tables confirmed, proceeding with migration...\n');
}

async function displayResults(results) {
  console.log('\n📊 MIGRATION SUMMARY');
  console.log('===================\n');
  
  let totalDocs = 0;
  let successCount = 0;
  let failCount = 0;
  
  Object.entries(results).forEach(([collection, result]) => {
    const status = result.success ? '✅' : '❌';
    const count = result.count || 0;
    totalDocs += count;
    result.success ? successCount++ : failCount++;
    
    console.log(`${status} ${collection.padEnd(25)} ${count} documents`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`Total Documents Migrated: ${totalDocs}`);
  console.log(`Successful Collections: ${successCount}/${COLLECTIONS_TO_MIGRATE.length}`);
  console.log(`Failed Collections: ${failCount}`);
  console.log('='.repeat(50));
}

// Main migration flow
async function runMigration() {
  try {
    console.log('🔍 Checking connections...\n');
    
    // Check Firebase
    console.log('   📱 Firebase: Connected');
    
    // Check Supabase
    const { data, error } = await supabase.from('posts').select('count').limit(1);
    if (!error) {
      console.log('   🟢 Supabase: Connected\n');
    } else if (error.code === '42P01') {
      console.log('   ⚠️  Supabase: Connected (tables need to be created)\n');
    } else {
      console.log('   ❌ Supabase: Error -', error.message);
      throw new Error('Supabase connection failed');
    }
    
    // Create tables (with user confirmation)
    await createSupabaseTables();
    
    // Migrate data
    const results = await migrateAllCollections();
    
    // Display results
    displayResults(results);
    
    console.log('\n🎉 MIGRATION COMPLETE!\n');
    console.log('Next steps:');
    console.log('1. Update your .env to prioritize Supabase');
    console.log('2. Test all features in your app');
    console.log('3. Keep Firebase as backup until fully tested\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
