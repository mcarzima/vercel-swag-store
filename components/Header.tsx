import Link from "next/link";
import HeaderNav from "./HeaderNav";

function VercelLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 76 65" fill="currentColor" aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#171719] border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <VercelLogo />
            Swag Store
          </Link>

          <HeaderNav />
        </div>
      </div>
    </header>
  );
}
