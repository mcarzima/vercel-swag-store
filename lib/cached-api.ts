"use cache";

import { cacheLife, cacheTag } from "next/cache";
import {
  listProducts,
  getProduct,
  getProductStock,
  listCategories,
  getActivePromotion,
} from "./api";
import type { ProductListParams } from "./types";

export async function cachedListProducts(params: ProductListParams = {}) {
  cacheLife("products");
  return listProducts(params);
}

export async function cachedGetProduct(slug: string) {
  cacheLife("products");
  return getProduct(slug);
}

export async function cachedGetProductStock(slug: string) {
  cacheLife("stock");
  cacheTag(`product-stock-${slug}`);
  return getProductStock(slug);
}

export async function cachedListCategories() {
  cacheLife("days");
  return listCategories();
}

export async function cachedGetActivePromotion() {
  cacheLife("minutes");
  return getActivePromotion();
}
