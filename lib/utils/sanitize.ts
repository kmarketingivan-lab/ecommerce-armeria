/**
 * Sanitize HTML content to prevent XSS attacks.
 *
 * Server-side (Node.js/Edge): strips only dangerous patterns.
 * Rich text is always edited in the browser, so this is a defence-in-depth layer.
 *
 * Client-side: uses DOMPurify with the native DOM.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  // Server-side: lightweight strip of dangerous content only
  if (typeof window === "undefined") {
    return dirty
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }

  // Client-side: use DOMPurify
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const mod = require("dompurify") as any;
    // Handle both default export and module export shapes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const factory = mod.default ?? mod;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const purify = typeof factory === "function" ? factory(window) : factory;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return purify.sanitize(dirty, {
      ALLOWED_TAGS: [
        "h1","h2","h3","h4","h5","h6",
        "p","br","hr",
        "ul","ol","li",
        "strong","em","b","i","u","s",
        "a","img",
        "blockquote","pre","code",
        "table","thead","tbody","tr","th","td",
        "div","span",
      ],
      ALLOWED_ATTR: ["href","src","alt","title","class","target","rel"],
    });
  } catch {
    // Last resort: strip all tags
    return dirty.replace(/<[^>]*>/g, "");
  }
}
