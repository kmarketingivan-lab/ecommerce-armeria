import { createClient } from "@/lib/supabase/server";
import { HeroSliderClient } from "./hero-slider-client";

export async function HeroSlider() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const slides = (data ?? []) as {
    id: string;
    title: string;
    subtitle: string;
    cta_label: string;
    cta_href: string;
    image_url: string | null;
  }[];

  // Fallback se il DB non ha ancora slide
  const fallback = [
    { id: "1", title: "Qualità dal 1985", subtitle: "Scopri la nostra selezione di prodotti.", cta_label: "Sfoglia il catalogo", cta_href: "/products", image_url: "/images/hero-1.jpg" },
    { id: "2", title: "Nuovi arrivi", subtitle: "Le ultime novità sono arrivate!", cta_label: "Scopri le novità", cta_href: "/products", image_url: "/images/hero-2.jpg" },
  ];

  return <HeroSliderClient slides={slides.length > 0 ? slides : fallback} />;
}
