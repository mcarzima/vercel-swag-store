import Link from "next/link";
import type { CategoryInfo } from "@/lib/types";

interface CategoryFilterProps {
  categories: CategoryInfo[];
  activeCategory?: string;
  searchQuery?: string;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  searchQuery,
}: CategoryFilterProps) {
  const baseHref = (slug?: string) => {
    const base = slug ? `/products/category/${slug}` : "/products";
    return searchQuery ? `${base}?search=${encodeURIComponent(searchQuery)}` : base;
  };

  return (
    <nav aria-label="Product categories">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Categories
      </h2>
      <ul className="space-y-0.5">
        <li>
          <Link
            href={baseHref()}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              !activeCategory
                ? "bg-white/10 text-white font-medium"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            <span>All</span>
            <span className="text-xs text-zinc-500">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={baseHref(cat.slug)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                activeCategory === cat.slug
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-zinc-500">{cat.productCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
