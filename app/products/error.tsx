"use client";

import { useEffect } from "react";

export default function ProductsError({
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
      <h2 className="text-2xl font-bold text-white">Failed to load products</h2>
      <p className="text-zinc-400 max-w-sm">
        We couldn&apos;t fetch the product catalog. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
