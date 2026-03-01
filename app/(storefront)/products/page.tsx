import Link from "next/link";
import { getProducts } from "@/lib/dal/products";
import { getCategories } from "@/lib/dal/categories";
import { ProductCard } from "@/components/storefront/product-card";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params["page"] ?? 1);
  const search = typeof params["search"] === "string" ? params["search"] : "";
  const categorySlug = typeof params["category"] === "string" ? params["category"] : "";
  const sortBy = typeof params["sort"] === "string" ? params["sort"] : "created_at";
  const sortOrder = typeof params["order"] === "string" ? params["order"] : "desc";

  const categories = await getCategories();
  const activeCategories = categories.filter((c) => c.is_active);
  const selectedCategory = categorySlug
    ? activeCategories.find((c) => c.slug === categorySlug)
    : null;

  const opts: Parameters<typeof getProducts>[0] = {
    page,
    perPage: 12,
    isActive: true,
  };
  if (search) opts.search = search;
  if (selectedCategory) opts.categoryId = selectedCategory.id;
  if (sortBy === "name" || sortBy === "price" || sortBy === "created_at") {
    opts.sortBy = sortBy;
  }
  if (sortOrder === "asc" || sortOrder === "desc") {
    opts.sortOrder = sortOrder;
  }

  const { data: products, count } = await getProducts(opts);
  const totalPages = Math.ceil(count / 12);

  /** Build URL with updated params */
  function buildUrl(overrides: Record<string, string>): string {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (categorySlug) p.set("category", categorySlug);
    if (sortBy !== "created_at") p.set("sort", sortBy);
    if (sortOrder !== "desc") p.set("order", sortOrder);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold uppercase text-red-700">Catalogo</h1>

      {/* Filters bar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* Search */}
        <form action="/products" method="GET" className="flex-1">
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Cerca prodotti..."
            className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </form>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Ordina:</span>
          <Link
            href={buildUrl({ sort: "created_at", order: "desc", page: "" })}
            className={`rounded px-2 py-1 ${sortBy === "created_at" ? "bg-red-50 text-red-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            Recenti
          </Link>
          <Link
            href={buildUrl({ sort: "price", order: "asc", page: "" })}
            className={`rounded px-2 py-1 ${sortBy === "price" && sortOrder === "asc" ? "bg-red-50 text-red-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            Prezzo &uarr;
          </Link>
          <Link
            href={buildUrl({ sort: "price", order: "desc", page: "" })}
            className={`rounded px-2 py-1 ${sortBy === "price" && sortOrder === "desc" ? "bg-red-50 text-red-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            Prezzo &darr;
          </Link>
          <Link
            href={buildUrl({ sort: "name", order: "asc", page: "" })}
            className={`rounded px-2 py-1 ${sortBy === "name" ? "bg-red-50 text-red-700 font-semibold" : "hover:bg-gray-100"}`}
          >
            Nome
          </Link>
        </div>
      </div>

      {/* Category filter */}
      {activeCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildUrl({ category: "", page: "" })}
            className={`rounded-full px-3 py-1 text-sm ${!categorySlug ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Tutti
          </Link>
          {activeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.slug, page: "" })}
              className={`rounded-full px-3 py-1 text-sm ${categorySlug === cat.slug ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Results info */}
      <p className="mt-6 text-sm text-gray-500">
        {count} prodott{count === 1 ? "o" : "i"} trovati
        {search && <> per &ldquo;{search}&rdquo;</>}
        {selectedCategory && <> in {selectedCategory.name}</>}
      </p>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-500">
          <p className="text-lg">Nessun prodotto trovato</p>
          <Link href="/products" className="mt-2 inline-block text-sm text-red-600 hover:underline">
            Mostra tutti i prodotti
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Precedente
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev !== undefined && p - prev > 1;
              return (
                <span key={p}>
                  {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                  <Link
                    href={buildUrl({ page: String(p) })}
                    className={`rounded-lg px-3 py-2 text-sm ${p === page ? "bg-red-700 text-white" : "border border-gray-300 hover:bg-gray-50"}`}
                  >
                    {p}
                  </Link>
                </span>
              );
            })}
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Successiva
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
