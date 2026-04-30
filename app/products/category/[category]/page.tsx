import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import type { Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export async function generateStaticParams() {
  const categories = await cachedListCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categories = await cachedListCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };
  const title = cat.name;
  const description = `Shop ${cat.name} in the Vercel Swag Store. ${cat.productCount} product${cat.productCount !== 1 ? "s" : ""} available.`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Vercel Swag Store`,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Vercel Swag Store`,
      description,
    },
  };
}

interface SearchParams {
  page?: string;
  search?: string;
}

async function SearchBarWrapper({
  searchParams,
  category,
}: {
  searchParams: Promise<SearchParams>;
  category: string;
}) {
  const params = await searchParams;
  return <SearchBar defaultValue={params.search} category={category} />;
}

async function ProductResults({
  searchParams,
  category,
}: {
  searchParams: Promise<SearchParams>;
  category: string;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search;
  const { products, pagination } = await cachedListProducts({
    page,
    category: category as Category,
    search,
    limit: 20,
  });
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
            basePath={`/products/category/${category}`}
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;
  const categories = await cachedListCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white capitalize mb-8">{cat.name}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />}>
              <SearchBarWrapper searchParams={searchParams} category={category} />
            </Suspense>
            <CategoryFilter
              categories={categories}
              activeCategory={category}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductResultsSkeleton />}>
            <ProductResults searchParams={searchParams} category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
