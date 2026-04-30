import type { Metadata } from "next";
import ProductListPage from "@/components/ProductListPage";

const description = "Browse the full Vercel Swag Store catalog of developer apparel, accessories, and gear.";

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

export default function ProductsPage() {
  return <ProductListPage page={1} />;
}
