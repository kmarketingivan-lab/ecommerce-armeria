import { requireAdmin } from "@/lib/auth/helpers";
import { getProductById } from "@/lib/dal/products";
import { getCategories } from "@/lib/dal/categories";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../../product-form";
import { updateProduct } from "../../actions";
import { ImageManager } from "@/components/admin/image-manager";
import { getProductImages } from "../../image-actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [productResult, categories, brandsResult, images] = await Promise.all([
    getProductById(id),
    getCategories(),
    supabase.from("brands").select("id, name").eq("is_active", true).order("name"),
    getProductImages(id),
  ]);

  if (!productResult) notFound();

  const { data: fullProduct } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!fullProduct) notFound();

  const product = fullProduct as Record<string, unknown>;
  const brands = (brandsResult.data ?? []) as { id: string; name: string }[];

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateProduct(id, formData);
  }

  const productForForm = {
    ...productResult,
    specifications: (product.specifications as Record<string, string>) ?? null,
    regulatory_info: (product.regulatory_info as string) ?? null,
    brand_id: (product.brand_id as string) ?? null,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Modifica prodotto</h1>

      {/* ── Immagini ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ImageManager productId={id} initialImages={images} />
      </div>

      {/* ── Dati prodotto ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ProductForm
          product={productForForm}
          categories={categories}
          brands={brands}
          action={handleUpdate}
        />
      </div>
    </div>
  );
}
