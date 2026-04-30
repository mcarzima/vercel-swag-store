import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">404</p>
      <h1 className="text-4xl font-bold text-white sm:text-5xl">Page not found</h1>
      <p className="text-zinc-400 max-w-md text-lg">
        We couldn&apos;t find the page you&apos;re looking for. It may have moved or no longer exists.
      </p>
      <div className="flex gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Browse the shop
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
