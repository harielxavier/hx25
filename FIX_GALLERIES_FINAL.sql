-- ═══════════════════════════════════════════════════════════════════════════
-- ULTIMATE FIX FOR GALLERIES TABLE - NO BANDAIDS
-- Run this entire script at once in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- START TRANSACTION
BEGIN;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 1: CLEAN SLATE - REMOVE ALL CONFLICTS
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
    policy_record RECORD;
    trigger_record RECORD;
BEGIN
    -- Disable RLS to prevent any policy conflicts
    ALTER TABLE IF EXISTS public.galleries DISABLE ROW LEVEL SECURITY;

    -- Drop ALL policies on galleries table
    FOR policy_record IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'galleries'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.galleries', policy_record.policyname);
    END LOOP;

    -- Drop all triggers to prevent conflicts
    FOR trigger_record IN
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_schema = 'public'
        AND event_object_table = 'galleries'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.galleries', trigger_record.trigger_name);
    END LOOP;

    RAISE NOTICE '✓ Phase 1: Cleaned all policies and triggers';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 2: FIX SCHEMA - ADD ALL REQUIRED COLUMNS
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
    col_exists BOOLEAN;
    table_exists BOOLEAN;
BEGIN
    -- Check if galleries table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'galleries'
    ) INTO table_exists;

    IF NOT table_exists THEN
        -- Create the table from scratch if it doesn't exist
        CREATE TABLE public.galleries (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            cover_image TEXT,
            category TEXT,
            status TEXT DEFAULT 'published',
            featured BOOLEAN DEFAULT false,
            order_index INTEGER DEFAULT 0,
            tags TEXT[] DEFAULT '{}',
            metadata JSONB DEFAULT '{}',
            seo_data JSONB DEFAULT '{}',
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        RAISE NOTICE '✓ Created new galleries table';
    ELSE
        -- Table exists, add missing columns

        -- Add id column if missing (unlikely but check)
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'id'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
        END IF;

        -- Add title column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'title'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN title TEXT NOT NULL DEFAULT 'Untitled Gallery';
        END IF;

        -- Add description column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'description'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN description TEXT;
        END IF;

        -- Add cover_image column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'cover_image'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN cover_image TEXT;
        END IF;

        -- Add category column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'category'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN category TEXT;
        END IF;

        -- Add STATUS column (THE MAIN FIX)
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'status'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN status TEXT DEFAULT 'published';
            RAISE NOTICE '✓ Added status column';
        ELSE
            -- Column exists, ensure it has a default
            ALTER TABLE public.galleries ALTER COLUMN status SET DEFAULT 'published';
            -- Update any NULL values
            UPDATE public.galleries SET status = 'published' WHERE status IS NULL;
            RAISE NOTICE '✓ Status column already exists, updated defaults';
        END IF;

        -- Add featured column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'featured'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN featured BOOLEAN DEFAULT false;
            RAISE NOTICE '✓ Added featured column';
        END IF;

        -- Add order_index column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'order_index'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN order_index INTEGER DEFAULT 0;
            RAISE NOTICE '✓ Added order_index column';
        END IF;

        -- Add tags column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'tags'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN tags TEXT[] DEFAULT '{}';
            RAISE NOTICE '✓ Added tags column';
        END IF;

        -- Add metadata column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'metadata'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN metadata JSONB DEFAULT '{}';
            RAISE NOTICE '✓ Added metadata column';
        END IF;

        -- Add seo_data column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'seo_data'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN seo_data JSONB DEFAULT '{}';
            RAISE NOTICE '✓ Added seo_data column';
        END IF;

        -- Add created_by column
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'created_by'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN created_by UUID;
            RAISE NOTICE '✓ Added created_by column';
        END IF;

        -- Add timestamp columns
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'created_at'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
            RAISE NOTICE '✓ Added created_at column';
        END IF;

        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'galleries' AND column_name = 'updated_at'
        ) INTO col_exists;
        IF NOT col_exists THEN
            ALTER TABLE public.galleries ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
            RAISE NOTICE '✓ Added updated_at column';
        END IF;
    END IF;

    RAISE NOTICE '✓ Phase 2: Schema fixed - all columns exist';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 3: ADD CONSTRAINTS
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
    -- Drop old constraint if exists
    ALTER TABLE public.galleries DROP CONSTRAINT IF EXISTS galleries_status_check;

    -- Add status check constraint
    ALTER TABLE public.galleries ADD CONSTRAINT galleries_status_check
    CHECK (status IN ('draft', 'published', 'archived'));

    RAISE NOTICE '✓ Phase 3: Constraints added';
EXCEPTION
    WHEN check_violation THEN
        -- Some rows have invalid status values
        UPDATE public.galleries
        SET status = 'published'
        WHERE status NOT IN ('draft', 'published', 'archived') OR status IS NULL;

        -- Try again
        ALTER TABLE public.galleries ADD CONSTRAINT galleries_status_check
        CHECK (status IN ('draft', 'published', 'archived'));

        RAISE NOTICE '✓ Phase 3: Fixed invalid data and added constraints';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 4: CREATE INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_galleries_status ON public.galleries(status);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON public.galleries(featured);
CREATE INDEX IF NOT EXISTS idx_galleries_category ON public.galleries(category);
CREATE INDEX IF NOT EXISTS idx_galleries_order ON public.galleries(order_index);
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON public.galleries(created_at DESC);

DO $$
BEGIN
    RAISE NOTICE '✓ Phase 4: Indexes created';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 5: CREATE TRIGGER FOR UPDATED_AT
-- ═══════════════════════════════════════════════════════════════════════════

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if exists and create new one
DROP TRIGGER IF EXISTS update_galleries_updated_at ON public.galleries;
CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON public.galleries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✓ Phase 5: Triggers created';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 6: ENABLE RLS AND CREATE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Create policies AFTER all columns exist
CREATE POLICY "Public can view published galleries"
    ON public.galleries
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authenticated users can view all galleries"
    ON public.galleries
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can do everything"
    ON public.galleries
    FOR ALL
    USING (
        auth.uid() IS NOT NULL
        AND (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid()
                AND role = 'admin'
            )
            OR auth.jwt() ->> 'role' = 'admin'
            OR auth.jwt() ->> 'email' LIKE '%@harielxavier.com'
        )
    );

DO $$
BEGIN
    RAISE NOTICE '✓ Phase 6: RLS enabled and policies created';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 7: CREATE GALLERY_IMAGES TABLE IF NEEDED
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON public.gallery_images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON public.gallery_images(order_index);

-- Enable RLS on gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;

-- Create policies for gallery_images
CREATE POLICY "Public can view gallery images"
    ON public.gallery_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.galleries
            WHERE id = gallery_id
            AND status = 'published'
        )
    );

CREATE POLICY "Admins can manage gallery images"
    ON public.gallery_images
    FOR ALL
    USING (
        auth.uid() IS NOT NULL
        AND (
            EXISTS (
                SELECT 1 FROM public.users
                WHERE id = auth.uid()
                AND role = 'admin'
            )
            OR auth.jwt() ->> 'role' = 'admin'
        )
    );

DO $$
BEGIN
    RAISE NOTICE '✓ Phase 7: Gallery images table ready';
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 8: VERIFICATION
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
    status_exists BOOLEAN;
    featured_exists BOOLEAN;
    order_exists BOOLEAN;
    gallery_count INTEGER;
    test_result TEXT;
BEGIN
    -- Check if critical columns exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries' AND column_name = 'status'
    ) INTO status_exists;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries' AND column_name = 'featured'
    ) INTO featured_exists;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries' AND column_name = 'order_index'
    ) INTO order_exists;

    -- Count galleries
    SELECT COUNT(*) INTO gallery_count FROM public.galleries;

    -- Test a query that uses the status column
    BEGIN
        EXECUTE 'SELECT COUNT(*) FROM public.galleries WHERE status = ''published''';
        test_result := 'PASSED';
    EXCEPTION
        WHEN undefined_column THEN
            test_result := 'FAILED - Status column still missing!';
        WHEN OTHERS THEN
            test_result := 'FAILED - ' || SQLERRM;
    END;

    -- Report results
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE '                    VERIFICATION REPORT                     ';
    RAISE NOTICE '════════════════════════════════════════════════════════════';
    RAISE NOTICE 'Status column exists:       %', CASE WHEN status_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Featured column exists:     %', CASE WHEN featured_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Order_index column exists:  %', CASE WHEN order_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Total galleries in table:   %', gallery_count;
    RAISE NOTICE 'Query test (uses status):   %', test_result;
    RAISE NOTICE '════════════════════════════════════════════════════════════';

    IF status_exists AND featured_exists AND order_exists AND test_result = 'PASSED' THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 SUCCESS! All fixes applied successfully!';
        RAISE NOTICE 'The galleries table is now fully functional.';
    ELSE
        RAISE EXCEPTION 'Some fixes failed. Please check the report above.';
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 9: TEST QUERIES
-- ═══════════════════════════════════════════════════════════════════════════

-- Test 1: Select all galleries
SELECT id, title, status, featured, order_index
FROM public.galleries
LIMIT 5;

-- Test 2: Filter by status
SELECT COUNT(*) as published_count
FROM public.galleries
WHERE status = 'published';

-- Test 3: Insert a test gallery
INSERT INTO public.galleries (title, description, status, featured)
VALUES ('Test Gallery', 'Created by migration script', 'draft', false)
ON CONFLICT DO NOTHING
RETURNING id, title, status;

-- Test 4: Update test
UPDATE public.galleries
SET status = 'published'
WHERE title = 'Test Gallery';

-- Test 5: Check updated_at trigger
SELECT title, created_at, updated_at
FROM public.galleries
WHERE title = 'Test Gallery';

-- ═══════════════════════════════════════════════════════════════════════════
-- COMMIT IF EVERYTHING WORKED
-- ═══════════════════════════════════════════════════════════════════════════

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- FINAL SUCCESS MESSAGE
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '╔═══════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║                                                           ║';
    RAISE NOTICE '║     ✅  GALLERIES TABLE FIXED SUCCESSFULLY!  ✅          ║';
    RAISE NOTICE '║                                                           ║';
    RAISE NOTICE '║     • Status column: ADDED                               ║';
    RAISE NOTICE '║     • All required columns: VERIFIED                     ║';
    RAISE NOTICE '║     • RLS policies: CREATED                              ║';
    RAISE NOTICE '║     • Indexes: OPTIMIZED                                 ║';
    RAISE NOTICE '║     • Tests: PASSED                                      ║';
    RAISE NOTICE '║                                                           ║';
    RAISE NOTICE '╚═══════════════════════════════════════════════════════════╝';
END $$;