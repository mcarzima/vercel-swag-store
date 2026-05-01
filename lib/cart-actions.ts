"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  createCartOnServer,
  getCartOnServer,
  addItemOnServer,
  updateItemOnServer,
  removeItemOnServer,
} from "./api";
import type { Cart } from "./types";

const COOKIE = "swag_cart_token";
const MAX_AGE = 60 * 60 * 24;

async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

async function setToken(token: string): Promise<void> {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

async function clearToken(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

async function ensureToken(): Promise<string> {
  const existing = await getToken();
  if (existing) return existing;
  const { token } = await createCartOnServer();
  await setToken(token);
  return token;
}

export async function createCartAction(): Promise<Cart> {
  const { cart, token } = await createCartOnServer();
  await setToken(token);
  return cart;
}

export async function getCartAction(): Promise<Cart | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await getCartOnServer(token);
  } catch {
    await clearToken();
    return null;
  }
}

export async function addItemAction(productId: string, quantity: number): Promise<Cart> {
  const token = await ensureToken();
  try {
    const cart = await addItemOnServer(token, productId, quantity);
    revalidateTag("stock", "max");
    return cart;
  } catch (err) {
    await clearToken();
    throw err;
  }
}

export async function updateItemAction(itemId: string, quantity: number): Promise<Cart> {
  const token = await getToken();
  if (!token) throw new Error("No active cart");
  try {
    const cart = await updateItemOnServer(token, itemId, quantity);
    revalidateTag("stock", "max");
    return cart;
  } catch (err) {
    await clearToken();
    throw err;
  }
}

export async function removeItemAction(itemId: string): Promise<Cart> {
  const token = await getToken();
  if (!token) throw new Error("No active cart");
  try {
    const cart = await removeItemOnServer(token, itemId);
    revalidateTag("stock", "max");
    return cart;
  } catch (err) {
    await clearToken();
    throw err;
  }
}
