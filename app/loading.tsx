export default function HomeLoading() {
  return (
    <>
      <div className="bg-[#171719] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="h-4 w-36 animate-pulse rounded bg-zinc-800" />
              <div className="flex flex-col gap-3">
                <div className="h-12 w-3/4 animate-pulse rounded-xl bg-zinc-800" />
                <div className="h-12 w-1/2 animate-pulse rounded-xl bg-zinc-800" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
              </div>
              <div className="flex gap-3">
                <div className="h-11 w-40 animate-pulse rounded-xl bg-zinc-800" />
                <div className="h-11 w-36 animate-pulse rounded-xl bg-zinc-800" />
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-zinc-800" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-zinc-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
