-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE MIGRATION FIX
-- Handles existing tables and adds missing columns
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════
-- FIX EXISTING GALLERIES TABLE
-- ═══════════════════════════════════════════════════════════════════════════

-- Add missing columns to galleries table if they don't exist
DO $$
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'status') THEN
        ALTER TABLE public.galleries
        ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;

    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'featured') THEN
        ALTER TABLE public.galleries
        ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;

    -- Add order_index column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'order_index') THEN
        ALTER TABLE public.galleries
        ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;

    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'tags') THEN
        ALTER TABLE public.galleries
        ADD COLUMN tags TEXT[];
    END IF;

    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'metadata') THEN
        ALTER TABLE public.galleries
        ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    -- Add seo_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'seo_data') THEN
        ALTER TABLE public.galleries
        ADD COLUMN seo_data JSONB DEFAULT '{}';
    END IF;

    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'galleries' AND column_name = 'created_by') THEN
        ALTER TABLE public.galleries
        ADD COLUMN created_by UUID REFERENCES public.users(id);
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- CREATE OR UPDATE GALLERY IMAGES TABLE
-- ═══════════════════════════════════════════════════════════════════════════

-- Create gallery_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gallery_id UUID REFERENCES public.galleries(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    cloudinary_id TEXT,
    title TEXT,
    description TEXT,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns to gallery_images
DO $$
BEGIN
    -- Add cloudinary_id if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_images')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'gallery_images' AND column_name = 'cloudinary_id') THEN
        ALTER TABLE public.gallery_images ADD COLUMN cloudinary_id TEXT;
    END IF;

    -- Add order_index if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_images')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'gallery_images' AND column_name = 'order_index') THEN
        ALTER TABLE public.gallery_images ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- FIX OTHER EXISTING TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- Fix clients table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
        -- Add status column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'clients' AND column_name = 'status') THEN
            ALTER TABLE public.clients
            ADD COLUMN status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'booked', 'active', 'completed', 'archived'));
        END IF;

        -- Add payment_status column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'clients' AND column_name = 'payment_status') THEN
            ALTER TABLE public.clients
            ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue'));
        END IF;

        -- Add total_paid column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'clients' AND column_name = 'total_paid') THEN
            ALTER TABLE public.clients
            ADD COLUMN total_paid DECIMAL(10, 2) DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Fix posts table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        -- Add status column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'posts' AND column_name = 'status') THEN
            ALTER TABLE public.posts
            ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived'));
        END IF;

        -- Add featured column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'posts' AND column_name = 'featured') THEN
            ALTER TABLE public.posts
            ADD COLUMN featured BOOLEAN DEFAULT false;
        END IF;

        -- Add view_count column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'posts' AND column_name = 'view_count') THEN
            ALTER TABLE public.posts
            ADD COLUMN view_count INTEGER DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Fix leads table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads') THEN
        -- Add status column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'leads' AND column_name = 'status') THEN
            ALTER TABLE public.leads
            ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'));
        END IF;

        -- Add score column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'leads' AND column_name = 'score') THEN
            ALTER TABLE public.leads
            ADD COLUMN score INTEGER DEFAULT 0;
        END IF;
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- CREATE NEW TABLES (only if they don't exist)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client', 'lead')),
    phone TEXT,
    avatar_url TEXT,
    business_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type TEXT NOT NULL,
    venue TEXT,
    venue_address TEXT,
    package_id TEXT,
    package_details JSONB DEFAULT '{}',
    duration_hours INTEGER,
    photographer_assigned UUID REFERENCES public.users(id),
    second_photographer UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'tentative' CHECK (status IN ('tentative', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    timeline JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type TEXT CHECK (payment_type IN ('deposit', 'partial', 'final', 'additional')),
    payment_method TEXT CHECK (payment_method IN ('credit_card', 'bank_transfer', 'cash', 'check', 'venmo', 'zelle')),
    stripe_payment_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    notes TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id),
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_date DATE,
    line_items JSONB DEFAULT '[]',
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id),
    template_id UUID,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'expired')),
    signed_at TIMESTAMPTZ,
    signature_data JSONB,
    ip_address INET,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Email Campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_id TEXT,
    recipient_list JSONB DEFAULT '[]',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    stats JSONB DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "bounced": 0}',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    assigned_to UUID REFERENCES public.users(id),
    related_to_type TEXT,
    related_to_id UUID,
    tags TEXT[],
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Portfolio Categories table
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    order_index INTEGER DEFAULT 0,
    parent_id UUID REFERENCES public.portfolio_categories(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════

-- Create storage buckets (if they don't exist)
DO $$
BEGIN
    -- This is handled by Supabase UI or CLI, not SQL
    -- Instructions: Create these buckets in Supabase Dashboard > Storage
    RAISE NOTICE 'Remember to create storage buckets: galleries, blog-images, portfolio, client-galleries, contracts, avatars';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_galleries_status ON public.galleries(status);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON public.galleries(featured);
CREATE INDEX IF NOT EXISTS idx_galleries_category ON public.galleries(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON public.gallery_images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON public.gallery_images(order_index);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS AND TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (if they don't exist)
DO $$
BEGIN
    -- Galleries
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_galleries_updated_at') THEN
        CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Clients
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_clients_updated_at') THEN
        CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Bookings
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Posts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
        CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Leads
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_updated_at') THEN
        CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view published galleries" ON public.galleries;
DROP POLICY IF EXISTS "Admins can manage galleries" ON public.galleries;
DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;

-- Recreate policies

-- Galleries policies (public read, admin write)
CREATE POLICY "Anyone can view published galleries" ON public.galleries
    FOR SELECT USING (status = 'published' OR status IS NULL);

CREATE POLICY "Admins can manage galleries" ON public.galleries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Gallery Images policies
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.galleries
            WHERE id = gallery_id AND (status = 'published' OR status IS NULL)
        )
    );

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Posts policies (public read, admin write)
CREATE POLICY "Anyone can view published posts" ON public.posts
    FOR SELECT USING (status = 'published' OR status IS NULL);

CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Comments policies (public read, moderated write)
CREATE POLICY "Anyone can view approved comments" ON public.comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can create comments" ON public.comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON public.comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════
-- REAL-TIME SUBSCRIPTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable realtime for specific tables (if not already enabled)
DO $$
BEGIN
    -- This is typically done through Supabase Dashboard
    RAISE NOTICE 'Remember to enable real-time for: galleries, gallery_images, bookings, payments, leads, tasks';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SUCCESS MESSAGE
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '✅ Migration fix completed successfully!';
    RAISE NOTICE 'All missing columns have been added to existing tables.';
    RAISE NOTICE 'New tables have been created where needed.';
    RAISE NOTICE 'RLS policies have been updated.';
END $$;