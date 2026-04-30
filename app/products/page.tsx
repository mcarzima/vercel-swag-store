import { Suspense } from "react";
import { listProducts, listCategories } from "@/lib/api";
import type { Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

import type { Metadata } from "next";

const description = "Browse and search the full Vercel Swag Store catalog of developer apparel, accessories, and gear.";

export const metadata: Metadata = {
  title: "Search",
  description,
  openGraph: {
    title: "Search Products | Vercel Swag Store",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Products | Vercel Swag Store",
    description,
  },
};

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  featured?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const category = params.category as Category | undefined;
  const search = params.search;

  const [{ products, pagination }, categories] = await Promise.all([
    listProducts({ page, category, search, limit: 20 }),
    listCategories(),
  ]);

  const currentParams: Record<string, string> = {};
  if (category) currentParams.category = category;
  if (search) currentParams.search = search;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Shop</h1>
        <p className="text-zinc-400">
          {pagination.total} product{pagination.total !== 1 ? "s" : ""}
          {category ? ` in ${category.replace("-", " ")}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />}>
              <SearchBar defaultValue={search} />
            </Suspense>
            <CategoryFilter
              categories={categories}
              activeCategory={category}
              searchQuery={search}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid products={products} emptyMessage="No products match your filters." />

          {pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                pagination={pagination}
                basePath="/products"
                currentParams={currentParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
