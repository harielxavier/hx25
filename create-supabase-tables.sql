-- ════════════════════════════════════════════════════════════════════
-- SUPABASE DATABASE SCHEMA - COMPLETE SETUP
-- Run this in Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS galleries CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- ════════════════════════════════════════════════════════════════════
-- POSTS (BLOG)
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Hariel Xavier',
  views INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_featured ON posts(featured);

-- ════════════════════════════════════════════════════════════════════
-- GALLERIES
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE galleries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_galleries_slug ON galleries(slug);
CREATE INDEX idx_galleries_published ON galleries(published);
CREATE INDEX idx_galleries_featured ON galleries(featured);
CREATE INDEX idx_galleries_category ON galleries(category);

-- ════════════════════════════════════════════════════════════════════
-- CLIENTS
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  event_type TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);

-- ════════════════════════════════════════════════════════════════════
-- JOBS
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  status TEXT DEFAULT 'pending',
  package_info JSONB,
  total_amount NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_date ON jobs(date);

-- ════════════════════════════════════════════════════════════════════
-- LEADS
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- ════════════════════════════════════════════════════════════════════
-- VISITORS (ANALYTICS)
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE visitors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  visitor_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  duration INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX idx_visitors_timestamp ON visitors(timestamp);
CREATE INDEX idx_visitors_page_url ON visitors(page_url);

-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Galleries policies
CREATE POLICY "Public can view published galleries" ON galleries
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage galleries" ON galleries
  FOR ALL USING (auth.role() = 'authenticated');

-- Clients policies (admin only)
CREATE POLICY "Authenticated users can manage clients" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

-- Jobs policies (admin only)
CREATE POLICY "Authenticated users can manage jobs" ON jobs
  FOR ALL USING (auth.role() = 'authenticated');

-- Leads policies
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Visitors policies (analytics)
CREATE POLICY "Anyone can insert visitors" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view visitors" ON visitors
  FOR SELECT USING (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('galleries', 'galleries', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('blog-images', 'blog-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('profile-images', 'profile-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for galleries bucket
CREATE POLICY "Public can view gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'galleries');

CREATE POLICY "Authenticated can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'galleries' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update gallery images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'galleries' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete gallery images" ON storage.objects
  FOR DELETE USING (bucket_id = 'galleries' AND auth.role() = 'authenticated');

-- Storage policies for blog-images bucket
CREATE POLICY "Public can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update blog images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Storage policies for profile-images bucket
CREATE POLICY "Public can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile image" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile image" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for documents bucket (private)
CREATE POLICY "Authenticated can manage documents" ON storage.objects
  FOR ALL USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════════
-- SUCCESS MESSAGE
-- ════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  RAISE NOTICE '✅ Supabase schema created successfully!';
  RAISE NOTICE '✅ Tables: posts, galleries, clients, jobs, leads, visitors';
  RAISE NOTICE '✅ Storage buckets: galleries, blog-images, profile-images, documents';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Run node migrate-to-supabase.mjs to migrate data from Firebase';
END $$;
