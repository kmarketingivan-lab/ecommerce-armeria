# TODO_A — Fix Tecnici Backend (KNOWN_ISSUES)

> Risolvi i problemi tecnici documentati in KNOWN_ISSUES.md.
> FILE OWNERSHIP: SOLO file in `lib/`, `app/api/`, `supabase/migrations/`, `package.json`
> NON toccare: `components/`, `app/(admin)/`, `app/(storefront)/` (tranne checkout actions)
> Dopo ogni task: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A1 — Rate Limiting con Upstash Redis

### A1.1 — Installa dipendenza
- [ ] `npm install @upstash/ratelimit @upstash/redis`
- [ ] Aggiungi a `.env.local.example`: `UPSTASH_REDIS_REST_URL=`, `UPSTASH_REDIS_REST_TOKEN=`
- [ ] **Verifica**: `npx tsc --noEmit`

### A1.2 — Crea modulo rate limiter
- [ ] Crea `lib/utils/rate-limit.ts`:
  - Importa `Ratelimit` da `@upstash/ratelimit` e `Redis` da `@upstash/redis`
  - Se env vars mancanti, fallback a noop (per dev locale senza Redis)
  - Esporta `rateLimit(identifier: string, opts?: { limit?: number; window?: string })` → `{ success: boolean; remaining: number }`
  - Rate limit default: 10 req / 10s per IP
  - Rate limit auth: 5 req / 60s per IP
  - Rate limit checkout: 3 req / 60s per IP
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### A1.3 — Applica rate limiting alle server actions critiche
- [ ] `lib/auth/actions.ts`: aggiungi rate limit (auth) a login, register, resetPassword
- [ ] `lib/checkout/actions.ts`: aggiungi rate limit (checkout) a createOrder
- [ ] `lib/cart/actions.ts`: aggiungi rate limit (default) a addToCart
- [ ] Ogni rate limit check deve: ottenere IP da headers (x-forwarded-for o fallback), chiamare rateLimit, se `!success` tornare `{ error: "Troppe richieste. Riprova tra poco." }`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A2 — Stock Decrement Atomico (RPC Postgres)

### A2.1 — Crea migrazione RPC
- [ ] Crea `supabase/migrations/20260228000014_atomic_stock.sql`:
  ```sql
  CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
  RETURNS BOOLEAN
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    current_stock INTEGER;
  BEGIN
    SELECT stock_quantity INTO current_stock
    FROM products WHERE id = p_product_id FOR UPDATE;

    IF current_stock IS NULL THEN
      RETURN FALSE;
    END IF;

    IF current_stock < p_quantity THEN
      RETURN FALSE;
    END IF;

    UPDATE products SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_product_id;

    RETURN TRUE;
  END;
  $$;
  ```
- [ ] Applica: `npx supabase db reset`
- [ ] **Verifica**: seed + migrazioni applicano senza errori

### A2.2 — Usa RPC nel checkout
- [ ] In `lib/checkout/actions.ts` (o `lib/dal/products.ts`): sostituisci il decrement manuale con `supabase.rpc('decrement_stock', { p_product_id, p_quantity })`
- [ ] Se RPC ritorna false → rollback ordine, ritorna errore "Prodotto esaurito"
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A3 — Booking Race Condition (Unique Constraint)

### A3.1 — Crea migrazione unique constraint
- [ ] Crea `supabase/migrations/20260228000015_booking_unique.sql`:
  - Aggiungi unique constraint sulla tabella bookings per impedire doppia prenotazione sullo stesso slot
  - Analizza la struttura di bookings per capire quali colonne usare (service_id + date + start_time o simile)
  - Se serve: aggiungi index parziale WHERE status != 'cancelled'
- [ ] Applica: `npx supabase db reset`
- [ ] **Verifica**: seed + migrazioni OK

### A3.2 — Gestisci errore unique violation nel codice
- [ ] In `lib/dal/bookings.ts` o nelle server actions bookings: cattura errore `23505` (unique_violation) e ritorna messaggio "Questo slot è già stato prenotato"
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A4 — Order Number Atomico (Sequence Postgres)

### A4.1 — Crea migrazione sequence
- [ ] Crea `supabase/migrations/20260228000016_order_sequence.sql`:
  ```sql
  CREATE SEQUENCE order_number_seq START 1000;

  CREATE OR REPLACE FUNCTION generate_order_number()
  RETURNS TEXT
  LANGUAGE sql
  SECURITY DEFINER
  AS $$
    SELECT 'ORD-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  $$;
  ```
- [ ] Applica: `npx supabase db reset`
- [ ] **Verifica**: seed OK

### A4.2 — Usa nel checkout
- [ ] In `lib/checkout/actions.ts`: sostituisci generazione order_number con `supabase.rpc('generate_order_number')`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A5 — File Upload Magic Bytes

### A5.1 — Installa e implementa
- [ ] `npm install file-type`
- [ ] In `app/api/media/upload/route.ts`: dopo aver ricevuto il file, usa `fileTypeFromBuffer` per verificare che il MIME type reale corrisponda all'estensione
- [ ] Lista whitelist: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- [ ] Se mismatch → 400 "Tipo file non consentito"
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## A6 — Verifica finale
- [ ] Aggiorna `KNOWN_ISSUES.md`: segna come risolti i punti fixati
- [ ] `npx tsc --noEmit && npm run build && npm run test:run` — TUTTO verde
- [ ] `git add -A && git commit -m "fix: resolve KNOWN_ISSUES — atomic stock, rate limit, booking unique, order seq, magic bytes"`