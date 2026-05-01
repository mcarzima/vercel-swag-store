"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { PlusIcon, MinusIcon } from "@/components/icons";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  inStock: boolean;
  maxQuantity: number;
}

export default function AddToCartButton({
  productId,
  slug,
  inStock,
  maxQuantity,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, loading } = useCart();

  const handleAdd = async () => {
    await addItem(productId, slug, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={!inStock}
            className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="flex h-11 w-10 items-center justify-center text-sm font-medium text-zinc-100 select-none">
            {inStock ? quantity : 0}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={!inStock || quantity >= maxQuantity}
            className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={!inStock || loading}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          }`}
        >
          {loading ? "Adding…" : added ? "Added to cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
