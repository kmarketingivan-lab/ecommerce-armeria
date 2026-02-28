# PRD FASE 2 — UI Components, Admin, Storefront, Security, Tests

> **Run notturna #2**: UI components riutilizzabili, admin panel completo, storefront pubblico, security hardening, integration tests.
> **Prerequisiti**: Fase 1 completata e verificata. Supabase locale avviato (`npx supabase start`).
> **Stack**: Next.js 14 (App Router) + Supabase + TypeScript strict + Tailwind CSS

---

## Convenzioni (stesse della Fase 1 + aggiuntive UI)

- TypeScript `strict: true` — ZERO `any`, ZERO `@ts-ignore`
- Componenti React: funzionali, props tipizzate con interface, export default
- Tailwind CSS per TUTTO lo styling — ZERO CSS custom, ZERO styled-components
- Form: controlled con React Hook Form + zodResolver (installa `react-hook-form` e `@hookform/resolvers`)
- Tabelle admin: server components dove possibile, client components solo se serve interattività
- Ogni pagina admin: loading.tsx skeleton + error.tsx boundary
- ZERO `console.log` — usa logger
- Server actions già esistenti in `app/(admin)/admin/*/actions.ts` — le pagine le USANO, non le riscrivono
- Link interni: usa `<Link>` di next/link, MAI `<a>` per navigazione interna
---

## FASE 3 — UI Components riutilizzabili

### Task 3.1 — Dipendenze UI
- [ ] `npm install react-hook-form @hookform/resolvers lucide-react`
- [ ] `npm install -D @tailwindcss/typography`
- [ ] **Verifica**: `npx tsc --noEmit`

### Task 3.2 — FormField + FormError components
- [ ] `components/ui/form-field.tsx`: wrapper label+input+errore. Props: label, name, error?, children. Styling Tailwind consistente
- [ ] `components/ui/form-error.tsx`: messaggio errore rosso. Props: message?
- [ ] `components/ui/button.tsx`: Button con varianti (primary, secondary, danger, ghost), size (sm, md, lg), loading state con spinner, disabled state. Props tipizzate estendono ButtonHTMLAttributes
- [ ] `components/ui/input.tsx`: Input wrapper con styling Tailwind consistente
- [ ] `components/ui/textarea.tsx`: Textarea wrapper
- [ ] `components/ui/select.tsx`: Select wrapper con opzioni tipizzate
- [ ] `components/ui/badge.tsx`: Badge per status (pending=giallo, confirmed=verde, cancelled=rosso, ecc). Props: variant, children
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.3 — DataTable component
- [ ] `components/ui/data-table.tsx`: Tabella generica per admin. Props: columns (array {key, header, render?}), data T[], emptyMessage, onRowClick?. Supporta: sorting client-side per colonna, nessuna paginazione (la fa il server). Responsive: scroll orizzontale su mobile
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.4 — Modal + ConfirmDialog
- [ ] `components/ui/modal.tsx`: Modal overlay con close button, click outside per chiudere, ESC per chiudere. Props: isOpen, onClose, title, children. Usa `createPortal`
- [ ] `components/ui/confirm-dialog.tsx`: Modale di conferma per azioni distruttive. Props: isOpen, onConfirm, onCancel, title, message, confirmLabel, variant(danger/warning)
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.5 — Layout Admin
- [ ] `components/admin/sidebar.tsx`: Sidebar con navigazione. Voci: Dashboard, Prodotti, Categorie, Ordini, Prenotazioni, Blog, Pagine, Media, Impostazioni. Icone lucide-react. Voce attiva evidenziata. Collapsible su mobile (hamburger)
- [ ] `components/admin/header.tsx`: Header con titolo pagina, user menu (nome+ruolo), logout button
- [ ] `components/admin/page-header.tsx`: Header di pagina con titolo, descrizione opzionale, azioni (bottoni) a destra
- [ ] Aggiorna `app/(admin)/layout.tsx` per usare sidebar+header. Wrappa contenuto in grid: sidebar fissa 256px + main fluido
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.6 — Layout Storefront
- [ ] `components/storefront/navbar.tsx`: Navbar con logo/nome sito, navigazione (Home, Catalogo, Blog, Prenota, Contatti), cart icon con badge quantità, link account/login
- [ ] `components/storefront/footer.tsx`: Footer con info azienda, link utili, contatti, social. Dati da site_settings
- [ ] Aggiorna `app/(storefront)/layout.tsx` per usare navbar+footer
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.7 — RichTextEditor (semplificato)
- [ ] `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
- [ ] `components/ui/rich-text-editor.tsx`: Editor WYSIWYG con toolbar: bold, italic, headings (h2,h3), link, image, liste, blockquote. Props: content (HTML string), onChange(html). Client component ("use client")
- [ ] `components/ui/rich-text-display.tsx`: Render HTML sanitizzato con prose di Tailwind Typography
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.8 — MediaPicker
- [ ] `components/ui/media-picker.tsx`: Modale per selezionare/caricare immagini. Mostra griglia media esistenti (da DAL), upload nuovo file, selezione singola. Props: isOpen, onSelect(url), onClose. Client component
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.9 — Pagination component
- [ ] `components/ui/pagination.tsx`: Paginazione server-side. Props: currentPage, totalPages, basePath. Genera link con searchParams ?page=N. Mostra: prev, numeri, next. Ellipsis se troppe pagine
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 3.10 — Toast/Notification
- [ ] `components/ui/toast.tsx`: Toast notification system. Context provider + hook `useToast()`. Tipi: success, error, info. Auto-dismiss dopo 5s. Posizionato top-right. Client component
- [ ] `components/providers/toast-provider.tsx`: Provider da wrappare nel layout
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`
---

## FASE 4 — Admin Pages

> Ogni pagina admin usa: layout con sidebar, server component per fetch dati, client component per form/interattività. Ogni cartella ha: page.tsx, loading.tsx (skeleton), error.tsx.

### Task 4.1 — Admin Login page
- [ ] `app/(admin)/admin/login/page.tsx`: Form login con email+password. Usa `signIn` action. Redirect a /admin/dashboard dopo login. Messaggio errore inline. Design pulito centrato
- [ ] Middleware: se già autenticato come admin, redirect a /admin/dashboard
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.2 — Admin Dashboard
- [ ] `app/(admin)/admin/dashboard/page.tsx`: Cards con stats: totale ordini (per status), totale prodotti attivi, prenotazioni oggi, ultimi 5 ordini. Usa DAL functions
- [ ] `app/(admin)/admin/dashboard/loading.tsx`: Skeleton delle cards
- [ ] `app/(admin)/admin/page.tsx`: redirect a /admin/dashboard
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.3 — Products list + CRUD
- [ ] `app/(admin)/admin/products/page.tsx`: DataTable con prodotti (immagine thumbnail, nome, prezzo, stock, status badge, azioni). Paginazione server-side con searchParams. Filtro per categoria e ricerca
- [ ] `app/(admin)/admin/products/new/page.tsx`: Form creazione prodotto con React Hook Form + Zod. Campi: tutti quelli del productSchema. MediaPicker per immagini. RichTextEditor per rich_description. Submit chiama createProduct action
- [ ] `app/(admin)/admin/products/[id]/edit/page.tsx`: Form modifica prodotto, precompilato con dati esistenti. Submit chiama updateProduct action
- [ ] `app/(admin)/admin/products/loading.tsx` + `error.tsx`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.4 — Categories list + CRUD
- [ ] `app/(admin)/admin/categories/page.tsx`: Lista categorie con tree view (parent/children). Azioni: edit, delete con ConfirmDialog
- [ ] `app/(admin)/admin/categories/new/page.tsx`: Form creazione con parent selector
- [ ] `app/(admin)/admin/categories/[id]/edit/page.tsx`: Form modifica
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.5 — Orders list + detail
- [ ] `app/(admin)/admin/orders/page.tsx`: DataTable ordini (order_number, cliente email, totale, status badge, data). Filtro per status. Paginazione
- [ ] `app/(admin)/admin/orders/[id]/page.tsx`: Dettaglio ordine — info cliente, items con prezzi, totali, cambio status con select (solo transizioni valide), note, timeline audit log
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.6 — Bookings management
- [ ] `app/(admin)/admin/bookings/page.tsx`: DataTable prenotazioni (cliente, servizio, data, orario, status). Filtro per status e data. Azioni: conferma, cancella, completa, no-show
- [ ] `app/(admin)/admin/bookings/services/page.tsx`: Lista servizi prenotabili con CRUD inline
- [ ] `app/(admin)/admin/bookings/availability/page.tsx`: Tabella disponibilità per giorno della settimana. Form per start_time, end_time, is_active per ogni giorno
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.7 — Blog posts list + CRUD
- [ ] `app/(admin)/admin/blog/page.tsx`: DataTable posts (titolo, autore, status published/draft, data). Azioni: edit, toggle publish, delete
- [ ] `app/(admin)/admin/blog/new/page.tsx`: Form con RichTextEditor per content, tags input (comma separated), cover image via MediaPicker, SEO fields
- [ ] `app/(admin)/admin/blog/[id]/edit/page.tsx`: Form modifica precompilato
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.8 — Pages list + CRUD
- [ ] `app/(admin)/admin/pages/page.tsx`: DataTable pagine statiche (titolo, slug, status). Azioni: edit, toggle publish, delete
- [ ] `app/(admin)/admin/pages/new/page.tsx`: Form con RichTextEditor, SEO fields
- [ ] `app/(admin)/admin/pages/[id]/edit/page.tsx`: Form modifica
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.9 — Media library
- [ ] `app/(admin)/admin/media/page.tsx`: Griglia immagini con thumbnail, nome, size, data upload. Upload drag&drop zone. Delete con ConfirmDialog. Filtro per folder. Click apre dettaglio con alt text editabile
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 4.10 — Site Settings
- [ ] `app/(admin)/admin/settings/page.tsx`: Form con sezioni: Generale (nome sito, descrizione, email, telefono, indirizzo), Commerciale (valuta, aliquota IVA), Social (link social media), Orari (business hours). Submit aggiorna settings. Feedback toast su successo
- [ ] loading.tsx + error.tsx
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`
---

## FASE 5 — Storefront pubblico

### Task 5.1 — Homepage
- [ ] `app/(storefront)/page.tsx`: Hero section con titolo/CTA, prodotti in evidenza (getFeaturedProducts), categorie principali con immagini, ultimi blog posts. Server component. Design responsive
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.2 — Catalogo prodotti
- [ ] `app/(storefront)/catalogo/page.tsx`: Griglia prodotti con card (immagine, nome, prezzo, badge "in evidenza"). Filtro per categoria (sidebar o dropdown mobile). Paginazione. Ricerca. Prezzo formattato €
- [ ] `app/(storefront)/catalogo/[slug]/page.tsx`: Dettaglio prodotto — galleria immagini, nome, prezzo, descrizione rich, varianti selector, quantity selector, "Aggiungi al carrello" button. generateMetadata per SEO. Se prodotto non attivo → notFound()
- [ ] `app/(storefront)/catalogo/loading.tsx`
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.3 — Carrello
- [ ] `app/(storefront)/carrello/page.tsx`: Lista items nel carrello (immagine, nome, variante, prezzo unitario, quantity selector, subtotale, rimuovi). Totali: subtotale, IVA, spedizione, totale. Bottoni "Continua acquisti" e "Procedi al checkout". Se vuoto: messaggio + link catalogo. Client component per interattività
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.4 — Checkout
- [ ] `app/(storefront)/checkout/page.tsx`: Form multi-step o singola pagina: dati cliente (email, nome, telefono), indirizzo spedizione, indirizzo fatturazione (checkbox "uguale a spedizione"), riepilogo ordine, note. Bottone "Conferma ordine" chiama createOrder action. Redirect a pagina conferma
- [ ] `app/(storefront)/checkout/conferma/page.tsx`: Messaggio "Ordine confermato", order number, riepilogo. Link "I tuoi ordini"
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.5 — Blog pubblico
- [ ] `app/(storefront)/blog/page.tsx`: Lista articoli pubblicati con card (cover, titolo, excerpt, data, tags). Paginazione
- [ ] `app/(storefront)/blog/[slug]/page.tsx`: Articolo completo con rich content renderizzato, cover image, autore, data, tags. generateMetadata per SEO. Se non pubblicato → notFound()
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.6 — Prenotazioni pubbliche
- [ ] `app/(storefront)/prenota/page.tsx`: Lista servizi con nome, descrizione, durata, prezzo. Selezione servizio → picker data → picker slot disponibili (da getAvailableSlots) → form dati cliente → conferma. Feedback toast. Client component per multi-step
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.7 — Pagine statiche
- [ ] `app/(storefront)/[slug]/page.tsx`: Render pagina statica da slug. Rich content con prose Tailwind. generateMetadata. Se non pubblicata → notFound(). generateStaticParams per build
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`

### Task 5.8 — Account utente
- [ ] `app/(storefront)/account/page.tsx`: Dashboard utente — profilo (modifica nome, telefono), lista ordini con status, lista prenotazioni. Protetto: se non autenticato redirect a login
- [ ] `app/(storefront)/account/ordini/[id]/page.tsx`: Dettaglio ordine utente
- [ ] `app/(storefront)/auth/login/page.tsx`: Form login per utenti (non admin). Redirect a account dopo login
- [ ] `app/(storefront)/auth/registrazione/page.tsx`: Form registrazione
- [ ] `app/(storefront)/auth/recupera-password/page.tsx`: Form reset password
- [ ] **Verifica**: `npx tsc --noEmit && npm run build`