export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <div className="h-9 w-36 animate-pulse rounded-lg bg-zinc-800" />
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="flex flex-col gap-6">
            <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-zinc-800" />
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
