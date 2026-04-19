/**
 * Brand — shared types between FE and BE.
 *
 * Contract source: `docs/plans/brand/api-mapping.md` §B.
 * Keep in sync with `app/backend/schemas/brand.py`.
 */

import type { ProductCategory, ProductListItem } from 'src/types/product-types';

export type BrandIndexSort = 'alpha' | 'featured' | 'recent';

/**
 * Rich brand card DTO — used by Index grid, Featured shortlist, Detail body,
 * and Detail `related_brands` embed. Identical shape across every endpoint.
 *
 * - `cover_url` / `logo_url` — absolute CDN URLs, null-able. When `cover_url`
 *   is null, FE renders a slug-hash stripe placeholder (`brand-cover-stripe.ts`).
 * - `is_followed` — always `false` for guests.
 * - `product_added` — ISO 8601 when the brand last got a new product, or null.
 */
export interface BrandIndexItem {
  id: string;
  slug: string;
  name: string;
  name_ko: string | null;
  logo_url: string | null;
  cover_url: string | null;
  platform: string | null;
  styles: string[];
  is_featured: boolean;
  is_followed: boolean;
  product_count: number;
  new_count: number;
  product_added: string | null;
}

/**
 * Detail body — `BrandIndexItem` + description / website_url / related embed.
 */
export interface BrandDetail extends BrandIndexItem {
  description: string | null;
  website_url: string | null;
  related_brands: BrandIndexItem[];
}

export interface BrandIndexResponse {
  items: BrandIndexItem[];
}

export interface BrandProductsResponse {
  items: ProductListItem[];
  /** Brand-wide total (ignores `category` filter). */
  count_total: number;
  /** Per-category counts — 5 keys always present, 0-filled when absent. */
  count_by_category: Record<ProductCategory, number>;
}

/** Follow POST / DELETE symmetric response. */
export interface BrandFollowResponse {
  brand_id: string;
  slug: string;
  is_followed: boolean;
  follower_count: number;
}

/**
 * Index query params. `style` is serialised with repeat (`?style=a&style=b`).
 * Cursor fields get forwarded verbatim from `meta.next` — no client-side parse.
 */
export interface BrandIndexQuery {
  sort?: BrandIndexSort;
  style?: string[];
  limit?: number;
  cursor_name?: string;
  cursor_product_added?: string;
  cursor_is_featured?: boolean;
  cursor_id?: string;
}

export interface BrandProductsQuery {
  category?: ProductCategory;
  limit?: number;
  cursor_popularity?: number;
  cursor_id?: string;
}
