-- ================================================
-- SUPABASE ANALYTICS SCHEMA
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- This creates all necessary tables for analytics tracking

-- 1. Create analytics_sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  session_id TEXT PRIMARY KEY,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page TEXT,
  page_views INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create analytics_page_views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES analytics_sessions(session_id),
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_url TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  exit_at TIMESTAMPTZ,
  load_time_ms INTEGER,
  time_on_page_seconds INTEGER,
  scroll_depth_percent INTEGER,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES analytics_sessions(session_id),
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value NUMERIC,
  page_path TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX idx_analytics_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX idx_analytics_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX idx_analytics_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX idx_analytics_page_views_viewed_at ON analytics_page_views(viewed_at);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);

-- 5. Create the increment RPC function
CREATE OR REPLACE FUNCTION increment(
  table_name TEXT,
  row_id TEXT,
  column_name TEXT,
  increment_value INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  -- Dynamic SQL to increment a column value
  EXECUTE format(
    'UPDATE %I SET %I = COALESCE(%I, 0) + $1 WHERE session_id = $2',
    table_name, column_name, column_name
  ) USING increment_value, row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies (allow inserts from anonymous users, reads for authenticated)
-- Allow anonymous users to insert analytics data
CREATE POLICY "Enable insert for all users" ON analytics_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON analytics_page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow updates for existing sessions
CREATE POLICY "Enable update for all users" ON analytics_sessions
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON analytics_page_views
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read analytics
CREATE POLICY "Enable read for authenticated users" ON analytics_sessions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users" ON analytics_page_views
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);

-- 8. Grant permissions to functions
GRANT EXECUTE ON FUNCTION increment TO anon, authenticated;

-- ================================================
-- OPTIONAL: Clean up test data
-- ================================================
-- If you want to clear any test data, uncomment these:
-- TRUNCATE analytics_sessions CASCADE;
-- TRUNCATE analytics_page_views CASCADE;
-- TRUNCATE analytics_events CASCADE;