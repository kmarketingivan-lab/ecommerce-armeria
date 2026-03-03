-- Hero slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL DEFAULT '',
  subtitle    text NOT NULL DEFAULT '',
  cta_label   text NOT NULL DEFAULT 'Scopri di più',
  cta_href    text NOT NULL DEFAULT '/products',
  image_url   text,
  sort_order  int  NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hero_slides"
  ON hero_slides FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage hero_slides"
  ON hero_slides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Seed with 3 default slides
INSERT INTO hero_slides (title, subtitle, cta_label, cta_href, image_url, sort_order, is_active)
VALUES
  ('Qualità dal 1985', 'Scopri la nostra selezione di prodotti di alta qualità, scelti con cura per te.', 'Sfoglia il catalogo', '/products', '/images/hero-1.jpg', 0, true),
  ('Nuovi arrivi', 'Le ultime novità sono arrivate! Scopri i nuovi prodotti appena aggiunti.', 'Scopri le novità', '/products?sort=created_at&order=desc', '/images/hero-2.jpg', 1, true),
  ('Prenota un appuntamento', 'Vieni a trovarci in negozio. Prenota il tuo appuntamento online.', 'Prenota ora', '/bookings', '/images/hero-3.jpg', 2, true);
