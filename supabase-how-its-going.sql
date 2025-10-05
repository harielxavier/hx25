-- Create "How It's Going" table in Supabase
CREATE TABLE IF NOT EXISTS how_its_going (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  couple_names TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('honeymoon', 'anniversary', 'baby', 'family', 'life', 'other')),
  location TEXT,
  caption TEXT NOT NULL,
  wedding_photo TEXT NOT NULL,
  current_photo TEXT NOT NULL,
  additional_photos TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_how_its_going_status ON how_its_going(status);
CREATE INDEX IF NOT EXISTS idx_how_its_going_featured ON how_its_going(featured);
CREATE INDEX IF NOT EXISTS idx_how_its_going_milestone ON how_its_going(milestone_type);
CREATE INDEX IF NOT EXISTS idx_how_its_going_sort ON how_its_going(sort_order DESC, submitted_at DESC);

-- Enable RLS
ALTER TABLE how_its_going ENABLE ROW LEVEL SECURITY;

-- Public can view approved submissions
CREATE POLICY "Public can view approved submissions" ON how_its_going
  FOR SELECT USING (status = 'approved');

-- Anyone can insert (for submission form)
CREATE POLICY "Anyone can submit" ON how_its_going
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can manage all
CREATE POLICY "Authenticated users can manage submissions" ON how_its_going
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('how-its-going', 'how-its-going', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view submission images" ON storage.objects
  FOR SELECT USING (bucket_id = 'how-its-going');

CREATE POLICY "Anyone can upload submission images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'how-its-going');

CREATE POLICY "Authenticated can manage submission images" ON storage.objects
  FOR ALL USING (bucket_id = 'how-its-going' AND auth.role() = 'authenticated');
