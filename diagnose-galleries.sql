-- ═══════════════════════════════════════════════════════════════════════════
-- DIAGNOSTIC SCRIPT - Find out what's wrong with galleries table
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. CHECK IF GALLERIES TABLE EXISTS AND IN WHICH SCHEMA
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE tablename = 'galleries';

-- 2. GET FULL COLUMN LIST FOR GALLERIES TABLE
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'galleries'
ORDER BY ordinal_position;

-- 3. CHECK IF THERE ARE ANY VIEWS NAMED GALLERIES
SELECT
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE viewname = 'galleries';

-- 4. CHECK FOR ANY EXISTING RLS POLICIES
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'galleries';

-- 5. CHECK TABLE CONSTRAINTS
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'galleries'::regclass;

-- 6. CHECK IF TABLE IS PARTITIONED
SELECT
    relname,
    relkind,
    relispartition
FROM pg_class
WHERE relname = 'galleries';

-- 7. CHECK FOR TRIGGERS ON THE TABLE
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'galleries';

-- 8. CHECK CURRENT USER PERMISSIONS
SELECT
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'galleries';

-- 9. TRY TO SELECT FROM GALLERIES (see what error we get)
SELECT COUNT(*) FROM public.galleries;

-- 10. CHECK IF STATUS COLUMN EXISTS SPECIFICALLY
SELECT
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'galleries'
            AND column_name = 'status'
        )
        THEN 'STATUS COLUMN EXISTS'
        ELSE 'STATUS COLUMN DOES NOT EXIST - THIS IS THE PROBLEM!'
    END AS status_check;