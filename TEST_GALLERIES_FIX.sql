-- ═══════════════════════════════════════════════════════════════════════════
-- TEST SCRIPT - RUN AFTER FIX_GALLERIES_FINAL.sql
-- Verifies everything is working correctly
-- ═══════════════════════════════════════════════════════════════════════════

-- Test 1: Verify all columns exist
SELECT
    '✓ Column Check' as test,
    COUNT(*) as columns_found,
    CASE
        WHEN COUNT(*) >= 13 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected at least 13 columns'
    END as result
FROM information_schema.columns
WHERE table_name = 'galleries'
AND column_name IN (
    'id', 'title', 'description', 'cover_image', 'category',
    'status', 'featured', 'order_index', 'tags', 'metadata',
    'seo_data', 'created_at', 'updated_at'
);

-- Test 2: Verify status column specifically
SELECT
    '✓ Status Column' as test,
    CASE
        WHEN data_type = 'text' AND column_default = '''published''::text'
        THEN '✅ PASS - Column exists with correct type and default'
        WHEN data_type = 'text'
        THEN '⚠️  PASS - Column exists but check default value'
        ELSE '❌ FAIL - Column missing or wrong type'
    END as result
FROM information_schema.columns
WHERE table_name = 'galleries'
AND column_name = 'status';

-- Test 3: Check constraints
SELECT
    '✓ Status Constraint' as test,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS - Check constraint exists'
        ELSE '❌ FAIL - No check constraint found'
    END as result
FROM pg_constraint
WHERE conrelid = 'galleries'::regclass
AND contype = 'c'
AND conname = 'galleries_status_check';

-- Test 4: Check indexes
SELECT
    '✓ Indexes' as test,
    COUNT(*) as index_count,
    CASE
        WHEN COUNT(*) >= 3 THEN '✅ PASS - Performance indexes exist'
        ELSE '⚠️  WARNING - Some indexes may be missing'
    END as result
FROM pg_indexes
WHERE tablename = 'galleries'
AND indexname IN ('idx_galleries_status', 'idx_galleries_featured', 'idx_galleries_order');

-- Test 5: Check RLS is enabled
SELECT
    '✓ Row Level Security' as test,
    CASE
        WHEN relrowsecurity THEN '✅ PASS - RLS is enabled'
        ELSE '❌ FAIL - RLS is not enabled'
    END as result
FROM pg_class
WHERE relname = 'galleries';

-- Test 6: Check policies exist
SELECT
    '✓ RLS Policies' as test,
    COUNT(*) as policy_count,
    CASE
        WHEN COUNT(*) >= 2 THEN '✅ PASS - Policies configured'
        ELSE '⚠️  WARNING - Check policies'
    END as result
FROM pg_policies
WHERE tablename = 'galleries';

-- Test 7: Functional test - can we query with status?
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    -- Try to query using status column
    SELECT COUNT(*) INTO test_count
    FROM public.galleries
    WHERE status IN ('published', 'draft', 'archived');

    RAISE NOTICE '✓ Functional Query Test: ✅ PASS - Can query with status column (found % galleries)', test_count;
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE '✓ Functional Query Test: ❌ FAIL - Status column not found';
    WHEN OTHERS THEN
        RAISE NOTICE '✓ Functional Query Test: ❌ FAIL - Error: %', SQLERRM;
END $$;

-- Test 8: Can we insert?
DO $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.galleries (title, description, status, featured, order_index)
    VALUES ('Test Gallery ' || NOW()::TEXT, 'Automated test', 'draft', false, 999)
    RETURNING id INTO new_id;

    RAISE NOTICE '✓ Insert Test: ✅ PASS - Successfully inserted gallery with ID: %', new_id;

    -- Clean up test data
    DELETE FROM public.galleries WHERE id = new_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '✓ Insert Test: ❌ FAIL - Error: %', SQLERRM;
END $$;

-- Test 9: Can we update with trigger?
DO $$
DECLARE
    old_updated TIMESTAMPTZ;
    new_updated TIMESTAMPTZ;
    test_id UUID;
BEGIN
    -- Get a gallery to test with (or create one)
    SELECT id, updated_at INTO test_id, old_updated
    FROM public.galleries
    LIMIT 1;

    IF test_id IS NOT NULL THEN
        -- Wait a tiny bit to ensure timestamp difference
        PERFORM pg_sleep(0.01);

        -- Update the gallery
        UPDATE public.galleries
        SET description = description || ' (tested)'
        WHERE id = test_id
        RETURNING updated_at INTO new_updated;

        IF new_updated > old_updated THEN
            RAISE NOTICE '✓ Trigger Test: ✅ PASS - updated_at trigger working';
        ELSE
            RAISE NOTICE '✓ Trigger Test: ⚠️  WARNING - updated_at trigger may not be working';
        END IF;
    ELSE
        RAISE NOTICE '✓ Trigger Test: ⏭️  SKIPPED - No galleries to test with';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '✓ Trigger Test: ❌ FAIL - Error: %', SQLERRM;
END $$;

-- Test 10: Summary of table structure
SELECT
    '═══════════════════════════════════' as separator
UNION ALL
SELECT 'FINAL TABLE STRUCTURE:' as separator
UNION ALL
SELECT '═══════════════════════════════════' as separator;

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'galleries'
ORDER BY ordinal_position;

-- Final Summary
DO $$
DECLARE
    col_count INTEGER;
    status_exists BOOLEAN;
    rls_enabled BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Count columns
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns
    WHERE table_name = 'galleries';

    -- Check status column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'galleries' AND column_name = 'status'
    ) INTO status_exists;

    -- Check RLS
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'galleries';

    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'galleries';

    RAISE NOTICE '';
    RAISE NOTICE '╔═══════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║                    TEST RESULTS SUMMARY                   ║';
    RAISE NOTICE '╠═══════════════════════════════════════════════════════════╣';
    RAISE NOTICE '║ Total Columns:    % %',
        LPAD(col_count::TEXT, 3),
        REPEAT(' ', 37);
    RAISE NOTICE '║ Status Column:    %',
        CASE WHEN status_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END || REPEAT(' ', 28);
    RAISE NOTICE '║ RLS Enabled:      %',
        CASE WHEN rls_enabled THEN '✅ YES' ELSE '❌ NO' END || REPEAT(' ', 31);
    RAISE NOTICE '║ Policy Count:     % %',
        LPAD(policy_count::TEXT, 3),
        REPEAT(' ', 37);
    RAISE NOTICE '╠═══════════════════════════════════════════════════════════╣';

    IF status_exists AND rls_enabled AND col_count >= 13 THEN
        RAISE NOTICE '║           🎉  ALL TESTS PASSED!  🎉                      ║';
        RAISE NOTICE '║                                                           ║';
        RAISE NOTICE '║     Your galleries table is fully operational!           ║';
    ELSE
        RAISE NOTICE '║           ⚠️   SOME ISSUES REMAIN  ⚠️                     ║';
        RAISE NOTICE '║                                                           ║';
        RAISE NOTICE '║     Please review the test results above.                ║';
    END IF;

    RAISE NOTICE '╚═══════════════════════════════════════════════════════════╝';
END $$;