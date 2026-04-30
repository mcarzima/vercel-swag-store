import { notFound } from "next/navigation";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import type { Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

interface Props {
  page: number;
  category?: string;
  title?: string;
}

export default async function ProductListPage({ page, category, title }: Props) {
  const basePath = category ? `/products/category/${category}` : "/products";

  const [{ products, pagination }, categories] = await Promise.all([
    cachedListProducts({ page, limit: 20, category: category as Category | undefined }),
    cachedListCategories(),
  ]);

  if (page > pagination.totalPages && pagination.totalPages > 0) notFound();

  const resolvedTitle =
    title ??
    (category
      ? (categories.find((c) => c.slug === category)?.name ?? category)
      : "Shop");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white capitalize">{resolvedTitle}</h1>
        <p className="text-zinc-400">
          {page > 1 && (
            <span>Page {page} of {pagination.totalPages} &middot; </span>
          )}
          {pagination.total} product{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <SearchBar category={category} />
            <CategoryFilter categories={categories} activeCategory={category} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            emptyMessage={category ? "No products in this category." : "No products available."}
          />
          {pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination pagination={pagination} basePath={basePath} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
