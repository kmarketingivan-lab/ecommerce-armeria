-- ============================================
-- Migration 0010: site_settings
-- ============================================

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Admin can update settings
CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can insert settings
CREATE POLICY "Admin can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Nobody can delete settings
-- (No DELETE policy = denied by default with RLS enabled)

-- ============================================
-- Seed default settings
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"My Ecommerce"'),
  ('site_description', '"Il tuo negozio online di fiducia"'),
  ('contact_email', '"info@myecommerce.it"'),
  ('contact_phone', '"+39 02 1234567"'),
  ('address', '{"street": "Via Roma 1", "city": "Milano", "zip": "20121", "country": "IT"}'),
  ('social_links', '{"facebook": "", "instagram": "", "twitter": ""}'),
  ('business_hours', '{"mon_fri": "09:00-18:00", "sat": "09:00-13:00", "sun": "chiuso"}'),
  ('currency', '"EUR"'),
  ('tax_rate', '22');
