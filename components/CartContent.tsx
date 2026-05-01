"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { PlusIcon, MinusIcon, TrashIcon, SpinnerIcon } from "@/components/icons";

function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function CartContent() {
  const { cart, loading, error, updateItem, removeItem } = useCart();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleUpdate = async (productId: string, slug: string, quantity: number) => {
    setPendingId(productId);
    await updateItem(productId, slug, quantity);
    setPendingId(null);
  };

  const handleRemove = async (productId: string, slug: string) => {
    setPendingId(productId);
    await removeItem(productId, slug);
    setPendingId(null);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
        <p className="text-zinc-400 max-w-sm">
          Looks like you haven&apos;t added anything yet. Browse our store and find something you love.
        </p>
        <Link
          href="/products"
          className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0">
          <ul className="divide-y divide-white/5">
            {cart.items.map((item) => {
              const isPending = pendingId === item.productId;
              return (
                <li
                  key={item.productId}
                  className={`flex gap-4 py-6 transition-opacity duration-150 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Link href={`/products/${item.product.slug}`} className="shrink-0">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-zinc-900">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-zinc-600 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-zinc-100 hover:text-white leading-snug line-clamp-2 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId, item.product.slug)}
                        disabled={loading}
                        className="shrink-0 rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-zinc-500 capitalize">
                      {item.product.category.replace("-", " ")}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {formatPrice(item.product.price, item.product.currency)} each
                    </span>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              handleRemove(item.productId, item.product.slug);
                            } else {
                              handleUpdate(item.productId, item.product.slug, item.quantity - 1);
                            }
                          }}
                          disabled={loading}
                          className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-sm font-medium text-zinc-200 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdate(item.productId, item.product.slug, item.quantity + 1)}
                          disabled={loading}
                          className="flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="flex h-6 w-16 items-center justify-end text-sm font-semibold text-white">
                        {isPending ? (
                          <SpinnerIcon className="h-4 w-4 animate-spin text-zinc-400" />
                        ) : (
                          formatPrice(item.lineTotal, item.product.currency)
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-20 rounded-2xl bg-zinc-900 border border-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-2 text-zinc-400">
                  <span className="truncate">
                    {item.product.name}
                    {item.quantity > 1 && (
                      <span className="text-zinc-600"> ×{item.quantity}</span>
                    )}
                  </span>
                  <span className="shrink-0">{formatPrice(item.lineTotal, item.product.currency)}</span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal, cart.currency)}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Shipping and taxes calculated at checkout</p>

            <button
              className="mt-6 w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
              onClick={() => alert("Checkout not implemented in this demo.")}
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="mt-3 flex items-center justify-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
