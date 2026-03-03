"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Star, StarOff, Trash2, Upload, Link as LinkIcon,
  ArrowUp, ArrowDown, Loader2, Plus, X
} from "lucide-react";
import {
  uploadProductImage,
  addProductImageUrl,
  setProductImagePrimary,
  reorderProductImages,
  deleteProductImage,
  updateProductImageAlt,
  type ProductImage,
} from "@/app/(admin)/admin/products/image-actions";

interface ImageManagerProps {
  productId: string;
  initialImages: ProductImage[];
}

export function ImageManager({ productId, initialImages }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlAlt, setUrlAlt] = useState("");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  // ── Upload file ──────────────────────────────────────────
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadProductImage(productId, fd);
      if ("error" in res) { showError(res.error); break; }
      if (res.image) setImages((prev) => [...prev, res.image!]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [productId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // ── Add URL ──────────────────────────────────────────────
  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    setUploading(true);
    const res = await addProductImageUrl(productId, urlInput.trim(), urlAlt.trim() || undefined);
    setUploading(false);
    if ("error" in res) { showError(res.error); return; }
    if (res.image) setImages((prev) => [...prev, res.image!]);
    setUrlInput("");
    setUrlAlt("");
    setShowUrlForm(false);
  };

  // ── Set primary ──────────────────────────────────────────
  const handleSetPrimary = async (imageId: string) => {
    const res = await setProductImagePrimary(productId, imageId);
    if ("error" in res) { showError(res.error); return; }
    setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
  };

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (image: ProductImage) => {
    if (!confirm("Eliminare questa immagine?")) return;
    const res = await deleteProductImage(productId, image.id, image.url);
    if ("error" in res) { showError(res.error); return; }
    const updated = images.filter((i) => i.id !== image.id);
    // if deleted was primary, set first as primary
    const first = updated[0];
    if (image.is_primary && first) {
      await setProductImagePrimary(productId, first.id);
      first.is_primary = true;
    }
    setImages(updated);
  };

  // ── Reorder ──────────────────────────────────────────────
  const handleMove = async (index: number, dir: -1 | 1) => {
    const newImages = [...images];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    const a = newImages[index];
    const b = newImages[swapIndex];
    if (!a || !b) return;
    newImages[index] = b;
    newImages[swapIndex] = a;
    const reordered = newImages.map((img, i) => ({ ...img, sort_order: i }));
    setImages(reordered);
    await reorderProductImages(productId, reordered.map((img) => ({ id: img.id, sort_order: img.sort_order })));
  };

  // ── Update alt text ──────────────────────────────────────
  const handleAltChange = useCallback(async (imageId: string, alt: string) => {
    setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, alt_text: alt } : img));
    await updateProductImageAlt(imageId, alt);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Immagini prodotto <span className="text-sm font-normal text-gray-400">({images.length})</span>
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUrlForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LinkIcon className="h-4 w-4" />
            URL esterno
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Carica file
          </button>
        </div>
      </div>

      {/* URL form */}
      {showUrlForm && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
          <p className="text-sm font-medium text-blue-800">Aggiungi immagine da URL</p>
          <input
            type="url"
            placeholder="https://esempio.com/immagine.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Testo alternativo (alt)"
            value={urlAlt}
            onChange={(e) => setUrlAlt(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={uploading || !urlInput.trim()}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> Aggiungi
            </button>
            <button
              type="button"
              onClick={() => setShowUrlForm(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
        }`}
      >
        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          Trascina qui le immagini oppure <span className="text-red-600 font-medium">clicca per selezionare</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, GIF — max 5MB per file</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Images grid */}
      {images.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Nessuna immagine caricata</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={`group relative rounded-xl border-2 bg-white overflow-hidden transition-all ${
                img.is_primary ? "border-yellow-400 shadow-md" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Primary badge */}
              {img.is_primary && (
                <div className="absolute left-2 top-2 z-10 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
                  Principale
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={img.url}
                  alt={img.alt_text ?? "Immagine prodotto"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={img.url.startsWith("http") && !img.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")}
                />
              </div>

              {/* Controls */}
              <div className="p-2 space-y-2">
                {/* Alt text */}
                <input
                  type="text"
                  value={img.alt_text ?? ""}
                  onChange={(e) => handleAltChange(img.id, e.target.value)}
                  placeholder="Testo alt..."
                  className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:border-red-400 focus:outline-none"
                />

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-1">
                  {/* Reorder */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      title="Sposta su"
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === images.length - 1}
                      title="Sposta giù"
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Primary + Delete */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={img.is_primary}
                      title={img.is_primary ? "Già principale" : "Imposta come principale"}
                      className={`rounded p-1 transition ${
                        img.is_primary
                          ? "text-yellow-500 cursor-default"
                          : "text-gray-400 hover:bg-yellow-50 hover:text-yellow-500"
                      }`}
                    >
                      {img.is_primary ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img)}
                      title="Elimina immagine"
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
