"use client";

import { useEffect, useRef, useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@/components/icons";
import type { CategoryInfo } from "@/lib/types";

interface SearchPageControlsProps {
  categories: CategoryInfo[];
  defaultSearch?: string;
  defaultCategory?: string;
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function SearchPageControls({
  categories,
  defaultSearch = "",
  defaultCategory = "",
}: SearchPageControlsProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultSearch);
  const [category, setCategory] = useState(defaultCategory);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const categoryRef = useRef(category);

  const navigate = useCallback(
    (q: string, cat: string) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("search", q.trim());
      if (cat) params.set("category", cat);
      const qs = params.toString();
      startTransition(() => {
        router.push(`/search${qs ? `?${qs}` : ""}`);
      });
    },
    [router]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => {
        navigate(query, categoryRef.current);
      }, 400);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(query, category);
  };

  const handleCategoryChange = (cat: string) => {
    categoryRef.current = cat;
    setCategory(cat);
    navigate(query, cat);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={isPending}
          className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-white/30 focus:outline-none transition-colors disabled:opacity-60 sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Spinner />
          <span>Searching…</span>
        </div>
      )}
    </div>
  );
}
