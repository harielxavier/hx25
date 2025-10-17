-- Web Analytics Table
-- Run this SQL in your Supabase SQL Editor

-- Drop existing table if you want to start fresh
-- DROP TABLE IF EXISTS web_hits;

-- Create the web_hits table
CREATE TABLE IF NOT EXISTS web_hits (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip TEXT NOT NULL,
  ua TEXT,
  path TEXT,
  ref TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS web_hits_ts_idx ON web_hits (ts DESC);
CREATE INDEX IF NOT EXISTS web_hits_path_idx ON web_hits (path);
CREATE INDEX IF NOT EXISTS web_hits_ip_idx ON web_hits (ip);
CREATE INDEX IF NOT EXISTS web_hits_session_idx ON web_hits (session_id);

-- Analytics views for easy querying

-- Daily unique visitors and page views
CREATE OR REPLACE VIEW analytics_daily AS
SELECT
  DATE(ts) as date,
  COUNT(DISTINCT ip) as unique_visitors,
  COUNT(*) as page_views,
  COUNT(DISTINCT session_id) as sessions
FROM web_hits
GROUP BY DATE(ts)
ORDER BY date DESC;

-- Top pages by views
CREATE OR REPLACE VIEW analytics_top_pages AS
SELECT
  path,
  COUNT(*) as views,
  COUNT(DISTINCT ip) as unique_visitors,
  COUNT(DISTINCT session_id) as sessions
FROM web_hits
WHERE path IS NOT NULL
GROUP BY path
ORDER BY views DESC
LIMIT 50;

-- Top referrers
CREATE OR REPLACE VIEW analytics_top_referrers AS
SELECT
  COALESCE(
    CASE
      WHEN ref = '' OR ref IS NULL THEN 'Direct'
      ELSE ref
    END
  ) as referrer,
  COUNT(*) as visits,
  COUNT(DISTINCT ip) as unique_visitors
FROM web_hits
GROUP BY referrer
ORDER BY visits DESC
LIMIT 50;

-- Recent visitors (last 100)
CREATE OR REPLACE VIEW analytics_recent_visitors AS
SELECT
  id,
  ts,
  ip,
  ua,
  path,
  ref,
  session_id
FROM web_hits
ORDER BY ts DESC
LIMIT 100;

-- Traffic by hour of day
CREATE OR REPLACE VIEW analytics_hourly_traffic AS
SELECT
  EXTRACT(HOUR FROM ts) as hour,
  COUNT(*) as hits,
  COUNT(DISTINCT ip) as unique_visitors
FROM web_hits
WHERE ts >= NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour;

COMMENT ON TABLE web_hits IS 'Web traffic analytics captured from Netlify Edge Functions';
