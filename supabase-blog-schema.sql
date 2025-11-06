-- Create posts table for blog
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT DEFAULT 'Uncategorized',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT FALSE,
  author JSONB DEFAULT '{"name": "Hariel Xavier", "avatar": "/images/author.jpg"}'::jsonb,
  views INTEGER DEFAULT 0,
  read_time TEXT,
  video_embed TEXT,
  share_enabled BOOLEAN DEFAULT TRUE,
  comments_enabled BOOLEAN DEFAULT TRUE
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Create index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- Create index on featured for filtering
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = TRUE;

-- Create function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published posts
CREATE POLICY "Public can view published posts"
  ON posts
  FOR SELECT
  USING (status = 'published');

-- Create policy for authenticated users to manage posts (admin only)
CREATE POLICY "Authenticated users can manage posts"
  ON posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample blog post (optional)
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  category,
  tags,
  status,
  published_at,
  featured,
  read_time
) VALUES (
  'Welcome to Our Wedding Photography Blog',
  'welcome-to-our-blog',
  'Discover tips, inspiration, and stories from New Jersey weddings',
  '<h2>Welcome!</h2><p>We''re excited to share our wedding photography insights with you. Stay tuned for more content about New Jersey wedding venues, photography tips, and real wedding stories.</p>',
  '/images/blog/welcome.jpg',
  'Wedding Tips',
  ARRAY['weddings', 'photography', 'new jersey'],
  'published',
  NOW(),
  TRUE,
  '2 min read'
) ON CONFLICT (slug) DO NOTHING;














