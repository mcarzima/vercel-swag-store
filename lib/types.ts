export type Category =
  | "bottles"
  | "cups"
  | "mugs"
  | "desk"
  | "stationery"
  | "accessories"
  | "bags"
  | "hats"
  | "t-shirts"
  | "hoodies"
  | "socks"
  | "tech"
  | "books";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Price in cents */
  price: number;
  currency: string;
  category: Category;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface StockInfo {
  productId: string;
  /** Current stock quantity — dynamic on every request */
  stock: number;
  inStock: boolean;
  /** True when stock is between 1 and 5 */
  lowStock: boolean;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  productCount: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  /** price * quantity in cents */
  lineTotal: number;
}

export interface Cart {
  token: string;
  items: CartItem[];
  totalItems: number;
  /** Total in cents */
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiListSuccess<T> {
  success: true;
  data: T[];
  meta: { pagination: PaginationMeta };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
export type ApiListResponse<T> = ApiListSuccess<T> | ApiError;

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: Category;
  search?: string;
  featured?: boolean;
}
