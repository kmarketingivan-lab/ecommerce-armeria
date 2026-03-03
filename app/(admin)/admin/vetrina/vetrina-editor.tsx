"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff,
  Upload, Loader2, Pencil, X, Check, GripVertical,
} from "lucide-react";
import {
  createHeroSlide, updateHeroSlide, deleteHeroSlide,
  reorderHeroSlides, toggleHeroSlide, uploadHeroSlideImage,
  type HeroSlide,
} from "./actions";

interface VetrinaEditorProps {
  initialSlides: HeroSlide[];
}

const EMPTY_SLIDE: Omit<HeroSlide, "id" | "sort_order" | "is_active"> = {
  title: "",
  subtitle: "",
  cta_label: "Scopri di più",
  cta_href: "/products",
  image_url: null,
};

export function VetrinaEditor({ initialSlides }: VetrinaEditorProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  const handleToggle = async (slide: HeroSlide) => {
    setLoading(slide.id);
    const res = await toggleHeroSlide(slide.id, !slide.is_active);
    setLoading(null);
    if ("error" in res) { showError(res.error); return; }
    setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, is_active: !s.is_active } : s));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa slide?")) return;
    setLoading(id);
    const res = await deleteHeroSlide(id);
    setLoading(null);
    if ("error" in res) { showError(res.error); return; }
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const newSlides = [...slides];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    const a = newSlides[index]!;
    const b = newSlides[swapIndex]!;
    newSlides[index] = b;
    newSlides[swapIndex] = a;
    const reordered = newSlides.map((s, i) => ({ ...s, sort_order: i }));
    setSlides(reordered);
    await reorderHeroSlides(reordered.map((s) => ({ id: s.id, sort_order: s.sort_order })));
  };

  const handleImageUpload = async (slideId: string, file: File) => {
    setLoading(`img-${slideId}`);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadHeroSlideImage(slideId, fd);
    setLoading(null);
    if ("error" in res) { showError(res.error); return; }
    if (res.url) {
      setSlides((prev) => prev.map((s) => s.id === slideId ? { ...s, image_url: res.url! } : s));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        💡 Le modifiche appaiono subito in homepage. Le slide disattivate non sono visibili ai visitatori.
      </div>

      <div className="space-y-4">
        {slides.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Nessuna slide. Aggiungine una.</p>
        )}

        {slides.map((slide, index) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={index}
            total={slides.length}
            isEditing={editingId === slide.id}
            isLoading={loading === slide.id || loading === `img-${slide.id}`}
            onEdit={() => setEditingId(editingId === slide.id ? null : slide.id)}
            onCancelEdit={() => setEditingId(null)}
            onSave={async (fd) => {
              setLoading(slide.id);
              // ── FIX: inject current image_url if form field is empty ──
              // SlideForm uses defaultValue (uncontrolled), so after an upload
              // the field stays empty. We inject the current state URL here.
              if (!fd.get("image_url") && slide.image_url) {
                fd.set("image_url", slide.image_url);
              }
              const res = await updateHeroSlide(slide.id, fd);
              setLoading(null);
              if ("error" in res) { showError(res.error); return; }
              const updated: HeroSlide = {
                ...slide,
                title: String(fd.get("title") ?? ""),
                subtitle: String(fd.get("subtitle") ?? ""),
                cta_label: String(fd.get("cta_label") ?? ""),
                cta_href: String(fd.get("cta_href") ?? ""),
                image_url: String(fd.get("image_url") ?? "") || slide.image_url,
                is_active: fd.get("is_active") === "true",
              };
              setSlides((prev) => prev.map((s) => s.id === slide.id ? updated : s));
              setEditingId(null);
            }}
            onToggle={() => handleToggle(slide)}
            onDelete={() => handleDelete(slide.id)}
            onMoveUp={() => handleMove(index, -1)}
            onMoveDown={() => handleMove(index, 1)}
            onImageUpload={(file) => handleImageUpload(slide.id, file)}
          />
        ))}
      </div>

      {showNewForm ? (
        <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-6">
          <h3 className="mb-4 font-semibold text-green-800">Nuova slide</h3>
          <SlideForm
            initial={EMPTY_SLIDE}
            onSubmit={async (fd) => {
              setLoading("new");
              const res = await createHeroSlide(fd);
              setLoading(null);
              if ("error" in res) { showError(res.error); return; }
              const { getHeroSlides } = await import("./actions");
              const fresh = await getHeroSlides();
              setSlides(fresh);
              setShowNewForm(false);
            }}
            onCancel={() => setShowNewForm(false)}
            isLoading={loading === "new"}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 hover:border-red-400 hover:text-red-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Aggiungi nuova slide
        </button>
      )}
    </div>
  );
}

// ── SlideCard ────────────────────────────────────────────────────────────────
interface SlideCardProps {
  slide: HeroSlide;
  index: number;
  total: number;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (fd: FormData) => Promise<void>;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onImageUpload: (file: File) => void;
}

function SlideCard({
  slide, index, total, isEditing, isLoading,
  onEdit, onCancelEdit, onSave, onToggle, onDelete,
  onMoveUp, onMoveDown, onImageUpload,
}: SlideCardProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`rounded-xl border-2 bg-white transition-all ${
      slide.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
          {index + 1}
        </span>
        <div className="relative h-10 w-16 overflow-hidden rounded bg-gray-100 shrink-0">
          {slide.image_url ? (
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover" sizes="64px" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300 text-xs">No img</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-sm text-gray-900">{slide.title || "— senza titolo —"}</p>
          <p className="truncate text-xs text-gray-400">{slide.cta_href}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={onMoveUp} disabled={index === 0} title="Sposta su"
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Sposta giù"
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30">
            <ArrowDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={onToggle} title={slide.is_active ? "Disattiva" : "Attiva"}
            className={`rounded p-1.5 transition ${slide.is_active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
            {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onEdit} title="Modifica"
            className={`rounded p-1.5 transition ${isEditing ? "bg-red-50 text-red-600" : "text-gray-400 hover:bg-gray-100"}`}>
            {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onDelete} title="Elimina"
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Edit panel */}
      {isEditing && (
        <div className="p-4 space-y-4">
          {/* Image section */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Immagine di sfondo</p>
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-40 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                {slide.image_url ? (
                  <Image src={slide.image_url} alt="" fill className="object-cover" sizes="160px" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">Nessuna immagine</div>
                )}
              </div>
              <div className="space-y-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Carica dal PC
                </button>
                <p className="text-xs text-gray-400">JPG, PNG, WebP — max 5MB<br />Consigliata: 1920×800px</p>
                {slide.image_url && (
                  <p className="text-xs text-green-600 font-medium">✓ Immagine caricata</p>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); }} />
          </div>

          {/* Text fields — pass current image_url so form can include it */}
          <SlideForm
            key={slide.image_url ?? "no-img"}
            initial={slide}
            onSubmit={onSave}
            onCancel={onCancelEdit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

// ── SlideForm ────────────────────────────────────────────────────────────────
interface SlideFormProps {
  initial: Partial<HeroSlide>;
  onSubmit: (fd: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function SlideForm({ initial, onSubmit, onCancel, isLoading }: SlideFormProps) {
  const [isActive, setIsActive] = useState(initial.is_active ?? true);
  // Controlled so it always reflects the current value (including after upload)
  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("is_active", String(isActive));
    fd.set("image_url", imageUrl); // always inject controlled value
    await onSubmit(fd);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titolo</label>
          <input name="title" defaultValue={initial.title ?? ""} required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Testo bottone CTA</label>
          <input name="cta_label" defaultValue={initial.cta_label ?? ""} required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Sottotitolo</label>
        <textarea name="subtitle" defaultValue={initial.subtitle ?? ""} rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Link CTA</label>
          <input name="cta_href" defaultValue={initial.cta_href ?? "/products"} required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">URL immagine</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https:// oppure /images/..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            {imageUrl ? "✓ URL presente (si aggiorna automaticamente con l'upload)" : "Carica un file sopra oppure incolla un URL"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id={`slide-active-${initial.title}`} checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-red-700" />
        <label htmlFor={`slide-active-${initial.title}`} className="text-sm text-gray-700">
          Slide attiva (visibile in homepage)
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Salva
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Annulla
        </button>
      </div>
    </form>
  );
}
