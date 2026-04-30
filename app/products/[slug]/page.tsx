import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cachedGetProduct, cachedGetProductStock, cachedListProducts } from "@/lib/cached-api";
import StockBadge from "@/components/StockBadge";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  let page = 1;
  while (true) {
    const { products, pagination } = await cachedListProducts({ page, limit: 100 });
    slugs.push(...products.map((p) => ({ slug: p.slug })));
    if (!pagination.hasNextPage) break;
    page++;
  }
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await cachedGetProduct(slug);
    const description = product.description.slice(0, 160);
    return {
      title: product.name,
      description,
      openGraph: {
        title: `${product.name} | Vercel Swag Store`,
        description,
        images: product.images[0]
          ? [{ url: product.images[0], width: 1200, height: 1200, alt: product.name }]
          : [{ url: "/og-image.png", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: product.images[0] ? [product.images[0]] : ["/og-image.png"],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function ProductActionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-800" />
      <div className="flex gap-3">
        <div className="h-11 w-32 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}

async function ProductActions({ slug, productId }: { slug: string; productId: string }) {
  const stock = await cachedGetProductStock(slug);
  return (
    <div className="flex flex-col gap-4">
      <StockBadge stock={stock} />
      <AddToCartButton
        productId={productId}
        inStock={stock.inStock}
        maxQuantity={stock.stock}
      />
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await cachedGetProduct(slug);
  } catch {
    notFound();
  }

  const mainImage = product.images[0];
  const otherImages = product.images.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-zinc-300 transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/products/category/${product.category}`}
              className="hover:text-zinc-300 transition-colors"
        >
          {product.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-zinc-400 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600">No image</div>
            )}
          </div>
          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {otherImages.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Link
              href={`/products/category/${product.category}`}
              className="text-xs font-medium uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {product.category.replace("-", " ")}
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{product.name}</h1>
          </div>

          <span className="text-3xl font-bold text-white">
            {formatPrice(product.price, product.currency)}
          </span>

          <p className="text-zinc-400 leading-7">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Suspense fallback={<ProductActionsSkeleton />}>
              <ProductActions slug={slug} productId={product.id} />
            </Suspense>
          </div>

          <div className="border-t border-white/10 pt-4 text-xs text-zinc-600 space-y-1">
            <p>Product ID: {product.id}</p>
            <p>Added: {new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
