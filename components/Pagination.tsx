import Link from "next/link";
import type { PaginationMeta } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

interface PaginationProps {
  pagination: PaginationMeta;
  basePath: string;
  currentParams?: Record<string, string>;
}

function pageHref(
  basePath: string,
  page: number,
  params: Record<string, string>
): string {
  const p = new URLSearchParams(params);
  p.set("page", String(page));
  return `${basePath}?${p.toString()}`;
}

export default function Pagination({
  pagination,
  basePath,
  currentParams = {},
}: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  const { page, totalPages, hasPreviousPage, hasNextPage } = pagination;

  const pages: (number | "ellipsis")[] = [];
  const addPage = (p: number) => {
    if (!pages.includes(p)) pages.push(p);
  };

  addPage(1);
  if (page - 2 > 2) pages.push("ellipsis");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) addPage(i);
  if (page + 2 < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) addPage(totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={hasPreviousPage ? pageHref(basePath, page - 1, currentParams) : "#"}
        aria-disabled={!hasPreviousPage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
          hasPreviousPage
            ? "text-zinc-400 hover:bg-white/10 hover:text-white"
            : "pointer-events-none text-zinc-700"
        }`}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-zinc-600 text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p, currentParams)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-white text-zinc-900"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={hasNextPage ? pageHref(basePath, page + 1, currentParams) : "#"}
        aria-disabled={!hasNextPage}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
          hasNextPage
            ? "text-zinc-400 hover:bg-white/10 hover:text-white"
            : "pointer-events-none text-zinc-700"
        }`}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Link>
    </nav>
  );
}
