import type {
  Product,
  StockInfo,
  CategoryInfo,
  Promotion,
  Cart,
  StoreConfig,
  ApiResponse,
  ApiListResponse,
  ProductListParams,
  PaginationMeta,
} from "./types";

const BASE_URL = process.env.SWAG_API_BASE_URL!;
const BYPASS_TOKEN = process.env.SWAG_API_BYPASS_TOKEN!;

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ success: false, error: { code: "UNKNOWN", message: res.statusText } }));
    throw new ApiError(err.error?.code ?? "UNKNOWN", err.error?.message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function listProducts(params: ProductListParams = {}): Promise<{
  products: Product[];
  pagination: PaginationMeta;
}> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.featured !== undefined) query.set("featured", String(params.featured));

  const qs = query.toString();
  const data = await apiFetch<ApiListResponse<Product>>(
    `/products${qs ? `?${qs}` : ""}`
  );

  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return { products: data.data, pagination: data.meta.pagination };
}

export async function getProduct(idOrSlug: string): Promise<Product> {
  const data = await apiFetch<ApiResponse<Product>>(`/products/${idOrSlug}`);
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function getProductStock(idOrSlug: string): Promise<StockInfo> {
  const data = await apiFetch<ApiResponse<StockInfo>>(`/products/${idOrSlug}/stock`);
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function listCategories(): Promise<CategoryInfo[]> {
  const data = await apiFetch<ApiListResponse<CategoryInfo>>("/categories");
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function getActivePromotion(): Promise<Promotion> {
  const data = await apiFetch<ApiResponse<Promotion>>("/promotions");
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const data = await apiFetch<ApiResponse<StoreConfig>>("/store/config");
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function createCartOnServer(): Promise<{ cart: Cart; token: string }> {
  const res = await fetch(`${BASE_URL}/cart/create`, {
    method: "POST",
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
    },
  });
  const cartToken = res.headers.get("x-cart-token") ?? "";
  const data: ApiResponse<Cart> = await res.json();
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return { cart: data.data, token: cartToken };
}

export async function getCartOnServer(cartToken: string): Promise<Cart> {
  const data = await apiFetch<ApiResponse<Cart>>("/cart", {
    headers: { "x-cart-token": cartToken },
  });
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function addItemOnServer(
  cartToken: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  const data = await apiFetch<ApiResponse<Cart>>("/cart", {
    method: "POST",
    headers: { "x-cart-token": cartToken },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function updateItemOnServer(
  cartToken: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  const data = await apiFetch<ApiResponse<Cart>>(`/cart/${itemId}`, {
    method: "PATCH",
    headers: { "x-cart-token": cartToken },
    body: JSON.stringify({ quantity }),
  });
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}

export async function removeItemOnServer(
  cartToken: string,
  itemId: string
): Promise<Cart> {
  const data = await apiFetch<ApiResponse<Cart>>(`/cart/${itemId}`, {
    method: "DELETE",
    headers: { "x-cart-token": cartToken },
  });
  if (!data.success) throw new ApiError(data.error.code, data.error.message);
  return data.data;
}
