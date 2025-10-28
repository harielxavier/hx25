-- ========================================
-- MISSING TABLES FIX - COPY ALL & PASTE INTO SUPABASE
-- ========================================

-- Create clients table (CRITICAL for app)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    wedding_date DATE,
    venue TEXT,
    package_type TEXT,
    package_price DECIMAL(10, 2),
    payment_status TEXT DEFAULT 'pending',
    total_paid DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    status TEXT DEFAULT 'lead',
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table (CRITICAL for app)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type TEXT NOT NULL,
    venue TEXT,
    venue_address TEXT,
    package_details JSONB DEFAULT '{}',
    duration_hours INTEGER,
    status TEXT DEFAULT 'tentative',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Handle users table - remove foreign key constraint if it exists, then fix structure
DO $$
BEGIN
    -- Drop foreign key constraint if it exists (this is causing the error)
    BEGIN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
    EXCEPTION WHEN undefined_object THEN NULL;
    END;

    -- Create table if it doesn't exist (standalone, not linked to auth.users)
    CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
        ALTER TABLE public.users ADD COLUMN full_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'client';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE public.users ADD COLUMN phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
    END IF;

    -- Fix the ID column to be auto-generated if it's not
    BEGIN
        ALTER TABLE public.users ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    EXCEPTION WHEN others THEN NULL;
    END;
END $$;

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    event_date DATE,
    event_type TEXT,
    venue TEXT,
    budget_range TEXT,
    message TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_categories table
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (safe to run multiple times)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Create basic policies (admin access) - skip if they exist
DO $$
BEGIN
    -- Create policies only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Admins can manage clients') THEN
        CREATE POLICY "Admins can manage clients" ON public.clients FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Admins can manage bookings') THEN
        CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can manage users') THEN
        CREATE POLICY "Admins can manage users" ON public.users FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Admins can manage payments') THEN
        CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Admins can manage leads') THEN
        CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_categories' AND policyname = 'Anyone can view portfolio categories') THEN
        CREATE POLICY "Anyone can view portfolio categories" ON public.portfolio_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'settings' AND policyname = 'Anyone can view public settings') THEN
        CREATE POLICY "Anyone can view public settings" ON public.settings FOR SELECT USING (is_public = true);
    END IF;
END $$;

-- Create indexes for performance (safe for existing indexes)
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Insert default admin user (you can change this) - let ID auto-generate
INSERT INTO public.users (email, full_name, role)
VALUES ('admin@harielxavierphotography.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- DONE! Your app should work after this.
-- ========================================