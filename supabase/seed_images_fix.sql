-- ============================================================
-- UPDATE IMMAGINI: sostituisce con foto reali di armi/prodotti
-- Eseguire su Supabase: SQL Editor → Run
-- ============================================================

-- Svuota le immagini precedenti
DELETE FROM product_images WHERE product_id IN (
  SELECT id FROM products WHERE slug IN (
    'glock-17-gen5-9mm','beretta-92fs-9mm','sig-sauer-p226-legion',
    'sw-686-357-magnum','browning-maxus-ii-sporting','benelli-m2-field-12-76',
    'tikka-t3x-hunter-308','marlin-1894-44-magnum','federal-9mm-124gr-fmj-50',
    'winchester-308-168gr-bthp-20','fiocchi-12-70-28gr-n75-25',
    'remington-357-158gr-jsp-50','leupold-vx3hd-3-9x40','safariland-6378-glock17',
    'hoppes-kit-pulizia-universale','magpul-moe-calcio-ar15',
    'assortimento-f2-festa-grande','batteria-100-colpi-f2',
    'benchmade-griptilian-551','buck-119-special'
  )
);

-- PISTOLE
-- Glock 17: Glock 45 su sfondo grigio (Jay Rembert)
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80', 'Glock 17 Gen5 9mm', 0, true FROM products WHERE slug = 'glock-17-gen5-9mm';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80', 'Glock 17 con munizioni 9mm', 1, false FROM products WHERE slug = 'glock-17-gen5-9mm';

-- Beretta 92FS: pistola semi-automatica in mano
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1563197165-3b7e9f5bccc9?w=800&q=80', 'Beretta 92FS 9mm', 0, true FROM products WHERE slug = 'beretta-92fs-9mm';

-- Sig Sauer P226: pistola nera
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80', 'Sig Sauer P226 Legion', 0, true FROM products WHERE slug = 'sig-sauer-p226-legion';

-- S&W 686 revolver
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1609592806596-b9b4bfc27c7a?w=800&q=80', 'Smith & Wesson 686 .357 Magnum', 0, true FROM products WHERE slug = 'sw-686-357-magnum';

-- FUCILI
-- Browning Maxus: fucile semiautomatico
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&q=80', 'Browning Maxus II Sporting 12/76', 0, true FROM products WHERE slug = 'browning-maxus-ii-sporting';

-- Benelli M2: fucile caccia
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', 'Benelli M2 Field 12/76', 0, true FROM products WHERE slug = 'benelli-m2-field-12-76';

-- Tikka T3x: bolt action rifle con ottica
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1600783245777-080fd7ff9253?w=800&q=80', 'Tikka T3x Hunter .308 Win', 0, true FROM products WHERE slug = 'tikka-t3x-hunter-308';

-- Marlin 1894: carabina a leva
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1630167068956-7628b2ff0c74?w=800&q=80', 'Marlin 1894 .44 Magnum', 0, true FROM products WHERE slug = 'marlin-1894-44-magnum';

-- MUNIZIONI
-- Federal 9mm: cartucce 9mm
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80', 'Munizioni Federal 9mm 124gr FMJ', 0, true FROM products WHERE slug = 'federal-9mm-124gr-fmj-50';

-- Winchester .308: cartucce fucile
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1616431101491-554a8b09e73e?w=800&q=80', 'Winchester .308 Win 168gr BTHP', 0, true FROM products WHERE slug = 'winchester-308-168gr-bthp-20';

-- Fiocchi 12/70: cartucce fucile da caccia
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1550411294-e0cc4e5f0e89?w=800&q=80', 'Fiocchi 12/70 28gr N.7.5', 0, true FROM products WHERE slug = 'fiocchi-12-70-28gr-n75-25';

-- Remington .357: cartucce revolver
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', 'Remington .357 Magnum 158gr', 0, true FROM products WHERE slug = 'remington-357-158gr-jsp-50';

-- ACCESSORI
-- Leupold: cannocchiale da puntamento
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=800&q=80', 'Leupold VX-3HD 3-9x40', 0, true FROM products WHERE slug = 'leupold-vx3hd-3-9x40';

-- Safariland: fondina
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80', 'Fondina Safariland 6378 Glock 17', 0, true FROM products WHERE slug = 'safariland-6378-glock17';

-- Hoppe's: kit pulizia
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Kit pulizia Hoppe No.9', 0, true FROM products WHERE slug = 'hoppes-kit-pulizia-universale';

-- Magpul: calcio fucile
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1630077510397-2bbfe2e4c26d?w=800&q=80', 'Calcio regolabile Magpul MOE AR-15', 0, true FROM products WHERE slug = 'magpul-moe-calcio-ar15';

-- FUOCHI ARTIFICIALI
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80', 'Fuochi artificiali F2 colorati', 0, true FROM products WHERE slug = 'assortimento-f2-festa-grande';
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=800&q=80', 'Fuochi artificiali notturni', 1, false FROM products WHERE slug = 'assortimento-f2-festa-grande';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', 'Batteria 100 colpi spettacolo', 0, true FROM products WHERE slug = 'batteria-100-colpi-f2';

-- COLTELLI
-- Benchmade Griptilian: coltello pieghevole
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1536244881392-e054e3f87bdc?w=800&q=80', 'Benchmade Griptilian 551', 0, true FROM products WHERE slug = 'benchmade-griptilian-551';

-- Buck 119: coltello fisso da caccia
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', 'Buck 119 Special coltello caccia', 0, true FROM products WHERE slug = 'buck-119-special';
