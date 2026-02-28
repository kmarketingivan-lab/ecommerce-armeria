-- ============================================
-- Migration 0004: product_images
-- ============================================

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public can read product images
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

-- Admin can insert product images
CREATE POLICY "Admin can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can update product images
CREATE POLICY "Admin can update product images"
  ON product_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can delete product images
CREATE POLICY "Admin can delete product images"
  ON product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
