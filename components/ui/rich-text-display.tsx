import { sanitizeHtml } from "@/lib/utils/sanitize";

/** Props for the RichTextDisplay component */
interface RichTextDisplayProps {
  /** Raw HTML content to render (will be sanitized) */
  html: string;
  /** Optional CSS class */
  className?: string;
}

/**
 * Renders sanitized HTML content safely.
 * Always sanitizes with DOMPurify before rendering.
 * Used for blog posts, pages, product descriptions.
 */
function RichTextDisplay({ html, className }: RichTextDisplayProps) {
  const sanitized = sanitizeHtml(html);

  return (
    <div
      className={`prose prose-sm max-w-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export { RichTextDisplay };
export type { RichTextDisplayProps };
