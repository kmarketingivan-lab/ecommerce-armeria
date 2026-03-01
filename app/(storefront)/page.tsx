import Link from "next/link";
import { getFeaturedProducts } from "@/lib/dal/products";
import { getCategoryTree } from "@/lib/dal/categories";
import { ProductCard } from "@/components/storefront/product-card";

export default async function HomePage() {
  const [featuredProducts, categoryTree] = await Promise.all([
    getFeaturedProducts(8),
    getCategoryTree(),
  ]);

  const activeCategories = categoryTree.filter((c) => c.is_active);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-red-600 sm:text-5xl lg:text-6xl">
              Benvenuto nel nostro negozio
            </h1>
            <p className="mt-4 text-lg text-neutral-300">
              Scopri la nostra selezione di prodotti di qualità. Ordina online o prenota un appuntamento.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-red-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-800"
              >
                Sfoglia il catalogo
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center rounded-full border-2 border-yellow-500 px-8 py-3 text-sm font-semibold text-yellow-500 hover:bg-yellow-500/10"
              >
                Prenota un appuntamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl uppercase text-red-700">Prodotti in evidenza</h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Vedi tutti &rarr;
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {activeCategories.length > 0 && (
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl uppercase text-red-700">Le nostre categorie</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {activeCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 text-center transition-shadow hover:shadow-lg hover:border-red-300"
                >
                  {category.image_url ? (
                    <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bookings CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-yellow-600 p-8 text-white sm:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Prenota un appuntamento</h2>
            <p className="mt-3 text-yellow-100">
              Scegli il servizio, seleziona la data e l&apos;orario che preferisci. Facile e veloce.
            </p>
            <Link
              href="/bookings"
              className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
            >
              Prenota ora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
