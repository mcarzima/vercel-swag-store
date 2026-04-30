import { Suspense } from "react";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

const description = "Browse and search the full Vercel Swag Store catalog of developer apparel, accessories, and gear.";

export const metadata: Metadata = {
  title: "Shop",
  description,
  openGraph: {
    title: "Shop | Vercel Swag Store",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Vercel Swag Store",
    description,
  },
};

interface SearchParams {
  page?: string;
  search?: string;
}

async function SearchBarWrapper({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return <SearchBar defaultValue={params.search} />;
}

async function ProductResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search;
  const { products, pagination } = await cachedListProducts({ page, search, limit: 20 });
  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  return (
    <>
      <p className="text-zinc-400 mb-6">
        {pagination.total} product{pagination.total !== 1 ? "s" : ""}
        {search ? ` matching "${search}"` : ""}
      </p>
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
    </>
  );
}

function ProductResultsSkeleton() {
  return (
    <>
      <div className="h-4 w-40 animate-pulse rounded bg-zinc-800 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const categories = await cachedListCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Shop</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />}>
              <SearchBarWrapper searchParams={searchParams} />
            </Suspense>
            <CategoryFilter categories={categories} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductResultsSkeleton />}>
            <ProductResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
