"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { nanoid } from "nanoid";

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

/** Upload file to Supabase Storage and save to product_images */
export async function uploadProductImage(
  productId: string,
  formData: FormData
): Promise<{ success: boolean; image?: ProductImage } | { error: string }> {
  try {
    await requireAdmin();
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Nessun file selezionato" };

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) return { error: "Formato non supportato. Usa JPG, PNG, WebP o GIF." };
    if (file.size > 5 * 1024 * 1024) return { error: "File troppo grande. Max 5MB." };

    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `products/${productId}/${nanoid()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: false });

    if (uploadError) return { error: "Errore upload: " + uploadError.message };

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

    // Count existing images to set sort_order
    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const sortOrder = count ?? 0;
    const isPrimary = sortOrder === 0;

    const { data, error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: urlData.publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        sort_order: sortOrder,
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (dbError) return { error: "Errore DB: " + dbError.message };

    revalidatePath(`/admin/products/${productId}`);
    return { success: true, image: data as ProductImage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Add image from external URL */
export async function addProductImageUrl(
  productId: string,
  url: string,
  altText?: string
): Promise<{ success: boolean; image?: ProductImage } | { error: string }> {
  try {
    await requireAdmin();
    if (!url.startsWith("http")) return { error: "URL non valido" };

    const supabase = await createClient();
    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const sortOrder = count ?? 0;

    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        alt_text: altText ?? null,
        sort_order: sortOrder,
        is_primary: sortOrder === 0,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath(`/admin/products/${productId}`);
    return { success: true, image: data as ProductImage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Set an image as primary (unsets all others) */
export async function setProductImagePrimary(
  productId: string,
  imageId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    if (error) return { error: error.message };
    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Reorder images — accepts array of {id, sort_order} */
export async function reorderProductImages(
  productId: string,
  order: { id: string; sort_order: number }[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    for (const item of order) {
      await supabase
        .from("product_images")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id)
        .eq("product_id", productId);
    }

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Delete a product image */
export async function deleteProductImage(
  productId: string,
  imageId: string,
  imageUrl: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    // Try to delete from storage if it's a Supabase-hosted file
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    if (imageUrl.includes(supabaseUrl)) {
      const storagePath = imageUrl.split("/storage/v1/object/public/media/")[1];
      if (storagePath) {
        await supabase.storage.from("media").remove([storagePath]);
      }
    }

    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Update alt text of an image */
export async function updateProductImageAlt(
  imageId: string,
  altText: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("product_images")
      .update({ alt_text: altText })
      .eq("id", imageId);
    if (error) return { error: error.message };
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore sconosciuto" };
  }
}

/** Fetch all images for a product */
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });
  return (data ?? []) as ProductImage[];
}
