"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
  image_url: string | null;
}

export function HeroSliderClient({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[current]!;

  return (
    <section className="relative w-full overflow-hidden bg-neutral-900">
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: s.image_url ? `url(${s.image_url})` : "none" }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        <div className="relative z-10 flex h-full items-center">
          <div className="container-fluid">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-4 text-base text-neutral-300 sm:text-lg">{slide.subtitle}</p>
              )}
              <Link
                href={slide.cta_href}
                className="mt-8 inline-flex items-center rounded-full bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-800 transition-colors"
              >
                {slide.cta_label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" onClick={prev} aria-label="Slide precedente"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={next} aria-label="Slide successiva"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
