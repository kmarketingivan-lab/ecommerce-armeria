-- ============================================
-- Migration 0011: media
-- ============================================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  folder TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_media_folder ON media(folder);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public can read media
CREATE POLICY "Public can view media"
  ON media FOR SELECT
  USING (true);

-- Admin can insert media
CREATE POLICY "Admin can insert media"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can delete media
CREATE POLICY "Admin can delete media"
  ON media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
