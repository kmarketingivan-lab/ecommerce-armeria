-- ============================================
-- SEED: Armeria Palmetto — Dati dimostrativi
-- ============================================

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"Armeria Palmetto"'),
  ('site_description', '"La miglior armeria di Brescia. Vendita armi, munizioni, fuochi artificiali e accessori."'),
  ('contact_email', '"info@palmetto.it"'),
  ('contact_phone', '"030 370 0800"'),
  ('address', '{"street": "Via Guglielmo Oberdan, 70", "city": "Brescia", "zip": "25128", "province": "BS", "country": "Italia"}'),
  ('social_links', '{"facebook": "https://facebook.com/armeriapalmetto", "instagram": "https://instagram.com/armeriapalmetto"}'),
  ('business_hours', '{"mon": "9:00-12:30, 15:00-19:00", "tue": "9:00-12:30, 15:00-19:00", "wed": "9:00-12:30, 15:00-19:00", "thu": "9:00-12:30, 15:00-19:00", "fri": "9:00-12:30, 15:00-19:00", "sat": "9:00-12:30", "sun": "Chiuso"}'),
  ('currency', '"EUR"'),
  ('tax_rate', '22')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, image_url, parent_id, sort_order, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Armi da Fuoco', 'armi-da-fuoco', 'Pistole, fucili, carabine delle migliori marche', 'https://placehold.co/400x300/1a1a1a/ffffff?text=Armi+da+Fuoco', NULL, 1, true),
  ('a0000000-0000-0000-0000-000000000002', 'Pistole', 'pistole', 'Pistole semiautomatiche e revolver', 'https://placehold.co/400x300/c62828/ffffff?text=Pistole', 'a0000000-0000-0000-0000-000000000001', 1, true),
  ('a0000000-0000-0000-0000-000000000003', 'Fucili', 'fucili', 'Fucili da caccia, tiro sportivo e difesa', 'https://placehold.co/400x300/c62828/ffffff?text=Fucili', 'a0000000-0000-0000-0000-000000000001', 2, true),
  ('a0000000-0000-0000-0000-000000000004', 'Carabine', 'carabine', 'Carabine a leva, bolt action e semiautomatiche', 'https://placehold.co/400x300/c62828/ffffff?text=Carabine', 'a0000000-0000-0000-0000-000000000001', 3, true),
  ('a0000000-0000-0000-0000-000000000005', 'Munizioni', 'munizioni', 'Munizioni per ogni calibro e utilizzo', 'https://placehold.co/400x300/1a1a1a/ffffff?text=Munizioni', NULL, 2, true),
  ('a0000000-0000-0000-0000-000000000006', 'Munizioni Pistola', 'munizioni-pistola', 'Calibri 9mm, .45 ACP, .40 S&W e altri', 'https://placehold.co/400x300/d4a017/1a1a1a?text=Mun.+Pistola', 'a0000000-0000-0000-0000-000000000005', 1, true),
  ('a0000000-0000-0000-0000-000000000007', 'Munizioni Fucile', 'munizioni-fucile', 'Calibri .308, .223, 12 gauge e altri', 'https://placehold.co/400x300/d4a017/1a1a1a?text=Mun.+Fucile', 'a0000000-0000-0000-0000-000000000005', 2, true),
  ('a0000000-0000-0000-0000-000000000008', 'Fuochi Artificiali', 'fuochi-artificiali', 'Spettacoli pirotecnici e fuochi per ogni occasione', 'https://placehold.co/400x300/c62828/ffffff?text=Fuochi+Artificiali', NULL, 3, true),
  ('a0000000-0000-0000-0000-000000000009', 'Accessori', 'accessori', 'Ottiche, fondine, pulizia armi, bersagli e altro', 'https://placehold.co/400x300/1a1a1a/ffffff?text=Accessori', NULL, 4, true),
  ('a0000000-0000-0000-0000-000000000010', 'Ottiche e Red Dot', 'ottiche-red-dot', 'Cannocchiali, red dot, mirini olografici', 'https://placehold.co/400x300/d4a017/1a1a1a?text=Ottiche', 'a0000000-0000-0000-0000-000000000009', 1, true),
  ('a0000000-0000-0000-0000-000000000011', 'Fondine e Custodie', 'fondine-custodie', 'Fondine tattiche, da cintura, custodie imbottite', 'https://placehold.co/400x300/d4a017/1a1a1a?text=Fondine', 'a0000000-0000-0000-0000-000000000009', 2, true),
  ('a0000000-0000-0000-0000-000000000012', 'Pulizia e Manutenzione', 'pulizia-manutenzione', 'Kit pulizia, oli, solventi, bacchette', 'https://placehold.co/400x300/d4a017/1a1a1a?text=Pulizia', 'a0000000-0000-0000-0000-000000000009', 3, true);
-- ============================================
-- PRODUCTS (no sort_order column, stock_quantity not stock)
-- ============================================

-- Pistole
INSERT INTO products (id, name, slug, description, rich_description, price, compare_at_price, sku, stock_quantity, category_id, is_active, is_featured) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Beretta 92FS', 'beretta-92fs', 'Pistola semiautomatica calibro 9x21mm. Icona di affidabilità.', '<p>La <strong>Beretta 92FS</strong> è una delle pistole più iconiche al mondo. Calibro 9x21mm, canna da 125mm, caricatore da 15 colpi.</p>', 850.00, NULL, 'PIS-BER-92FS', 5, 'a0000000-0000-0000-0000-000000000002', true, true),
  ('b0000000-0000-0000-0000-000000000002', 'Glock 17 Gen5', 'glock-17-gen5', 'Pistola semiautomatica calibro 9x21mm. Lo standard mondiale.', '<p>La <strong>Glock 17 Gen5</strong> rappresenta l''evoluzione della pistola più diffusa al mondo. Caricatore da 17 colpi.</p>', 720.00, NULL, 'PIS-GLK-17G5', 8, 'a0000000-0000-0000-0000-000000000002', true, true),
  ('b0000000-0000-0000-0000-000000000003', 'Sig Sauer P226', 'sig-sauer-p226', 'Pistola semiautomatica calibro 9x21mm. Precisione militare.', '<p>La <strong>Sig Sauer P226</strong> è la scelta delle forze speciali. Fusto in lega, carrello in acciaio.</p>', 1150.00, 1250.00, 'PIS-SIG-P226', 3, 'a0000000-0000-0000-0000-000000000002', true, true),
  ('b0000000-0000-0000-0000-000000000004', 'CZ 75 SP-01 Shadow', 'cz-75-sp01-shadow', 'Pistola da competizione calibro 9x21mm per tiro sportivo.', '<p>La <strong>CZ 75 SP-01 Shadow</strong> è la pistola preferita dai tiratori IPSC.</p>', 980.00, NULL, 'PIS-CZ-SP01S', 4, 'a0000000-0000-0000-0000-000000000002', true, false),
  ('b0000000-0000-0000-0000-000000000005', 'Smith & Wesson M&P9 2.0', 'sw-mp9-20', 'Pistola striker-fired calibro 9x21mm. Ergonomia e affidabilità.', '<p>La <strong>S&W M&P9 2.0</strong> offre 4 dorsalini intercambiabili e texture aggressiva.</p>', 680.00, 750.00, 'PIS-SW-MP9', 6, 'a0000000-0000-0000-0000-000000000002', true, false),
-- Fucili
  ('b0000000-0000-0000-0000-000000000006', 'Benelli Raffaello Crio', 'benelli-raffaello-crio', 'Fucile semiautomatico calibro 12. Il re della caccia italiana.', '<p>Il <strong>Benelli Raffaello Crio</strong> con sistema Inertia Driven e canne Crio System.</p>', 1450.00, NULL, 'FUC-BEN-RAFF', 3, 'a0000000-0000-0000-0000-000000000003', true, true),
  ('b0000000-0000-0000-0000-000000000007', 'Beretta 686 Silver Pigeon I', 'beretta-686-silver-pigeon', 'Sovrapposto calibro 12. Eleganza e prestazioni.', '<p>Il <strong>Beretta 686 Silver Pigeon I</strong> è il sovrapposto più venduto al mondo.</p>', 2200.00, NULL, 'FUC-BER-686SP', 2, 'a0000000-0000-0000-0000-000000000003', true, true),
  ('b0000000-0000-0000-0000-000000000008', 'Franchi Affinity 3', 'franchi-affinity-3', 'Semiautomatico calibro 12. Versatile e leggero.', '<p>Il <strong>Franchi Affinity 3</strong> con sistema Inertia Driven, peso sotto i 3kg.</p>', 980.00, 1100.00, 'FUC-FRA-AFF3', 5, 'a0000000-0000-0000-0000-000000000003', true, false),
-- Carabine
  ('b0000000-0000-0000-0000-000000000009', 'CZ 457 Varmint', 'cz-457-varmint', 'Carabina bolt action calibro .22 LR. Precisione chirurgica.', '<p>La <strong>CZ 457 Varmint</strong> con canna pesante da 525mm e grilletto regolabile.</p>', 750.00, NULL, 'CAR-CZ-457V', 4, 'a0000000-0000-0000-0000-000000000004', true, false),
  ('b0000000-0000-0000-0000-000000000010', 'Tikka T3x Lite', 'tikka-t3x-lite', 'Carabina bolt action calibro .308 Win. Precisione finlandese.', '<p>La <strong>Tikka T3x Lite</strong> pesa solo 2.9kg. Garanzia precisione sub-MOA.</p>', 1350.00, NULL, 'CAR-TIK-T3XL', 3, 'a0000000-0000-0000-0000-000000000004', true, true),
-- Munizioni Pistola
  ('b0000000-0000-0000-0000-000000000011', 'Federal 9mm Luger 124gr FMJ (50pz)', 'federal-9mm-124gr-fmj', 'Munizioni 9mm Luger 124 grani FMJ. Confezione da 50.', '<p>Munizioni <strong>Federal American Eagle</strong> 9mm Luger 124gr FMJ.</p>', 18.50, NULL, 'MUN-FED-9MM124', 200, 'a0000000-0000-0000-0000-000000000006', true, false),
  ('b0000000-0000-0000-0000-000000000012', 'Fiocchi 9x21 IMI 123gr FMJ (50pz)', 'fiocchi-9x21-123gr-fmj', 'Munizioni 9x21 IMI 123 grani FMJ. Produzione italiana.', '<p>Munizioni <strong>Fiocchi</strong> 9x21 IMI prodotte in Italia.</p>', 16.00, NULL, 'MUN-FIO-9X21', 300, 'a0000000-0000-0000-0000-000000000006', true, false),
  ('b0000000-0000-0000-0000-000000000013', 'Sellier & Bellot .45 ACP 230gr FMJ (50pz)', 'sb-45acp-230gr-fmj', 'Munizioni .45 ACP 230 grani FMJ. Confezione da 50.', '<p>Munizioni <strong>S&B</strong> .45 ACP di qualità ceca.</p>', 28.00, 32.00, 'MUN-SB-45ACP', 150, 'a0000000-0000-0000-0000-000000000006', true, false),
-- Munizioni Fucile
  ('b0000000-0000-0000-0000-000000000014', 'Fiocchi 12/70 Trap 24gr (25pz)', 'fiocchi-12-70-trap-24gr', 'Cartucce calibro 12 da trap. Piombo n.7.5.', '<p>Cartucce <strong>Fiocchi</strong> calibro 12/70 per tiro a volo.</p>', 8.50, NULL, 'MUN-FIO-12TRAP', 500, 'a0000000-0000-0000-0000-000000000007', true, false),
  ('b0000000-0000-0000-0000-000000000015', 'Hornady .308 Win 168gr BTHP Match (20pz)', 'hornady-308-168gr-bthp', 'Munizioni .308 Win 168gr Match. Precisione estrema.', '<p>Munizioni <strong>Hornady Match</strong> .308 Win con palla BTHP da 168gr.</p>', 42.00, NULL, 'MUN-HOR-308M', 80, 'a0000000-0000-0000-0000-000000000007', true, false),
-- Fuochi Artificiali
  ('b0000000-0000-0000-0000-000000000016', '500 Bangs', '500-bangs', 'Batteria di 500 colpi con lampi colorati.', '<p><strong>500 Bangs</strong> — batteria da 500 scoppi con effetti multicolore.</p>', 10.00, NULL, 'FUO-500BANGS', 50, 'a0000000-0000-0000-0000-000000000008', true, true),
  ('b0000000-0000-0000-0000-000000000017', 'Adrenaline', 'adrenaline', 'Batteria pirotecnica con effetti multicolore.', '<p><strong>Adrenaline</strong> — sequenza di colpi colorati, crescendo finale.</p>', 20.00, NULL, 'FUO-ADRENAL', 40, 'a0000000-0000-0000-0000-000000000008', true, true),
  ('b0000000-0000-0000-0000-000000000018', 'Battaglia dell''Assietta', 'battaglia-assietta', 'Batteria professionale con 100 lanci.', '<p><strong>Battaglia dell''Assietta</strong> — 100 lanci ad alto impatto.</p>', 70.00, 85.00, 'FUO-BATASS', 20, 'a0000000-0000-0000-0000-000000000008', true, true),
  ('b0000000-0000-0000-0000-000000000019', 'Fontana Sparkle Gold', 'fontana-sparkle-gold', 'Fontana pirotecnica dorata. Altezza 3m, durata 45sec.', '<p><strong>Fontana Sparkle Gold</strong> — scintille dorate per eventi eleganti.</p>', 15.00, NULL, 'FUO-FONTGOLD', 60, 'a0000000-0000-0000-0000-000000000008', true, false),
-- Accessori - Ottiche
  ('b0000000-0000-0000-0000-000000000020', 'Vortex Crossfire II 3-9x40', 'vortex-crossfire-ii-3-9x40', 'Cannocchiale 3-9x40mm. Reticolo V-Plex.', '<p>Il <strong>Vortex Crossfire II</strong> con lenti multistrato e garanzia VIP a vita.</p>', 220.00, NULL, 'ACC-VTX-CF2', 10, 'a0000000-0000-0000-0000-000000000010', true, false),
  ('b0000000-0000-0000-0000-000000000021', 'Holosun HS510C Red Dot', 'holosun-hs510c', 'Red dot 65 MOA + 2 MOA. Solare + batteria.', '<p>L''<strong>Holosun HS510C</strong> con tecnologia solare e shake awake.</p>', 350.00, 380.00, 'ACC-HOL-510C', 7, 'a0000000-0000-0000-0000-000000000010', true, true),
-- Accessori - Fondine
  ('b0000000-0000-0000-0000-000000000022', 'Safariland 6354DO ALS per Glock', 'safariland-6354do-glock', 'Fondina tattica ALS per Glock 17/22. Compatibile red dot.', '<p>La <strong>Safariland 6354DO</strong> con ritenzione ALS.</p>', 180.00, NULL, 'ACC-SAF-6354', 8, 'a0000000-0000-0000-0000-000000000011', true, false),
  ('b0000000-0000-0000-0000-000000000023', 'Blackhawk Serpa CQC Beretta 92', 'blackhawk-serpa-beretta', 'Fondina da cintura con ritenzione a pulsante.', '<p>La <strong>Blackhawk Serpa CQC</strong> con Auto Lock.</p>', 55.00, NULL, 'ACC-BHK-SERPA', 12, 'a0000000-0000-0000-0000-000000000011', true, false),
-- Accessori - Pulizia
  ('b0000000-0000-0000-0000-000000000024', 'Kit Pulizia Universale Hoppe''s No.9', 'hoppes-kit-pulizia', 'Kit completo pulizia armi. Tutti i calibri.', '<p>Il <strong>Kit Hoppe''s No.9</strong> con bacchette, spazzole, solvente e olio.</p>', 45.00, 55.00, 'ACC-HOP-KIT', 20, 'a0000000-0000-0000-0000-000000000012', true, false),
  ('b0000000-0000-0000-0000-000000000025', 'Olio Ballistol Universale 200ml', 'ballistol-olio-200ml', 'Olio universale per armi. Spray 200ml.', '<p>L''<strong>Olio Ballistol</strong> — il classico tedesco dal 1904.</p>', 12.00, NULL, 'ACC-BAL-200', 40, 'a0000000-0000-0000-0000-000000000012', true, false);
-- ============================================
-- PRODUCT IMAGES (alt_text not alt)
-- ============================================
INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'https://upload.wikimedia.org/wikipedia/commons/9/98/Beretta_92_FS_9x21_IMI.jpg', 'Beretta 92FS', 1, true),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'https://upload.wikimedia.org/wikipedia/commons/9/98/Beretta_92_FS_9x21_IMI.jpg', 'Beretta 92FS vista laterale', 2, false),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Glock_17C_cropped.jpg', 'Glock 17 Gen5', 1, true),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'https://upload.wikimedia.org/wikipedia/commons/9/97/SIG_P226_9mm_full.jpg', 'Sig Sauer P226', 1, true),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'https://upload.wikimedia.org/wikipedia/commons/1/16/CZ75_full.jpg', 'CZ 75 SP-01 Shadow', 1, true),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Smith_Wesson_MP_9mm.jpg', 'Smith Wesson MP9', 1, true),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Benelli_M2.jpg', 'Benelli Raffaello Crio', 1, true),
  ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000007', 'https://upload.wikimedia.org/wikipedia/commons/4/47/Beretta_686_Silver_Pigeon_-_right_1.jpg', 'Beretta 686 Silver Pigeon', 1, true),
  ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000008', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Franchi_612VS.jpg', 'Franchi Affinity 3', 1, true),
  ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000009', 'https://upload.wikimedia.org/wikipedia/commons/5/58/CZ_452_American.jpg', 'CZ 457 Varmint', 1, true),
  ('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000010', 'https://upload.wikimedia.org/wikipedia/commons/1/16/Tikka_T3.jpg', 'Tikka T3x Lite', 1, true),
  ('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000016', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Fireworks_in_Glendale_Arizona.jpg', '500 Bangs', 1, true),
  ('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000017', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Fireworks_in_Glendale_Arizona.jpg', 'Adrenaline', 1, true),
  ('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000018', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Fireworks_in_Glendale_Arizona.jpg', 'Battaglia Assietta', 1, true),
  ('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000021', 'https://upload.wikimedia.org/wikipedia/commons/5/52/EOTech_XPS2.jpg', 'Holosun HS510C', 1, true);

-- ============================================
-- PRODUCT VARIANTS (price_adjustment, stock_quantity, attributes JSONB)
-- ============================================
INSERT INTO product_variants (id, product_id, name, sku, price_adjustment, stock_quantity, attributes, is_active) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Brunita', 'PIS-BER-92FS-BRU', 0.00, 3, '{"finitura": "brunita"}', true),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'INOX', 'PIS-BER-92FS-INX', 100.00, 2, '{"finitura": "inox"}', true),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 'Canna 71cm', 'FUC-BEN-RAFF-71', 0.00, 2, '{"canna": "71cm"}', true),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006', 'Canna 76cm', 'FUC-BEN-RAFF-76', 0.00, 1, '{"canna": "76cm"}', true),
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000010', '.308 Winchester', 'CAR-TIK-T3XL-308', 0.00, 2, '{"calibro": ".308 Win"}', true),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000010', '.30-06 Springfield', 'CAR-TIK-T3XL-3006', 0.00, 1, '{"calibro": ".30-06 Sprg"}', true);
-- ============================================
-- BLOG POSTS (is_published BOOL, tags TEXT[])
-- ============================================
INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image_url, tags, is_published, published_at) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Come scegliere la tua prima pistola', 'come-scegliere-prima-pistola',
   'Guida completa per chi si avvicina al mondo delle armi sportive.',
   '<h2>Introduzione</h2><p>Scegliere la prima pistola è un passo importante. In questa guida vi accompagniamo nella scelta.</p><h2>Calibri consigliati</h2><p>Il <strong>9x21mm</strong> è il calibro più versatile: rinculo gestibile, munizioni economiche, ampia scelta di modelli.</p><h2>Il nostro consiglio</h2><p>Venite a trovarci in negozio. Il nostro staff vi guiderà nella scelta.</p>',
   'https://placehold.co/1200x600/1a1a1a/ffffff?text=Guida+Prima+Pistola',
   ARRAY['guida', 'pistole', 'principianti'], true, NOW() - INTERVAL '5 days'),

  ('e0000000-0000-0000-0000-000000000002', 'Manutenzione armi: i 5 errori da evitare', 'manutenzione-armi-5-errori',
   'Scopri gli errori più comuni nella pulizia delle armi da fuoco.',
   '<h2>La manutenzione è fondamentale</h2><p>Un''arma ben mantenuta è sicura e affidabile.</p><h2>Errore 1: Non pulire dopo ogni utilizzo</h2><p>I residui di polvere da sparo sono corrosivi.</p><h2>Errore 2: Troppo olio</h2><p>L''eccesso di olio attira polvere.</p><h2>Errore 3: Ignorare punti nascosti</h2><p>Percussore ed estrattore vanno puliti.</p><h2>Errore 4: Prodotti non specifici</h2><p>Usate solo solventi e oli per armi.</p><h2>Errore 5: Non controllare molle</h2><p>Sostituitele periodicamente.</p>',
   'https://placehold.co/1200x600/c62828/ffffff?text=Manutenzione+Armi',
   ARRAY['manutenzione', 'pulizia', 'consigli'], true, NOW() - INTERVAL '12 days'),

  ('e0000000-0000-0000-0000-000000000003', 'Calendario spettacoli pirotecnici estate 2026', 'calendario-spettacoli-estate-2026',
   'Tutti gli spettacoli pirotecnici Armeria Palmetto per l''estate 2026.',
   '<h2>Estate di fuoco!</h2><p>Organizziamo spettacoli pirotecnici per feste patronali, matrimoni e eventi in tutta la provincia di Brescia.</p><h2>Come prenotare</h2><p>Contattateci o prenotate un appuntamento dal sito per un preventivo personalizzato.</p>',
   'https://placehold.co/1200x600/d4a017/1a1a1a?text=Spettacoli+2026',
   ARRAY['fuochi artificiali', 'eventi', 'estate'], true, NOW() - INTERVAL '2 days'),

  ('e0000000-0000-0000-0000-000000000004', 'Novità Beretta 2026: la nuova linea sportiva', 'novita-beretta-2026',
   'Anteprima dei nuovi modelli Beretta presentati all''IWA 2026.',
   '<h2>IWA 2026</h2><p>Beretta ha presentato la nuova linea di pistole sportive e fucili da competizione aggiornati.</p><h2>Prossimamente</h2><p>Prenotate la vostra copia contattandoci. Consegne da giugno 2026.</p>',
   'https://placehold.co/1200x600/333333/ffffff?text=Novit%C3%A0+Beretta+2026',
   ARRAY['beretta', 'novità', '2026'], false, NULL);

-- ============================================
-- PAGES (is_published BOOL, published_at)
-- ============================================
INSERT INTO pages (id, title, slug, content, is_published, published_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Chi Siamo', 'chi-siamo',
   '<h2>La Nostra Storia</h2><p>Armeria Palmetto è un pilastro della comunità di Brescia da decenni.</p><p>Offriamo una vasta gamma di armi e munizioni delle migliori marche, garantendo sicurezza e affidabilità.</p><h2>I Nostri Valori</h2><p>Sicurezza, competenza, passione.</p>',
   true, NOW() - INTERVAL '30 days'),

  ('f0000000-0000-0000-0000-000000000002', 'Contatti', 'contatti',
   '<h2>Dove Siamo</h2><p><strong>Armeria Palmetto</strong><br/>Via Guglielmo Oberdan, 70<br/>25128 Brescia (BS)</p><h2>Orari</h2><p>Lun-Ven: 9:00-12:30, 15:00-19:00<br/>Sab: 9:00-12:30<br/>Dom: Chiuso</p><h2>Recapiti</h2><p>Tel: 030 370 0800<br/>Email: info@palmetto.it</p>',
   true, NOW() - INTERVAL '30 days'),

  ('f0000000-0000-0000-0000-000000000003', 'Servizi', 'servizi',
   '<h2>I Nostri Servizi</h2><h3>Vendita Armi</h3><p>Vasta gamma di armi da fuoco delle migliori marche.</p><h3>Assistenza Post-Vendita</h3><p>Supporto e consulenza dopo l''acquisto.</p><h3>Riparazioni</h3><p>Riparazione e manutenzione professionale.</p><h3>Consulenza</h3><p>Consulenze su misura per scegliere l''arma perfetta.</p><h3>Taratura Armi</h3><p>Servizi di taratura professionali.</p><h3>Vendita Munizioni</h3><p>Ampia selezione per ogni calibro.</p>',
   true, NOW() - INTERVAL '30 days');
-- ============================================
-- BOOKING SERVICES (no slug column)
-- ============================================
INSERT INTO booking_services (id, name, description, duration_minutes, price, is_active, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Consulenza Acquisto Armi', 'Appuntamento personalizzato per la scelta della tua arma. Il nostro esperto ti guiderà.', 30, 0.00, true, 1),
  ('a1000000-0000-0000-0000-000000000002', 'Taratura Ottica', 'Servizio professionale di taratura e azzeramento della tua ottica. Incluso test a 100m.', 60, 50.00, true, 2),
  ('a1000000-0000-0000-0000-000000000003', 'Riparazione e Manutenzione', 'Diagnosi e riparazione della tua arma. Preventivo gratuito.', 45, 30.00, true, 3),
  ('a1000000-0000-0000-0000-000000000004', 'Consulenza Spettacolo Pirotecnico', 'Pianifica il tuo spettacolo pirotecnico. Matrimoni, feste, eventi aziendali.', 45, 0.00, true, 4);

-- ============================================
-- BOOKING AVAILABILITY (day_of_week 0=Sun..6=Sat)
-- Lun=1, Mar=2, Mer=3, Gio=4, Ven=5, Sab=6
-- ============================================
INSERT INTO booking_availability (id, day_of_week, start_time, end_time, is_active) VALUES
  -- Mattina Lun-Ven: 9:00-12:30
  ('a2000000-0000-0000-0000-000000000001', 1, '09:00', '12:30', true),
  ('a2000000-0000-0000-0000-000000000002', 2, '09:00', '12:30', true),
  ('a2000000-0000-0000-0000-000000000003', 3, '09:00', '12:30', true),
  ('a2000000-0000-0000-0000-000000000004', 4, '09:00', '12:30', true),
  ('a2000000-0000-0000-0000-000000000005', 5, '09:00', '12:30', true),
  -- Pomeriggio Lun-Ven: 15:00-19:00
  ('a2000000-0000-0000-0000-000000000006', 1, '15:00', '19:00', true),
  ('a2000000-0000-0000-0000-000000000007', 2, '15:00', '19:00', true),
  ('a2000000-0000-0000-0000-000000000008', 3, '15:00', '19:00', true),
  ('a2000000-0000-0000-0000-000000000009', 4, '15:00', '19:00', true),
  ('a2000000-0000-0000-0000-000000000010', 5, '15:00', '19:00', true),
  -- Sabato mattina: 9:00-12:30
  ('a2000000-0000-0000-0000-000000000011', 6, '09:00', '12:30', true);
