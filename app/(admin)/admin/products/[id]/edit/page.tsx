import { requireAdmin } from "@/lib/auth/helpers";
import { getProductById } from "@/lib/dal/products";
import { getCategories } from "@/lib/dal/categories";
import { ProductForm } from "../../product-form";
import { updateProduct } from "../../actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateProduct(id, formData);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Modifica prodotto</h1>
      <ProductForm product={product} categories={categories} action={handleUpdate} />
    </div>
  );
}
