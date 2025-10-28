-- ═══════════════════════════════════════════════════════════════════════════
-- STEP-BY-STEP FIX FOR GALLERIES TABLE
-- Run each step separately if needed
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 1: ADD MISSING COLUMNS TO GALLERIES TABLE
-- ═══════════════════════════════════════════════════════════════════════════

-- First, let's check what columns exist in your galleries table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'galleries'
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 2: ADD STATUS COLUMN (Run this FIRST before any policies)
-- ═══════════════════════════════════════════════════════════════════════════

-- Add status column if it doesn't exist
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Verify it was added
SELECT column_name FROM information_schema.columns
WHERE table_name = 'galleries' AND column_name = 'status';

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 3: ADD OTHER MISSING COLUMNS
-- ═══════════════════════════════════════════════════════════════════════════

-- Add featured column
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add order_index column
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add tags column (array type)
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add metadata column (JSONB type)
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add seo_data column (JSONB type)
ALTER TABLE public.galleries
ADD COLUMN IF NOT EXISTS seo_data JSONB DEFAULT '{}';

-- Add created_by column (UUID type) - only if users table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE public.galleries
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);
    ELSE
        ALTER TABLE public.galleries
        ADD COLUMN IF NOT EXISTS created_by UUID;
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 4: UPDATE EXISTING ROWS (if any)
-- ═══════════════════════════════════════════════════════════════════════════

-- Set default status for any existing rows that might have NULL
UPDATE public.galleries
SET status = 'published'
WHERE status IS NULL;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 5: ADD CHECK CONSTRAINT FOR STATUS
-- ═══════════════════════════════════════════════════════════════════════════

-- Add constraint to ensure status values are valid
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE public.galleries
    DROP CONSTRAINT IF EXISTS galleries_status_check;

    -- Add new constraint
    ALTER TABLE public.galleries
    ADD CONSTRAINT galleries_status_check
    CHECK (status IN ('draft', 'published', 'archived'));
EXCEPTION
    WHEN others THEN
        -- If constraint fails, it means there are invalid values
        -- Update them first
        UPDATE public.galleries
        SET status = 'published'
        WHERE status NOT IN ('draft', 'published', 'archived');

        -- Try again
        ALTER TABLE public.galleries
        ADD CONSTRAINT galleries_status_check
        CHECK (status IN ('draft', 'published', 'archived'));
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 6: VERIFY ALL COLUMNS EXIST
-- ═══════════════════════════════════════════════════════════════════════════

-- Check that all columns now exist
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'galleries'
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 7: NOW CREATE RLS POLICIES (Only after columns exist!)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS if not already enabled
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can view published galleries" ON public.galleries;
DROP POLICY IF EXISTS "Admins can manage galleries" ON public.galleries;
DROP POLICY IF EXISTS "Public read galleries" ON public.galleries;

-- Create new policies with proper status check
-- Policy 1: Public can view published galleries
CREATE POLICY "Public can view published galleries"
ON public.galleries
FOR SELECT
USING (
    status = 'published'
    OR status IS NULL  -- Handle legacy data
    OR NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries'
        AND column_name = 'status'
    )
);

-- Policy 2: Admins can do everything
CREATE POLICY "Admins can manage all galleries"
ON public.galleries
FOR ALL
USING (
    -- Check if user is admin
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role = 'admin'
    )
    OR
    -- Or if auth is not set up yet (development)
    auth.uid() IS NULL
);

-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 8: CREATE INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_galleries_status ON public.galleries(status);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON public.galleries(featured);
CREATE INDEX IF NOT EXISTS idx_galleries_order ON public.galleries(order_index);

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION: Run this to confirm everything is set up correctly
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
    status_exists BOOLEAN;
    featured_exists BOOLEAN;
    order_exists BOOLEAN;
BEGIN
    -- Check if columns exist
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

    -- Report results
    IF status_exists AND featured_exists AND order_exists THEN
        RAISE NOTICE '✅ SUCCESS: All required columns exist in galleries table!';
        RAISE NOTICE '   - status column: EXISTS';
        RAISE NOTICE '   - featured column: EXISTS';
        RAISE NOTICE '   - order_index column: EXISTS';
    ELSE
        RAISE WARNING '❌ ERROR: Some columns are still missing!';
        IF NOT status_exists THEN
            RAISE WARNING '   - status column: MISSING';
        END IF;
        IF NOT featured_exists THEN
            RAISE WARNING '   - featured column: MISSING';
        END IF;
        IF NOT order_exists THEN
            RAISE WARNING '   - order_index column: MISSING';
        END IF;
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- TROUBLESHOOTING SECTION
-- ═══════════════════════════════════════════════════════════════════════════

/*
If you're still getting errors, try these commands one at a time:

1. First, disable RLS temporarily:
   ALTER TABLE public.galleries DISABLE ROW LEVEL SECURITY;

2. Add the status column directly:
   ALTER TABLE public.galleries ADD COLUMN status TEXT DEFAULT 'published';

3. If that fails, check if the table is locked:
   SELECT * FROM pg_locks WHERE relation = 'galleries'::regclass;

4. If the column already exists but with wrong type:
   ALTER TABLE public.galleries ALTER COLUMN status TYPE TEXT USING status::TEXT;

5. To see the exact table structure:
   \d+ galleries

6. To completely reset (CAREFUL - this drops data!):
   DROP TABLE IF EXISTS public.galleries CASCADE;
   Then recreate with the full schema.
*/