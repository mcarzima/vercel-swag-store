import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListProducts, cachedListCategories } from "@/lib/cached-api";
import ProductListPage from "@/components/ProductListPage";

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

  const categories = await cachedListCategories();
  if (!categories.find((c) => c.slug === category)) notFound();

  return <ProductListPage page={page} category={category} />;
}
