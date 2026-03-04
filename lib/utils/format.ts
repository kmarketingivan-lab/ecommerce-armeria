/**
 * Formats a number as EUR currency string.
 * Utility condivisa tra server e client components.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
