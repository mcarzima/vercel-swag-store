export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-12 animate-pulse rounded bg-zinc-800" />
            {i < 3 && <div className="h-3 w-2 animate-pulse rounded bg-zinc-800" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-zinc-800" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-800" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-800" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-zinc-800" />
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 animate-pulse rounded-xl bg-zinc-800" />
            <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
