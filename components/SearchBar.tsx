"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { MagnifyingGlassIcon } from "@/components/icons";

export default function SearchBar({
  defaultValue = "",
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const search = (fd.get("search") as string).trim();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      const basePath = category ? `/products/category/${category}` : "/products";
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${basePath}?${qs}` : basePath);
      });
    },
    [router, searchParams, category]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-4 w-4 text-zinc-500" />
      </div>
      <input
        type="search"
        name="search"
        defaultValue={defaultValue}
        placeholder="Search products…"
        className="w-full rounded-lg border border-white/10 bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
      />
    </form>
  );
}
