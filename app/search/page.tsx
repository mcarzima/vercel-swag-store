import { Suspense } from "react";
import type { Metadata } from "next";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import type { Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import SearchPageControls from "@/components/SearchPageControls";

const description = "Search the full Vercel Swag Store catalog of developer apparel, accessories, and gear.";

export const metadata: Metadata = {
  title: "Search",
  description,
  openGraph: {
    title: "Search | Vercel Swag Store",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search | Vercel Swag Store",
    description,
  },
};

interface SearchParams {
  search?: string;
  category?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search?.trim();
  const category = params.category as Category | undefined;
  const isDefaultState = !search;

  const [{ products }, categories] = await Promise.all([
    isDefaultState
      ? cachedListProducts({ featured: true, limit: 5 })
      : cachedListProducts({ search, category, limit: 5 }),
    cachedListCategories(),
  ]);

  const resultLabel = isDefaultState
    ? "Popular products"
    : products.length === 0
    ? `No results for "${search}"`
    : `${products.length} result${products.length !== 1 ? "s" : ""} for "${search}"${
        category ? ` in ${category.replace("-", " ")}` : ""
      }`;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
        <p className="text-zinc-500 text-sm">
          Search by name, description, or tags. Results update automatically as you type.
        </p>
      </div>

      <Suspense fallback={<div className="h-20 w-full animate-pulse rounded-xl bg-zinc-800" />}>
        <SearchPageControls
          categories={categories}
          defaultSearch={search ?? ""}
          defaultCategory={category ?? ""}
        />
      </Suspense>

      <div className="mt-8">
        <p className="text-sm text-zinc-500 mb-4">{resultLabel}</p>
        <ProductGrid
          products={products}
          emptyMessage={
            isDefaultState
              ? "No products available."
              : `No products found matching "${search}". Try a different search term.`
          }
        />
      </div>
    </div>
  );
}
