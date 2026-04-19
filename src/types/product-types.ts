/**
 * Discover — shared types between FE and BE.
 *
 * Contract source: `docs/plans/discover/api-mapping.md` §B.
 * Keep in sync with `app/backend/schemas/discover.py`.
 */

export type ProductCategory = 'outer' | 'top' | 'bottom' | 'acc' | 'shoes';

/** List-embedded brand summary. Populated on every product list item. */
export interface BrandSummary {
  id: string;
  slug: string;
  name: string;
  name_ko: string | null;
  /** Absolute CDN URL. */
  logo_url: string | null;
  /** Source select-shop platform slug (e.g. `sculpstore`, `etcseoul`). */
  platform: string | null;
}

/**
 * Expanded brand payload used by Product Detail and Following section headers.
 * `product_added` is only populated on Following blocks (null on Detail).
 */
export interface BrandFull extends BrandSummary {
  description: string | null;
  website_url: string | null;
  is_followed: boolean;
  /** ISO 8601. Non-null only in Following response. */
  product_added: string | null;
}

/**
 * Rich list item — used by Popular / New / For You / Following / Wishlist / Related.
 *
 * - `rank` only present in For You affinity mode.
 * - `saved_at` only present on `/wishlist` response.
 */
export interface ProductListItem {
  id: string;
  url: string;
  brand: BrandSummary;
  name: string;
  description: string | null;
  thumbnail_url: string;
  image_urls: string[];
  category: ProductCategory;
  subcategory: string | null;
  sub_category_detail: string | null;
  styles: string[];
  fit: string | null;
  color: string | null;
  pattern: string | null;
  material: string[];
  details: string[];
  tags: string[];
  original_price: number;
  discounted_price: number | null;
  discount_rate: number;
  is_active: boolean;
  is_soldout: boolean;
  is_wishlisted: boolean;
  /** ISO 8601 created timestamp. */
  created: string;
  /** For You affinity mode only — internal sort rank from `user_product_affinity`. */
  rank?: number | null;
  /** Wishlist response only — ISO 8601 when user saved the product. */
  saved_at?: string | null;
}

export interface ProductStats {
  view_count_7d: number;
  wishlist_count: number;
}

export interface ProductDetail {
  id: string;
  url: string;
  brand: BrandFull;
  name: string;
  description: string | null;
  thumbnail_url: string;
  image_urls: string[];
  category: ProductCategory;
  subcategory: string | null;
  sub_category_detail: string | null;
  styles: string[];
  fit: string | null;
  color: string | null;
  pattern: string | null;
  material: string[];
  details: string[];
  tags: string[];
  original_price: number;
  discounted_price: number | null;
  discount_rate: number;
  is_active: boolean;
  is_soldout: boolean;
  is_wishlisted: boolean;
  created: string;
  stats: ProductStats;
}

/**
 * Wishlist item = list item + always-populated `saved_at`.
 * BE guarantees `is_wishlisted: true` on every row.
 */
export type WishlistItem = ProductListItem & { saved_at: string };

export interface FollowingBrandBlock {
  brand: BrandFull;
  new_count: number;
  items: ProductListItem[];
}

/** Feed payload returned by `GET /products?tab=...`. */
export interface ProductFeedResponse {
  items: ProductListItem[];
}

export type ForYouMode = 'affinity' | 'popular_fallback';

export interface ForYouFeedResponse {
  mode: ForYouMode;
  items: ProductListItem[];
}

export interface FollowingFeedResponse {
  total_new: number;
  brands: FollowingBrandBlock[];
}

export interface RelatedResponse {
  items: ProductListItem[];
}

export interface WishlistListResponse {
  count_total: number;
  count_by_category: Record<ProductCategory, number>;
  items: WishlistItem[];
}

export interface WishlistToggleResponse {
  product_id: string;
  is_wishlisted: boolean;
  wishlist_count: number;
}

/**
 * Query param shapes used by the api-client helpers.
 */
export type ProductFeedTab = 'popular' | 'new';

export interface ProductFeedQuery {
  tab: ProductFeedTab;
  cursor_popularity?: number;
  cursor_id?: string;
  limit?: number;
}

export interface ForYouQuery {
  cursor_rank?: number;
  cursor_popularity?: number;
  cursor_id?: string;
  limit?: number;
}

export interface WishlistQuery {
  category?: ProductCategory;
  skip?: number;
  limit?: number;
}

/**
 * `meta.next` in the envelope is an opaque key-value dict. FE spreads it
 * straight into the next request's query string — no parsing.
 *
 * Brand featured-sort cursors include a boolean `cursor_is_featured` flag.
 * Consumers forward values as-is; `URLSearchParams` coerces via `String(...)`.
 */
export type NextPageParams = Record<string, string | number | boolean>;

/**
 * Paginated api-client return — carries both the payload and the raw
 * `meta.next` dict. `useInfiniteQuery` consumes `nextPageParams` via
 * `getNextPageParam`.
 */
export interface PaginatedResult<T> {
  data: T;
  nextPageParams: NextPageParams | null;
}
