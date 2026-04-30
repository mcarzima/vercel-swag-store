import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListProducts } from "@/lib/cached-api";
import ProductListPage from "@/components/ProductListPage";

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

  return <ProductListPage page={page} />;
}
