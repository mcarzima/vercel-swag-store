import type { Promotion } from "@/lib/types";
import { TagIcon } from "@/components/icons";

export default function PromotionBanner({ promotion }: { promotion: Promotion }) {
  return (
    <div className="bg-white text-zinc-900 px-4 py-3">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium text-center">
        <TagIcon className="h-4 w-4 shrink-0 text-zinc-600" />
        <span className="font-semibold">{promotion.title}:</span>
        <span className="text-zinc-600">{promotion.description}</span>
        <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-0.5 text-xs font-bold text-white tracking-widest">
          {promotion.code}
        </span>
      </div>
    </div>
  );
}
