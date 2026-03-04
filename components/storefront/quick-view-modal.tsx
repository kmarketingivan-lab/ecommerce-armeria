"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import type { Product, ProductImage } from "@/types/database";
import { StockBadge } from "@/components/storefront/stock-badge";
import { QuantitySelector } from "@/components/storefront/quantity-selector";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { formatPrice } from "@/lib/utils/format";

interface QuickViewModalProps {
  product: Product & { product_images?: ProductImage[] | undefined };
  onClose: () => void;
}

function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);

  const images = product.product_images ?? [];
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primaryIdx = sortedImages.findIndex((img) => img.is_primary);
  const [activeIdx, setActiveIdx] = useState(primaryIdx >= 0 ? primaryIdx : 0);
  const activeImage = sortedImages[activeIdx];

  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price;
  const discountPct =
    hasDiscount && product.compare_at_price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop nero semi-trasparente */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottone chiudi */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow hover:bg-gray-100 transition-colors"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid sm:grid-cols-2">
          {/* ── Immagine ── */}
          <div className="relative bg-gray-50 rounded-tl-2xl rounded-bl-none sm:rounded-bl-2xl rounded-tr-2xl sm:rounded-tr-none overflow-hidden">
            <div className="relative aspect-square">
              {activeImage ? (
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt_text ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {hasDiscount && discountPct > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                  -{discountPct}%
                </span>
              )}
            </div>
            {sortedImages.length > 1 && (
              <div className="flex gap-2 p-3">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === activeIdx ? "border-red-600" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt_text ?? product.name} fill className="object-cover" sizes="56px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col gap-4 p-6">
            <div>
              <h2 className="text-xl font-bold leading-tight text-gray-900">{product.name}</h2>
              {product.sku && <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-red-700">{formatPrice(product.price)}</span>
              {hasDiscount && product.compare_at_price !== null && (
                <span className="text-base text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>

            <StockBadge
              stockQuantity={product.stock_quantity}
              lowStockThreshold={product.low_stock_threshold ?? undefined}
            />

            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
            )}

            {product.stock_quantity > 0 && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Quantità</label>
                  <QuantitySelector max={product.stock_quantity} value={quantity} onChange={setQuantity} />
                </div>
                <AddToCartButton productId={product.id} variantId={null} quantity={quantity} />
              </div>
            )}

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Vedi scheda completa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { QuickViewModal };
