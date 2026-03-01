import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/dal/products";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { ProductCard, formatPrice } from "@/components/storefront/product-card";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Prodotto non trovato" };

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.is_active) notFound();

  const images = product.product_images;
  const variants = product.product_variants.filter((v) => v.is_active);
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const related = await getRelatedProducts(product.id, product.category_id, 4);

  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-gray-700">Catalogo</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="space-y-4">
          {sortedImages.length > 0 ? (
            <>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={sortedImages[0]?.url}
                  alt={sortedImages[0]?.alt_text ?? product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {sortedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {sortedImages.slice(1).map((img) => (
                    <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={img.url}
                        alt={img.alt_text ?? product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.sku && (
              <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-700">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.compare_at_price !== null && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Stock info */}
          <div className="text-sm">
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">
                Disponibile ({product.stock_quantity} in magazzino)
              </span>
            ) : (
              <span className="text-red-600">Esaurito</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-700">{product.description}</p>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Varianti</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <span
                    key={v.id}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                  >
                    {v.name}
                    {v.price_adjustment !== 0 && (
                      <span className="ml-1 text-gray-500">
                        ({v.price_adjustment > 0 ? "+" : ""}{formatPrice(v.price_adjustment)})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          {product.stock_quantity > 0 && (
            <AddToCartButton productId={product.id} variantId={null} quantity={1} />
          )}

          {/* Rich description */}
          {product.rich_description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Dettagli</h3>
              <RichTextDisplay html={product.rich_description} />
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Prodotti correlati</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
