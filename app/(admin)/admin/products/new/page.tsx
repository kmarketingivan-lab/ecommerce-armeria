import { requireAdmin } from "@/lib/auth/helpers";
import { getCategories } from "@/lib/dal/categories";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../product-form";
import { createProduct } from "../actions";
import { ImageIcon } from "lucide-react";

export default async function NewProductPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [categories, brandsResult] = await Promise.all([
    getCategories(),
    supabase.from("brands").select("id, name").eq("is_active", true).order("name"),
  ]);

  const brands = (brandsResult.data ?? []) as { id: string; name: string }[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuovo prodotto</h1>

      {/* Info immagini */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <ImageIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-800">
          <strong>Immagini:</strong> dopo aver salvato il prodotto, apri la pagina di modifica per caricare e gestire le immagini.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ProductForm categories={categories} brands={brands} action={createProduct} />
      </div>
    </div>
  );
}
