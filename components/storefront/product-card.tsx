import Link from "next/link";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

/** Formats a number as EUR currency string. */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/**
 * Product card for storefront grids.
 * Displays image, name, price (with compare_at_price barrato if present), featured badge.
 */
function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.is_featured && (
          <span className="absolute left-2 top-2 z-10 rounded bg-yellow-600 px-2 py-0.5 text-xs font-semibold text-white">
            In evidenza
          </span>
        )}
        {hasDiscount && (
          <span className="absolute right-2 top-2 z-10 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            Offerta
          </span>
        )}
        {/* Placeholder when no image */}
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-red-700">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.compare_at_price !== null && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export { ProductCard, formatPrice };
