/**
 * Search — shared types between FE and BE.
 *
 * Contract source: `docs/plans/search/api-mapping.md` §B.
 * Keep in sync with `app/backend/schemas/search.py`.
 */

import type { BrandIndexItem } from 'src/types/brand-types';
import type { ProductCategory, ProductListItem } from 'src/types/product-types';

export type SearchSort = 'relevance' | 'recent' | 'price_asc' | 'price_desc';

export type SearchDegradedReason = 'embedding_unavailable' | 'sort_not_relevance';

/** Pipeline applied / degrade observability — FE toast is driven from `degraded_reason`. */
export interface SearchMetaInfo {
  fts_applied: boolean;
  embedding_applied: boolean;
  /** null when every stage ran normally. */
  degraded_reason: SearchDegradedReason | null;
}

/**
 * `GET /search` response body. Products + brands embed in a single request.
 * `brands` has top-5 on page 1 and `[]` on subsequent pages.
 */
export interface SearchResponseData {
  /** BE-normalised query echo. Used for "‘{query}'에 대한 결과가 없어요" message. */
  query: string;
  /** Sort that BE actually applied (request default echoed back as `relevance`). */
  sort: SearchSort;
  products: {
    items: ProductListItem[];
    /** Pre-rerank candidate count. Debug/analytics only — UI uses accumulated items.length. */
    total_candidates: number;
  };
  brands: BrandIndexItem[];
  meta_info: SearchMetaInfo;
}

/**
 * `GET /search/suggestions` response body. Guest sees `recent: []` +
 * BE-provided `suggestions`; logged-in sees last 5 distinct queries + the
 * same fixed `suggestions`.
 */
export interface SearchSuggestionsResponseData {
  recent: string[];
  suggestions: string[];
}

/**
 * Query params forwarded to `GET /search`. Cursor fields are opaque — FE
 * spreads `meta.next` as-is. Only one sort-scoped cursor pair is ever
 * populated at a time (enforced by BE).
 */
export interface SearchQuery {
  q: string;
  sort?: SearchSort;
  category?: ProductCategory;
  /** Wire encoding: repeat param `?style=a&style=b`. */
  style?: string[];
  price_min?: number;
  price_max?: number;
  limit?: number;
  /** sort=relevance */
  cursor_score?: number;
  /** sort=recent — ISO 8601 */
  cursor_created?: string;
  /** sort=price_asc / price_desc */
  cursor_price?: number;
  /** All sorts — tie-breaker. */
  cursor_id?: string;
}
