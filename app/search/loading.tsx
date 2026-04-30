export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800 mb-2" />
        <div className="h-4 w-80 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-11 w-24 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-11 w-48 animate-pulse rounded-xl bg-zinc-800" />
      </div>

      <div className="h-4 w-32 animate-pulse rounded bg-zinc-800 mb-4" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
