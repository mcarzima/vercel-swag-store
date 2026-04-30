import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedListCategories } from "@/lib/cached-api";
import ProductListPage from "@/components/ProductListPage";

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = await cachedListCategories();
  if (!categories.find((c) => c.slug === category)) notFound();

  return <ProductListPage page={1} category={category} />;
}
