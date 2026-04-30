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
  cacheLife("minutes");
  cacheTag("products");
  return listProducts(params);
}

export async function cachedGetProduct(slug: string) {
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);
  return getProduct(slug);
}

export async function cachedGetProductStock(slug: string) {
  cacheLife("minutes");
  cacheTag(`product-stock-${slug}`);
  return getProductStock(slug);
}

export async function cachedListCategories() {
  cacheLife("days");
  cacheTag("categories");
  return listCategories();
}

export async function cachedGetActivePromotion() {
  cacheLife("minutes");
  cacheTag("promotions");
  return getActivePromotion();
}
