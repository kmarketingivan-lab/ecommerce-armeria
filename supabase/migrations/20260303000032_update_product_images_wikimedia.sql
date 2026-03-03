-- Aggiorna immagini prodotti demo con foto reali da Wikimedia Commons (Public Domain / CC)
-- Formula URL: https://upload.wikimedia.org/wikipedia/commons/{md5[0]}/{md5[0:2]}/{filename}

-- Beretta 92FS
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/9/98/Beretta_92_FS_9x21_IMI.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000001';

-- Glock 17 Gen5
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Glock_17C_cropped.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000002';

-- Sig Sauer P226
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/9/97/SIG_P226_9mm_full.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000003';

-- CZ 75 SP-01 Shadow
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/1/16/CZ75_full.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000004';

-- Smith & Wesson M&P9 2.0
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/0/08/Smith_Wesson_MP_9mm.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000005';

-- Benelli Raffaello Crio
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Benelli_M2.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000006';

-- Beretta 686 Silver Pigeon
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Beretta_686_Silver_Pigeon_-_right_1.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000007';

-- Franchi Affinity 3
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Franchi_612VS.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000008';

-- CZ 457 Varmint
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/5/58/CZ_452_American.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000009';

-- Tikka T3x Lite
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/1/16/Tikka_T3.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000010';

-- Munizioni 9mm (Federal, Fiocchi)
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/9_mm_luger_p08_ammo.jpg'
  WHERE product_id IN ('b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000012');

-- Munizioni .45 ACP
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/3/37/45_ACP_FMJ.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000013';

-- Cartucce calibro 12
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/7/74/Shotgun_shells_20_12_410.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000014';

-- Munizioni .308 Win
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/1/10/308_winchester_round.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000015';

-- Fuochi artificiali (tutti)
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/d/da/Fireworks_in_Glendale_Arizona.jpg'
  WHERE product_id IN (
    'b0000000-0000-0000-0000-000000000016',
    'b0000000-0000-0000-0000-000000000017',
    'b0000000-0000-0000-0000-000000000018',
    'b0000000-0000-0000-0000-000000000019'
  );

-- Cannocchiale (Vortex)
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Leupold_scope.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000020';

-- Red dot (Holosun)
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/5/52/EOTech_XPS2.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000021';

-- Fondine (Safariland, Blackhawk)
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/3/31/Safariland_6280.jpg'
  WHERE product_id IN ('b0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000023');

-- Kit pulizia Hoppe's
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Hoppes_No9.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000024';

-- Olio Ballistol
UPDATE product_images SET url = 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Ballistol_spezial.jpg'
  WHERE product_id = 'b0000000-0000-0000-0000-000000000025';
