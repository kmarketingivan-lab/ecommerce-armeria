# Security Audit Report

> Audit date: 2026-02-28
> Scope: All server actions, forms, security headers, error handling, input validation

---

## Task 6.1 — Input Validation Audit

### Server Actions — Zod Validation

All server actions validated:

| Action | File | Auth | Zod | Status |
|--------|------|------|-----|--------|
| createProduct | products/actions.ts | requireAdmin | productSchema | PASS |
| updateProduct | products/actions.ts | requireAdmin | productSchema | PASS |
| deleteProduct | products/actions.ts | requireAdmin | N/A (id only) | PASS |
| toggleProductActive | products/actions.ts | requireAdmin | N/A | PASS |
| updateProductStock | products/actions.ts | requireAdmin | inline check | PASS |
| reorderProductImages | products/actions.ts | requireAdmin | N/A | PASS |
| createCategory | categories/actions.ts | requireAdmin | categorySchema | PASS |
| updateCategory | categories/actions.ts | requireAdmin | categorySchema | PASS |
| deleteCategory | categories/actions.ts | requireAdmin | N/A | PASS |
| reorderCategories | categories/actions.ts | requireAdmin | N/A | PASS |
| updateOrderStatus | orders/actions.ts | requireAdmin | transition map | PASS |
| cancelOrder | orders/actions.ts | via updateOrderStatus | via updateOrderStatus | PASS |
| addOrderNote | orders/actions.ts | requireAdmin | orderNoteSchema | FIXED |
| createPost | blog/actions.ts | requireAdmin | blogPostSchema | PASS |
| updatePost | blog/actions.ts | requireAdmin | blogPostSchema | PASS |
| deletePost | blog/actions.ts | requireAdmin | N/A | PASS |
| togglePublished (blog) | blog/actions.ts | requireAdmin | N/A | PASS |
| createPage | pages/actions.ts | requireAdmin | pageSchema | PASS |
| updatePage | pages/actions.ts | requireAdmin | pageSchema | PASS |
| deletePage | pages/actions.ts | requireAdmin | N/A | PASS |
| togglePublished (page) | pages/actions.ts | requireAdmin | N/A | PASS |
| updateAvailability | bookings/actions.ts | requireAdmin | bookingAvailabilitySchema | PASS |
| createService | bookings/actions.ts | requireAdmin | bookingServiceSchema | PASS |
| updateService | bookings/actions.ts | requireAdmin | bookingServiceSchema | PASS |
| deleteService | bookings/actions.ts | requireAdmin | N/A | PASS |
| createBooking | bookings/actions.ts | public | bookingSchema | PASS |
| updateSetting | settings/actions.ts | requireAdmin | settingSchema | PASS |
| updateSettings | settings/actions.ts | requireAdmin | settingSchema (loop) | PASS |
| uploadMedia | media/actions.ts | requireAdmin | mediaSchema | PASS |
| deleteMedia | media/actions.ts | requireAdmin | N/A | PASS |
| updateMediaAlt | media/actions.ts | requireAdmin | Zod | PASS |
| signIn | auth/actions.ts | public | signInSchema | PASS |
| signUp | auth/actions.ts | public | signUpSchema | PASS |
| signOut | auth/actions.ts | N/A | N/A | PASS |
| resetPassword | auth/actions.ts | public | resetPasswordSchema | PASS |
| updatePassword | auth/actions.ts | authenticated | updatePasswordSchema | PASS |
| createOrder | checkout/actions.ts | public | orderSchema | PASS |
| addToCartAction | cart/actions.ts | public | inline checks | ACCEPTABLE |
| updateCartAction | cart/actions.ts | public | inline checks | ACCEPTABLE |
| removeFromCartAction | cart/actions.ts | public | inline checks | ACCEPTABLE |
| clearCartAction | cart/actions.ts | public | N/A | PASS |

### Issues Fixed

1. **Product `rich_description` not sanitized on save** — FIXED
   - Added `sanitizeHtml()` call in both `createProduct()` and `updateProduct()`
   - Defense-in-depth: `RichTextDisplay` also sanitizes on render

2. **`addOrderNote()` missing Zod validation** — FIXED
   - Added `orderNoteSchema` with min 1, max 2000 character validation

### Rich Content Sanitization

| Content | Sanitize on Save | Sanitize on Render | Status |
|---------|------------------|--------------------|--------|
| Blog rich_content | sanitizeHtml() in action | RichTextDisplay | PASS |
| Page rich_content | sanitizeHtml() in action | RichTextDisplay | PASS |
| Product rich_description | sanitizeHtml() in action | RichTextDisplay | FIXED |
| Rich Text Editor output | sanitizeHtml() onChange | N/A | PASS |

### Slug Validation

All slugs validated with regex `/^[a-z0-9-]+$/` (whitelist approach):
- Products: `lib/validators/products.ts`
- Blog posts: `lib/validators/blog-posts.ts`
- Categories: `lib/validators/categories.ts`
- Pages: `lib/validators/pages.ts`

No injection possible via slug fields.

---

## Task 6.2 — Security Headers Audit

### Headers in middleware.ts

| Header | Value | Status |
|--------|-------|--------|
| X-Frame-Options | DENY | PASS |
| X-Content-Type-Options | nosniff | PASS |
| Referrer-Policy | strict-origin-when-cross-origin | PASS |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | PASS |
| X-XSS-Protection | 1; mode=block | PASS |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | PASS |
| Content-Security-Policy | Present (see note) | PASS |

### CSP Note

CSP includes `'unsafe-eval'` and `'unsafe-inline'` for script-src. This is required by the Tiptap rich text editor which dynamically generates content. This is a known tradeoff documented here.

### Admin Route Protection

- All `/admin/*` routes require authentication via middleware
- All admin server components call `requireAdmin()`
- All admin server actions call `requireAdmin()` as first step
- API routes `/api/media` and `/api/media/upload` require admin auth
- API route `/api/bookings/slots` is correctly public (read-only slot availability)

---

## Task 6.3 — Error Handling Audit

### Error Boundaries

- `app/error.tsx` — Global error boundary with user-friendly message and retry button
- `app/not-found.tsx` — Custom 404 page

### Server Action Error Handling

All server actions follow consistent pattern:
1. Try/catch wraps entire function body
2. On catch: `logger.error()` with technical details, return generic user-friendly message
3. No stack traces exposed to client
4. Supabase errors: logged with `error.message`, user sees "Errore nell'operazione"

### Form Error Display

All forms display error messages via `useToast()`:
- `addToast("error", result.error)` — shows server-returned user-friendly message
- No technical details shown to user
