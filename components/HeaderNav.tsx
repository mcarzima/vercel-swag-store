"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { ShoppingCartIcon } from "@/components/icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
];

export default function HeaderNav() {
  const { cart } = useCart();
  const itemCount = cart?.totalItems ?? 0;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="hidden sm:flex items-center gap-6 text-sm text-white/70" aria-label="Main navigation">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`hover:text-white transition-colors ${pathname === href ? "text-white font-medium" : ""}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#171719] text-xs font-bold leading-none">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="sm:hidden flex items-center justify-center rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 border-t border-white/10 bg-[#171719] z-40">
          <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors flex items-center justify-between ${
                pathname === "/cart"
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#171719] text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
