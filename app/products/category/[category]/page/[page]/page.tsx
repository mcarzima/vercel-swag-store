import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import type { Category } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export async function generateStaticParams() {
  const categories = await cachedListCategories();
  const results = await Promise.all(
    categories.map(async (cat) => {
      const { pagination } = await cachedListProducts({
        category: cat.slug,
        page: 1,
        limit: 20,
      });
      return Array.from({ length: pagination.totalPages - 1 }, (_, i) => ({
        category: cat.slug,
        page: String(i + 2),
      }));
    })
  );
  return results.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page } = await params;
  const categories = await cachedListCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };
  const title = `${cat.name} — Page ${page}`;
  const description = `Shop ${cat.name} in the Vercel Swag Store, page ${page}.`;
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

export default async function CategoryPageN({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page: pageStr } = await params;
  const page = Number(pageStr);

  if (page === 1) redirect(`/products/category/${category}`);
  if (!Number.isInteger(page) || page < 1) notFound();

  const [{ products, pagination }, categories] = await Promise.all([
    cachedListProducts({ page, category: category as Category, limit: 20 }),
    cachedListCategories(),
  ]);

  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  if (page > pagination.totalPages) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white capitalize">{cat.name}</h1>
        <p className="text-zinc-400">
          Page {page} of {pagination.totalPages} &middot; {pagination.total} product{pagination.total !== 1 ? "s" : ""}
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
          <ProductGrid products={products} emptyMessage="No products in this category." />
          {pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                pagination={pagination}
                basePath={`/products/category/${category}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
