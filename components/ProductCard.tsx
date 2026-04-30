import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600 text-xs">
            No image
          </div>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-900 tracking-wide uppercase">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-zinc-500 capitalize">{product.category.replace("-", " ")}</span>
        <h3 className="font-medium text-zinc-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-sm font-semibold text-white">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
