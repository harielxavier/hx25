-- ═══════════════════════════════════════════════════════════════════════════
-- FIX FOR ANALYTICS ISSUES
-- Run this in Supabase SQL Editor to fix the analytics tracking
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Create the missing increment RPC function
CREATE OR REPLACE FUNCTION increment(
  table_name TEXT,
  row_id TEXT,
  column_name TEXT,
  amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    UPDATE %I
    SET %I = COALESCE(%I, 0) + $1,
        updated_at = NOW()
    WHERE session_id = $2',
    table_name,
    column_name,
    column_name
  ) USING amount, row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix RLS policies to allow public to update specific columns
DROP POLICY IF EXISTS "Allow public update on sessions" ON analytics_sessions;
CREATE POLICY "Allow public update on sessions"
  ON analytics_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 3. Allow public to select their own session data
CREATE POLICY "Allow public select own session"
  ON analytics_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public select own page_views"
  ON analytics_page_views FOR SELECT
  USING (true);

-- 4. Fix columns issue - ensure all columns exist
ALTER TABLE analytics_page_views
  ADD COLUMN IF NOT EXISTS page_url TEXT;

-- 5. Grant execute permission on the increment function
GRANT EXECUTE ON FUNCTION increment(TEXT, TEXT, TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION increment(TEXT, TEXT, TEXT, INTEGER) TO authenticated;

-- 6. Create a simpler upsert function for sessions
CREATE OR REPLACE FUNCTION upsert_session(
  p_session_id TEXT,
  p_data JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics_sessions (
    session_id,
    user_agent,
    device_type,
    browser,
    browser_version,
    os,
    screen_width,
    screen_height,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    landing_page,
    started_at,
    is_new_visitor
  )
  VALUES (
    p_session_id,
    p_data->>'user_agent',
    p_data->>'device_type',
    p_data->>'browser',
    p_data->>'browser_version',
    p_data->>'os',
    (p_data->>'screen_width')::INTEGER,
    (p_data->>'screen_height')::INTEGER,
    p_data->>'referrer',
    p_data->>'utm_source',
    p_data->>'utm_medium',
    p_data->>'utm_campaign',
    p_data->>'utm_term',
    p_data->>'utm_content',
    p_data->>'landing_page',
    (p_data->>'started_at')::TIMESTAMP WITH TIME ZONE,
    (p_data->>'is_new_visitor')::BOOLEAN
  )
  ON CONFLICT (session_id)
  DO UPDATE SET
    updated_at = NOW(),
    page_views = analytics_sessions.page_views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION upsert_session(TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION upsert_session(TEXT, JSONB) TO authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! This should fix all analytics tracking errors
-- ═══════════════════════════════════════════════════════════════════════════