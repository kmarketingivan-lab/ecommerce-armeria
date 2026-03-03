"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { nanoid } from "nanoid";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides" as any)
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as unknown as HeroSlide[];
}

export async function createHeroSlide(
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { count } = await supabase
      .from("hero_slides" as any)
      .select("*", { count: "exact", head: true });
    const { error } = await supabase.from("hero_slides" as any).insert({
      title: String(formData.get("title") ?? ""),
      subtitle: String(formData.get("subtitle") ?? ""),
      cta_label: String(formData.get("cta_label") ?? "Scopri di più"),
      cta_href: String(formData.get("cta_href") ?? "/products"),
      image_url: formData.get("image_url") ? String(formData.get("image_url")) : null,
      sort_order: count ?? 0,
      is_active: formData.get("is_active") === "true",
    });
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

export async function updateHeroSlide(
  id: string,
  formData: FormData
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("hero_slides" as any)
      .update({
        title: String(formData.get("title") ?? ""),
        subtitle: String(formData.get("subtitle") ?? ""),
        cta_label: String(formData.get("cta_label") ?? ""),
        cta_href: String(formData.get("cta_href") ?? ""),
        image_url: formData.get("image_url") ? String(formData.get("image_url")) : null,
        is_active: formData.get("is_active") === "true",
      })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

export async function deleteHeroSlide(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase.from("hero_slides" as any).delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

export async function reorderHeroSlides(
  slides: { id: string; sort_order: number }[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    for (const s of slides) {
      await supabase.from("hero_slides" as any).update({ sort_order: s.sort_order }).eq("id", s.id);
    }
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

export async function toggleHeroSlide(
  id: string,
  isActive: boolean
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("hero_slides" as any)
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

export async function uploadHeroSlideImage(
  slideId: string,
  formData: FormData
): Promise<{ success: boolean; url?: string } | { error: string }> {
  try {
    await requireAdmin();
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Nessun file" };
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return { error: "Formato non supportato. Usa JPG, PNG o WebP." };
    if (file.size > 5 * 1024 * 1024) return { error: "File troppo grande. Max 5MB." };
    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `hero/${slideId || nanoid()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });
    if (uploadError) return { error: uploadError.message };
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    if (slideId) {
      await supabase.from("hero_slides" as any).update({ image_url: data.publicUrl }).eq("id", slideId);
    }
    revalidatePath("/");
    revalidatePath("/admin/vetrina");
    return { success: true, url: data.publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}
