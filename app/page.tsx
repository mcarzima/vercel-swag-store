"use cache";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cachedGetActivePromotion, cachedListProducts } from "@/lib/cached-api";
import type { Promotion, Product } from "@/lib/types";
import PromotionBanner from "@/components/PromotionBanner";
import ProductGrid from "@/components/ProductGrid";

const description =
  "Official Vercel merchandise. Premium developer apparel, accessories, and gear for builders who ship.";

export const metadata: Metadata = {
  title: "Home",
  description,
  openGraph: {
    title: "Vercel Swag Store — Official Merchandise",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Swag Store — Official Merchandise",
    description,
  },
};

function HeroMosaic({ products }: { products: Product[] }) {
  const tiles = Array.from({ length: 4 }, (_, i) => products[i] ?? null);

  return (
    <div className="hidden sm:grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
      {tiles.map((product, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-xl bg-zinc-800"
        >
          {product?.images[0] ? (
            <Link href={`/products/${product.slug}`} className="block h-full w-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
          ) : (
            <div className="h-full w-full bg-zinc-800" />
          )}
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  let promotion: Promotion | null = null;
  let featuredProducts: Product[] = [];

  await Promise.all([
    cachedGetActivePromotion()
      .then((p) => {
        promotion = p;
      })
      .catch(() => {}),
    cachedListProducts({ featured: true, limit: 8 })
      .then(({ products }) => {
        featuredProducts = products;
      })
      .catch(() => {}),
  ]);

  return (
    <>
      {promotion && <PromotionBanner promotion={promotion} />}

      <section className="bg-[#171719] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <svg
                  width="28"
                  height="24"
                  viewBox="0 0 76 65"
                  fill="white"
                  aria-hidden
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Official Merchandise
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Gear up. <br className="hidden sm:block" />
                Ship faster.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-zinc-400">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                >
                  Featured Items
                </Link>
              </div>
            </div>

            <HeroMosaic products={featuredProducts} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          <Link
            href="/products"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            View all →
          </Link>
        </div>
        <ProductGrid
          products={featuredProducts}
          emptyMessage="No featured products available."
        />
      </section>
    </>
  );
}
