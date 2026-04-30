import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export async function generateStaticParams() {
  const { pagination } = await cachedListProducts({ page: 1, limit: 20 });
  return Array.from({ length: pagination.totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const description = "Browse the full Vercel Swag Store catalog of developer apparel, accessories, and gear.";
  return {
    title: `Shop — Page ${page}`,
    description,
    openGraph: {
      title: `Shop — Page ${page} | Vercel Swag Store`,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Shop — Page ${page} | Vercel Swag Store`,
      description,
    },
  };
}

export default async function ProductsPageN({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageStr } = await params;
  const page = Number(pageStr);

  if (page === 1) redirect("/products");
  if (!Number.isInteger(page) || page < 1) notFound();

  const [{ products, pagination }, categories] = await Promise.all([
    cachedListProducts({ page, limit: 20 }),
    cachedListCategories(),
  ]);

  if (page > pagination.totalPages) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Shop</h1>
        <p className="text-zinc-400">
          Page {page} of {pagination.totalPages} &middot; {pagination.total} product{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            <SearchBar />
            <CategoryFilter categories={categories} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid products={products} emptyMessage="No products available." />
          {pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination pagination={pagination} basePath="/products" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
