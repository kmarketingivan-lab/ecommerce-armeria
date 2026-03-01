# TODO_C — Integrazione Pagamenti Stripe

> Integra Stripe Checkout per il flusso di pagamento.
> FILE OWNERSHIP: `lib/stripe/`, `app/api/stripe/`, `app/(storefront)/checkout/`,
> `app/(storefront)/cart/`, `components/storefront/checkout-button.tsx`
> NON toccare: `supabase/migrations/`, `components/ui/`, `components/layout/`, `__tests__/`
> NON toccare i file di TODO_A e TODO_B
> Dopo ogni task: `npx tsc --noEmit && npm run build`

---

## C1 — Setup Stripe

### C1.1 — Installa dipendenze
- [ ] `npm install stripe @stripe/stripe-js`
- [ ] Aggiungi a `.env.local.example`:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```
- [ ] Aggiungi a `.env.local` le stesse chiavi con valori placeholder (sk_test_placeholder ecc.)
- [ ] **Verifica**: `npx tsc --noEmit`

### C1.2 — Crea client Stripe server-side
- [ ] Crea `lib/stripe/server.ts`:
  - Importa `Stripe` da `stripe`
  - Esporta singleton `stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })`
  - Se `STRIPE_SECRET_KEY` mancante, throw con messaggio chiaro
  - Verifica: solo importabile da server (no "use client")
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### C1.3 — Crea utility Stripe client-side
- [ ] Crea `lib/stripe/client.ts`:
  - "use client" (o senza, importato solo da client components)
  - Importa `loadStripe` da `@stripe/stripe-js`
  - Esporta `getStripe()` che ritorna promise con singleton Stripe instance
  - Usa `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

---

## C2 — Stripe Checkout Session

### C2.1 — API route per creare checkout session
- [ ] Crea `app/api/stripe/checkout/route.ts`:
  - POST handler
  - Leggi cart dal cookie (stessa logica di `lib/cart/cart.ts`)
  - Per ogni item nel cart: crea `line_items` con `price_data` (currency: "eur", product_data: { name, images }, unit_amount: price * 100)
  - `stripe.checkout.sessions.create({...})`
  - `mode: 'payment'`
  - `success_url`: `{origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `{origin}/cart`
  - `metadata`: { cart_id o info per ricostruire ordine }
  - `shipping_address_collection`: { allowed_countries: ['IT'] }
  - `customer_email`: se utente loggato, precompila
  - `locale: 'it'`
  - Ritorna `{ sessionId: session.id }` con status 200
  - Se errore → 500 con messaggio generico
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### C2.2 — Bottone checkout con redirect Stripe
- [ ] Modifica `app/(storefront)/checkout/page.tsx` o crea `components/storefront/checkout-button.tsx`:
  - Client component con bottone "Paga con Stripe"
  - onClick: fetch POST `/api/stripe/checkout`, ottieni sessionId, `stripe.redirectToCheckout({ sessionId })`
  - Loading state durante il redirect
  - Error handling: mostra toast se fallisce
  - Stile: `bg-red-700 hover:bg-red-800 text-white rounded-full px-8 py-3 text-lg font-bold`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

---

## C3 — Webhook Stripe

### C3.1 — API route webhook
- [ ] Crea `app/api/stripe/webhook/route.ts`:
  - POST handler
  - Leggi body raw (`request.text()`)
  - Verifica signature con `stripe.webhooks.constructEvent(body, sig, webhookSecret)`
  - Se verifica fallisce → 400
  - Gestisci evento `checkout.session.completed`:
    1. Recupera session con `stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] })`
    2. Crea ordine nel DB usando service role Supabase (stessa logica di checkout actions ma con dati da Stripe)
    3. Decrementa stock (usa RPC `decrement_stock` se disponibile, altrimenti fallback a UPDATE diretto)
    4. Svuota cart (se possibile — altrimenti il cart si svuota lato client al redirect)
    5. Logga in audit_log
  - Gestisci evento `checkout.session.expired`: logga solo
  - Ritorna 200 `{ received: true }`
  - IMPORTANTE: `export const runtime = 'nodejs'` (no edge, serve per body raw)
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### C3.2 — Configura Next.js per webhook raw body
- [ ] Se necessario, in `next.config.ts`: assicurati che la route `/api/stripe/webhook` non venga parsata automaticamente
  - In App Router con `request.text()` dovrebbe funzionare senza config extra
  - Se serve: disabilita body parser per quella route
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

---

## C4 — Pagina Success aggiornata

### C4.1 — Aggiorna success page
- [ ] `app/(storefront)/checkout/success/page.tsx`:
  - Leggi `session_id` da searchParams
  - Se presente: fetch dettagli sessione dal server per mostrare riepilogo
  - Mostra: "Ordine confermato!", numero ordine (da metadata), email di conferma
  - Se `session_id` mancante: redirect a homepage
  - Svuota cart cookie lato client (set cookie vuoto)
  - Link "Torna al catalogo" e "I miei ordini"
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

---

## C5 — Flusso alternativo (Stripe non configurato)

### C5.1 — Graceful degradation
- [ ] In `app/api/stripe/checkout/route.ts`: se `STRIPE_SECRET_KEY` non è presente o è placeholder, ritorna 503 con messaggio "Pagamenti non ancora configurati"
- [ ] Nel checkout button: se errore 503, mostra messaggio "I pagamenti saranno disponibili a breve. Contattaci per ordinare."
- [ ] Il checkout form esistente (senza Stripe) resta come fallback per creare ordini manuali
- [ ] **Verifica**: `npx tsc --noEmit && npm run build && npm run test:run`

---

## C6 — Verifica finale
- [ ] `npx tsc --noEmit && npm run build && npm run test:run` — TUTTO verde
- [ ] `git add -A && git commit -m "feat: Stripe Checkout integration with webhook"`