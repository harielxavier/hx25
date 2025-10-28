-- ═══════════════════════════════════════════════════════════════════════════
-- ROLLBACK SCRIPT - USE ONLY IF SOMETHING GOES WRONG
-- This preserves your data while fixing the structure
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- Step 1: Backup existing data
CREATE TEMP TABLE galleries_backup AS
SELECT * FROM public.galleries;

-- Step 2: Drop the problematic table
DROP TABLE IF EXISTS public.galleries CASCADE;

-- Step 3: Recreate with correct structure
CREATE TABLE public.galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    category TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    seo_data JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Restore data with column mapping
INSERT INTO public.galleries (
    id,
    title,
    description,
    cover_image,
    category,
    status,
    featured,
    order_index,
    tags,
    metadata,
    seo_data,
    created_by,
    created_at,
    updated_at
)
SELECT
    COALESCE(id, gen_random_uuid()),
    COALESCE(title, 'Untitled Gallery'),
    description,
    cover_image,
    category,
    COALESCE(status, 'published'),
    COALESCE(featured, false),
    COALESCE(order_index, 0),
    COALESCE(tags, '{}'),
    COALESCE(metadata, '{}'),
    COALESCE(seo_data, '{}'),
    created_by,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW())
FROM galleries_backup;

-- Step 5: Recreate related tables
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

-- Step 6: Create indexes
CREATE INDEX idx_galleries_status ON public.galleries(status);
CREATE INDEX idx_galleries_featured ON public.galleries(featured);
CREATE INDEX idx_galleries_category ON public.galleries(category);
CREATE INDEX idx_galleries_order ON public.galleries(order_index);
CREATE INDEX idx_gallery_images_gallery_id ON public.gallery_images(gallery_id);
CREATE INDEX idx_gallery_images_order ON public.gallery_images(order_index);

-- Step 7: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON public.galleries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Enable RLS and create policies
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published galleries"
    ON public.galleries
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authenticated can view all"
    ON public.galleries
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access"
    ON public.galleries
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- Step 9: Verify
DO $$
DECLARE
    row_count INTEGER;
    status_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO row_count FROM public.galleries;
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries' AND column_name = 'status'
    ) INTO status_exists;

    RAISE NOTICE '════════════════════════════════════════════';
    RAISE NOTICE 'ROLLBACK COMPLETE:';
    RAISE NOTICE '  • Rows restored: %', row_count;
    RAISE NOTICE '  • Status column: %', CASE WHEN status_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '════════════════════════════════════════════';
END $$;

COMMIT;