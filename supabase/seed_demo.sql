-- ============================================================
-- SEED: Armeria Palmetto — Categorie + 20 Prodotti demo
-- Eseguire su Supabase Cloud: SQL Editor → Run
-- ============================================================

-- CATEGORIE
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Pistole', 'pistole', 'Pistole semiautomatiche e revolver per uso sportivo e difesa personale', 1, true),
  ('11111111-0000-0000-0000-000000000002', 'Fucili', 'fucili', 'Fucili da caccia, sportivi e da tiro a segno', 2, true),
  ('11111111-0000-0000-0000-000000000003', 'Munizioni', 'munizioni', 'Munizioni per pistola e fucile di vari calibri', 3, true),
  ('11111111-0000-0000-0000-000000000004', 'Accessori', 'accessori', 'Fondine, ottiche, calci, custodie e accessori per la manutenzione', 4, true),
  ('11111111-0000-0000-0000-000000000005', 'Fuochi Artificiali', 'fuochi-artificiali', 'Fuochi artificiali categoria F1, F2 e F3 per uso civile', 5, true),
  ('11111111-0000-0000-0000-000000000006', 'Coltelli', 'coltelli', 'Coltelli da caccia, survival e collezione', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- PRODOTTI (con product_type per compliance)
INSERT INTO products (id, name, slug, description, price, compare_at_price, stock_quantity, category_id, is_active, is_featured, product_type, sku) VALUES

-- PISTOLE
('22222222-0000-0000-0000-000000000001',
 'Glock 17 Gen5 9mm',
 'glock-17-gen5-9mm',
 'Pistola semiautomatica Glock 17 Gen5 calibro 9x19mm. Capacità caricatore 17+1 colpi. Lunghezza canna 114mm. Peso 625g scarica. Finiture nere. Ideale per uso sportivo e difesa personale. Include 2 caricatori e custodia rigida.',
 749.00, 820.00, 3, '11111111-0000-0000-0000-000000000001', true, true, 'arma_fuoco', 'GL-17-G5'),

('22222222-0000-0000-0000-000000000002',
 'Beretta 92FS 9mm',
 'beretta-92fs-9mm',
 'La leggendaria pistola italiana Beretta 92FS, calibro 9x19mm. Doppia azione/singola azione, canna da 125mm, capacità 15+1 colpi. Struttura in alluminio, impugnatura ergonomica. Scelta delle forze armate di tutto il mondo.',
 899.00, NULL, 2, '11111111-0000-0000-0000-000000000001', true, true, 'arma_fuoco', 'BE-92FS'),

('22222222-0000-0000-0000-000000000003',
 'Sig Sauer P226 Legion',
 'sig-sauer-p226-legion',
 'Versione premium della Sig Sauer P226 della serie Legion. Calibro 9x19mm, canna da 112mm, capacità 15+1. Trattamento superficiale Nitron, grilletto enhanced, mirini X-Ray3. Dotazione esclusiva Legion con grip G10.',
 1290.00, 1450.00, 1, '11111111-0000-0000-0000-000000000001', true, false, 'arma_fuoco', 'SIG-P226-LEG'),

('22222222-0000-0000-0000-000000000004',
 'Smith & Wesson Model 686 .357 Magnum',
 'sw-686-357-magnum',
 'Revolver Smith & Wesson Model 686 Plus a doppia azione, calibro .357 Magnum. Cilindro da 7 colpi, canna da 4 pollici in acciaio inox. Ideale per tiro sportivo e caccia. Struttura L-Frame robusta e affidabile.',
 1150.00, NULL, 2, '11111111-0000-0000-0000-000000000001', true, false, 'arma_fuoco', 'SW-686-4'),

-- FUCILI
('22222222-0000-0000-0000-000000000005',
 'Browning Maxus II Sporting 12/76',
 'browning-maxus-ii-sporting',
 'Fucile semiautomatico Browning Maxus II Sporting, calibro 12/76. Canna da 76cm, sistema autoregolanate ActiveValve. Calcio in noce con impugnatura pistola, mire fibra ottica. Perfetto per il tiro sportivo su piattello.',
 1890.00, 2100.00, 2, '11111111-0000-0000-0000-000000000002', true, true, 'arma_fuoco', 'BR-MAXUS2-SP'),

('22222222-0000-0000-0000-000000000006',
 'Benelli M2 Field 12/76',
 'benelli-m2-field-12-76',
 'Fucile semiautomatico Benelli M2 Field, il più venduto al mondo. Calibro 12/76, canna da 71cm, sistema Inertia Driven. Legno di noce, peso 3,2kg. Versatile per caccia e tiro sportivo. Made in Italy.',
 1650.00, NULL, 3, '11111111-0000-0000-0000-000000000002', true, false, 'arma_fuoco', 'BEN-M2F'),

('22222222-0000-0000-0000-000000000007',
 'Tikka T3x Hunter .308 Win',
 'tikka-t3x-hunter-308',
 'Fucile bolt-action Tikka T3x Hunter calibro .308 Winchester. Canna fredda forgiata da 57cm, grilletto regolabile, calcio sintetico. Precisione garantita MOA con munizioni di qualità. Ideale per la caccia al capriolo e cinghiale.',
 1290.00, 1380.00, 2, '11111111-0000-0000-0000-000000000002', true, false, 'arma_fuoco', 'TK-T3X-308'),

('22222222-0000-0000-0000-000000000008',
 'Carabina Marlin 1894 .44 Magnum',
 'marlin-1894-44-magnum',
 'Carabina a leva Marlin 1894 in calibro .44 Magnum. Azione a leva classica americana, canna da 51cm, capacità 10 colpi. Legno di noce americano, finiture in acciaio lucido. Un classico intramontabile per caccia e tiro.',
 1350.00, NULL, 1, '11111111-0000-0000-0000-000000000002', true, false, 'arma_fuoco', 'MAR-1894-44'),

-- MUNIZIONI
('22222222-0000-0000-0000-000000000009',
 'Federal Premium 9mm 124gr FMJ (50pz)',
 'federal-9mm-124gr-fmj-50',
 'Munizioni Federal Premium calibro 9x19mm, palla FMJ da 124 grani. Confezione da 50 cartucce. Ideali per allenamento e tiro sportivo. Innesco sensibile, polvere pulita, bossolo in ottone ricaricabile.',
 24.90, NULL, 50, '11111111-0000-0000-0000-000000000003', true, false, 'munizioni', 'FED-9MM-124-50'),

('22222222-0000-0000-0000-000000000010',
 'Winchester .308 Win 168gr BTHP (20pz)',
 'winchester-308-168gr-bthp-20',
 'Munizioni Winchester Match calibro .308 Winchester, palla BTHP da 168 grani. Confezione da 20 cartucce. Alta precisione per tiro a lunga distanza e competizioni. Bossolo ricaricabile in ottone.',
 32.50, 38.00, 30, '11111111-0000-0000-0000-000000000003', true, false, 'munizioni', 'WIN-308-168-20'),

('22222222-0000-0000-0000-000000000011',
 'Fiocchi 12/70 28gr N°7.5 (25pz)',
 'fiocchi-12-70-28gr-n75-25',
 'Cartucce Fiocchi per fucile calibro 12/70, piombo da 28 grammi n°7.5. Confezione da 25 cartucce. Ideali per tiro a piattello, fossa olimpionica e skeet. Produzione italiana di alta qualità.',
 14.90, NULL, 100, '11111111-0000-0000-0000-000000000003', true, false, 'munizioni', 'FIO-12-28-75'),

('22222222-0000-0000-0000-000000000012',
 '.357 Magnum 158gr JSP Remington (50pz)',
 'remington-357-158gr-jsp-50',
 'Munizioni Remington calibro .357 Magnum, palla JSP da 158 grani. Confezione da 50 cartucce. Ottime prestazioni per caccia e difesa. Punta semiblindada per espansione controllata.',
 42.00, 48.00, 20, '11111111-0000-0000-0000-000000000003', true, false, 'munizioni', 'REM-357-158-50'),

-- ACCESSORI
('22222222-0000-0000-0000-000000000013',
 'Ottica Leupold VX-3HD 3-9x40mm',
 'leupold-vx3hd-3-9x40',
 'Cannocchiale da puntamento Leupold VX-3HD 3-9x40mm. Reticolo Duplex, trattamento lenti HD, impermeabile e resistente agli urti. Illuminazione opzionale. Copertura 30mm, trasmissione luce 92%. Garanzia a vita.',
 520.00, 620.00, 5, '11111111-0000-0000-0000-000000000004', true, false, 'accessori', 'LEU-VX3HD-3940'),

('22222222-0000-0000-0000-000000000014',
 'Fondina Safariland 6378 per Glock 17',
 'safariland-6378-glock17',
 'Fondina Safariland modello 6378 ALS, specifica per Glock 17. Sistema di ritenzione ALS (Automatic Locking System) con sgancio rapido. Montaggio paddle rimovibile. Realizzata in SafariLaminate, ambidestra. Colore nero.',
 145.00, NULL, 8, '11111111-0000-0000-0000-000000000004', true, false, 'accessori', 'SAF-6378-GL17'),

('22222222-0000-0000-0000-000000000015',
 'Kit pulizia universale Hoppe''s No. 9',
 'hoppes-kit-pulizia-universale',
 'Kit pulizia universale Hoppe''s No. 9 per pistole e fucili. Include: bacchetta pulizia modulare, spazzole in bronzo calibri multipli, soluzione solvente 4oz, olio lubrificante 4oz, toppe pulizia. Custodia in plastica.',
 38.50, 45.00, 15, '11111111-0000-0000-0000-000000000004', true, false, 'accessori', 'HOP-KIT-UNI'),

('22222222-0000-0000-0000-000000000016',
 'Calcio regolabile Magpul MOE per AR-15',
 'magpul-moe-calcio-ar15',
 'Calcio regolabile Magpul MOE (Mission Adaptable Stock) per piattaforma AR-15/M16. 6 posizioni di regolazione, vano portaoggetti, slitta QD. Materiale polimero rinforzato. Colore nero. Peso 230g.',
 89.00, NULL, 10, '11111111-0000-0000-0000-000000000004', true, false, 'accessori', 'MAG-MOE-AR15'),

-- FUOCHI ARTIFICIALI
('22222222-0000-0000-0000-000000000017',
 'Assortimento Categoria F2 — Festa Grande (24pz)',
 'assortimento-f2-festa-grande',
 'Assortimento fuochi artificiali categoria F2, confezione Festa Grande da 24 pezzi. Include: fontane colorate, bengala, petardi leggeri, stelle filanti. Distanza di sicurezza 8 metri. Per uso civile da 18 anni. Spedizione ADR.',
 49.90, 59.00, 25, '11111111-0000-0000-0000-000000000005', true, true, 'fuochi_artificiali', 'FF2-FESTA-24'),

('22222222-0000-0000-0000-000000000018',
 'Batteria 100 colpi F2 — Spettacolo Professionale',
 'batteria-100-colpi-f2',
 'Batteria da 100 colpi categoria F2 per spettacoli professionali. Durata show: 90 secondi. Effetti multicolore: rosso, verde, oro, argento. Distanza sicurezza 15 metri. Altezza massima 30 metri. Per uso civile da 18 anni.',
 89.00, NULL, 10, '11111111-0000-0000-0000-000000000005', true, false, 'fuochi_artificiali', 'FF2-BAT-100'),

-- COLTELLI
('22222222-0000-0000-0000-000000000019',
 'Coltello Benchmade Griptilian 551',
 'benchmade-griptilian-551',
 'Coltello pieghevole Benchmade Griptilian 551. Lama in acciaio CPM-S30V da 85mm, filo semplice. Manico in nylon con grip G10. Meccanismo AXIS Lock brevettato. Peso 117g. Ideale per uso outdoor e EDC.',
 175.00, 195.00, 12, '11111111-0000-0000-0000-000000000006', true, false, 'accessori', 'BM-GRIP-551'),

('22222222-0000-0000-0000-000000000020',
 'Coltello da caccia Buck 119 Special',
 'buck-119-special',
 'Coltello fisso da caccia Buck 119 Special, un classico americano dal 1947. Lama in acciaio 420HC da 152mm, manico in legno di phenolico nero. Include fodero in pelle. Perfetto per caccia, campeggio e uso survival.',
 98.00, NULL, 8, '11111111-0000-0000-0000-000000000006', true, false, 'accessori', 'BUCK-119-SP')

ON CONFLICT (slug) DO NOTHING;

-- IMMAGINI PRODOTTI (Unsplash — free for demo)
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
-- Glock 17
('22222222-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80', 'Glock 17 Gen5 9mm', 0, true),
('22222222-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1544990003-a9ce2b5e4a32?w=800&q=80', 'Glock 17 Gen5 dettaglio', 1, false),

-- Beretta 92FS
('22222222-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1584214019768-3e9f0b6d3870?w=800&q=80', 'Beretta 92FS', 0, true),

-- Sig Sauer P226
('22222222-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1566139884861-5c67e5db9893?w=800&q=80', 'Sig Sauer P226 Legion', 0, true),

-- SW 686
('22222222-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1609592806596-b9b4bfc27c7a?w=800&q=80', 'Smith & Wesson 686', 0, true),

-- Browning Maxus
('22222222-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', 'Browning Maxus II', 0, true),

-- Benelli M2
('22222222-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1630077510397-2bbfe2e4c26d?w=800&q=80', 'Benelli M2 Field', 0, true),

-- Tikka T3x
('22222222-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1588876167268-0d9e5e3f59f4?w=800&q=80', 'Tikka T3x Hunter .308', 0, true),

-- Marlin 1894
('22222222-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1578362896312-1b2b35e87237?w=800&q=80', 'Marlin 1894 .44 Magnum', 0, true),

-- Munizioni Federal 9mm
('22222222-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=800&q=80', 'Munizioni Federal 9mm', 0, true),

-- Winchester .308
('22222222-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1616431101491-554a8b09e73e?w=800&q=80', 'Winchester .308 Match', 0, true),

-- Fiocchi 12/70
('22222222-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1550411294-e0cc4e5f0e89?w=800&q=80', 'Fiocchi 12/70', 0, true),

-- Remington .357
('22222222-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80', 'Remington .357 Magnum', 0, true),

-- Leupold
('22222222-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=800&q=80', 'Leupold VX-3HD', 0, true),

-- Safariland
('22222222-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80', 'Fondina Safariland 6378', 0, true),

-- Hoppe's kit
('22222222-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Kit pulizia Hoppe No.9', 0, true),

-- Magpul calcio
('22222222-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80', 'Calcio Magpul MOE', 0, true),

-- Fuochi F2 assortimento
('22222222-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80', 'Fuochi artificiali F2', 0, true),
('22222222-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=800&q=80', 'Fuochi F2 notte', 1, false),

-- Batteria 100 colpi
('22222222-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', 'Batteria fuochi 100 colpi', 0, true),

-- Benchmade Griptilian
('22222222-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1536244881392-e054e3f87bdc?w=800&q=80', 'Benchmade Griptilian 551', 0, true),

-- Buck 119
('22222222-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', 'Buck 119 Special', 0, true)

ON CONFLICT DO NOTHING;
