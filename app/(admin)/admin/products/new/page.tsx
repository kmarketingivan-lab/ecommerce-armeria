import { requireAdmin } from "@/lib/auth/helpers";
import { getCategories } from "@/lib/dal/categories";
import { ProductForm } from "../product-form";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuovo prodotto</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
