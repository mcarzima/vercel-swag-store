"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-2xl font-bold text-white">Failed to load product</h2>
      <p className="text-zinc-400 max-w-sm">
        We couldn&apos;t load this product. It may no longer be available.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
