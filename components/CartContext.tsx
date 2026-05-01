"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Cart } from "@/lib/types";
import {
  getCartAction,
  addItemAction,
  updateItemAction,
  removeItemAction,
} from "@/lib/cart-actions";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (productId: string, slug: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, slug: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string, slug: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCartAction();
      setCart(data);
    } catch {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId: string, slug: string, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await addItemAction(productId, slug, quantity);
      setCart(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add item");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId: string, slug: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateItemAction(itemId, slug, quantity);
      setCart(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update item");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string, slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await removeItemAction(itemId, slug);
      setCart(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove item");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, loading, error, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
