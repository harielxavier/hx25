-- ═══════════════════════════════════════════════════════════════════════════
-- COMPREHENSIVE ANALYTICS SCHEMA FOR HARIEL XAVIER PHOTOGRAPHY
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- This schema captures ALL website analytics in Supabase
-- You'll see: traffic, sessions, time on page, devices, locations, etc.
-- ALL IN ONE DASHBOARD!
--
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE 1: Sessions (Visitor Sessions)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  
  -- Device & Browser
  user_agent TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Geographic Data
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Traffic Source
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page TEXT,
  
  -- Session Metrics
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  is_bounce BOOLEAN DEFAULT false,
  is_new_visitor BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON analytics_sessions(country);
CREATE INDEX IF NOT EXISTS idx_sessions_device_type ON analytics_sessions(device_type);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_source ON analytics_sessions(utm_source);


-- ─────────────────────────────────────────────────────────────────────────
-- TABLE 2: Page Views
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  
  -- Page Data
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_url TEXT,
  
  -- Engagement Metrics
  time_on_page_seconds INTEGER DEFAULT 0,
  scroll_depth_percent INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  
  -- Performance
  load_time_ms INTEGER,
  
  -- Timestamps
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON analytics_page_views(viewed_at DESC);


-- ─────────────────────────────────────────────────────────────────────────
-- TABLE 3: Events (Conversions & Actions)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  
  -- Event Data
  event_type TEXT NOT NULL, -- 'contact_form', 'booking', 'gallery_view', etc.
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value DECIMAL,
  
  -- Event Details
  page_path TEXT,
  event_data JSONB,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at DESC);


-- ─────────────────────────────────────────────────────────────────────────
-- FUNCTIONS: Helper Functions
-- ─────────────────────────────────────────────────────────────────────────

-- Function to get real-time active users (last 5 minutes)
CREATE OR REPLACE FUNCTION get_active_users()
RETURNS TABLE (
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(DISTINCT session_id)::BIGINT
  FROM analytics_page_views
  WHERE viewed_at > NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to get today's stats
CREATE OR REPLACE FUNCTION get_today_stats()
RETURNS TABLE (
  total_visitors BIGINT,
  total_page_views BIGINT,
  avg_duration DECIMAL,
  bounce_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT s.session_id)::BIGINT as total_visitors,
    COUNT(pv.id)::BIGINT as total_page_views,
    ROUND(AVG(s.duration_seconds), 2) as avg_duration,
    ROUND((COUNT(CASE WHEN s.is_bounce THEN 1 END)::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100, 2) as bounce_rate
  FROM analytics_sessions s
  LEFT JOIN analytics_page_views pv ON s.session_id = pv.session_id
  WHERE DATE(s.started_at) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get top pages (today)
CREATE OR REPLACE FUNCTION get_top_pages(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  page_path TEXT,
  views BIGINT,
  avg_time_seconds DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_path,
    COUNT(*)::BIGINT as views,
    ROUND(AVG(pv.time_on_page_seconds), 2) as avg_time_seconds
  FROM analytics_page_views pv
  WHERE DATE(pv.viewed_at) = CURRENT_DATE
  GROUP BY pv.page_path
  ORDER BY views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get traffic sources (today)
CREATE OR REPLACE FUNCTION get_traffic_sources()
RETURNS TABLE (
  source TEXT,
  visitors BIGINT,
  percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH source_counts AS (
    SELECT 
      COALESCE(utm_source, 'Direct') as source,
      COUNT(*)::BIGINT as count
    FROM analytics_sessions
    WHERE DATE(started_at) = CURRENT_DATE
    GROUP BY COALESCE(utm_source, 'Direct')
  ),
  total AS (
    SELECT SUM(count)::DECIMAL as total_count FROM source_counts
  )
  SELECT 
    sc.source,
    sc.count as visitors,
    ROUND((sc.count::DECIMAL / t.total_count) * 100, 2) as percentage
  FROM source_counts sc
  CROSS JOIN total t
  ORDER BY sc.count DESC;
END;
$$ LANGUAGE plpgsql;


-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for tracking)
CREATE POLICY "Allow public insert on sessions"
  ON analytics_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on page_views"
  ON analytics_page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Allow public to update sessions (for duration updates)
CREATE POLICY "Allow public update on sessions"
  ON analytics_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all data
CREATE POLICY "Allow authenticated read on sessions"
  ON analytics_sessions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on page_views"
  ON analytics_page_views FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on events"
  ON analytics_events FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────
-- AUTO-UPDATE TRIGGER
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON analytics_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_sessions_updated_at();


-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! Run this SQL in Supabase SQL Editor
-- Then visit /admin/dashboard to see your analytics!
-- ═══════════════════════════════════════════════════════════════════════════

