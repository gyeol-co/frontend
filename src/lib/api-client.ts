/**
 * Fetch wrapper for the gyeol backend.
 *
 * - Always `credentials: 'include'` so the `session` cookie rides along.
 * - Reads envelope `{ data, meta }`; throws `ApiError` on non-2xx.
 * - `authMeGet` special-cases 401 → `{ user: null }` (guest is a normal state).
 */

import type { ApiErrorEnvelope } from 'src/lib/error-codes';
import type {
  AuthMeResponseData,
  AuthSessionResponseData,
  EmailLoginRequestBody,
  EmailSignupRequestBody,
  LogoutResponseData,
  OAuthCallbackResponseData,
  OAuthProvider,
  OAuthSignupRequestBody,
} from 'src/types/auth-types';
import type {
  ForYouFeedResponse,
  ForYouQuery,
  FollowingFeedResponse,
  NextPageParams,
  PaginatedResult,
  ProductDetail,
  ProductFeedQuery,
  ProductFeedResponse,
  RelatedResponse,
  WishlistListResponse,
  WishlistQuery,
  WishlistToggleResponse,
} from 'src/types/product-types';
import type {
  BrandDetail,
  BrandFollowResponse,
  BrandIndexQuery,
  BrandIndexResponse,
  BrandProductsQuery,
  BrandProductsResponse,
} from 'src/types/brand-types';
import type {
  SearchQuery,
  SearchResponseData,
  SearchSuggestionsResponseData,
} from 'src/types/search-types';

const DEFAULT_API_URL = 'http://localhost:8000';

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;

interface StandardEnvelopeMeta {
  request_id: string;
  /**
   * Opaque next-page dict. FE spreads into the next query string as-is
   * (see `docs/plans/discover/api-mapping.md` §D). `null` on final page
   * and on endpoints that are not paginated.
   */
  next?: NextPageParams | null;
  error?: ApiErrorEnvelope | null;
}

interface StandardEnvelope<T> {
  data: T | null;
  meta: StandardEnvelopeMeta;
}

interface ApiErrorParams {
  code: string;
  status: number;
  requestId: string;
  detailPayload?: Record<string, unknown>;
  message?: string;
}

/**
 * Thrown for every non-2xx API response and for network failures. Carries
 * the envelope error code so callers (mutations, OAuth callback page, etc.)
 * can branch on specific error codes.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string;
  readonly detailPayload?: Record<string, unknown>;

  constructor({ code, status, requestId, detailPayload, message }: ApiErrorParams) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.detailPayload = detailPayload;
  }
}

interface FetchOptions {
  signal?: AbortSignal;
}

interface RequestInitExtra extends FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

const fetchEnvelope = async <T>(path: string, init: RequestInitExtra): Promise<StandardEnvelope<T>> => {
  const url = `${getApiBaseUrl()}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      method: init.method,
      credentials: 'include',
      headers: init.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: init.signal,
    });
  } catch (err) {
    // AbortError — let it propagate so React Query's cancellation works.
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError({
      code: 'NETWORK_ERROR',
      status: 0,
      requestId: 'n/a',
      message: err instanceof Error ? err.message : 'Network error',
    });
  }

  let parsed: StandardEnvelope<T> | null = null;
  try {
    parsed = (await response.json()) as StandardEnvelope<T>;
  } catch {
    // Non-JSON body — fall through to error with synthetic envelope.
    parsed = null;
  }

  const requestId = parsed?.meta?.request_id ?? 'unknown';

  if (!response.ok) {
    const err = parsed?.meta?.error;
    throw new ApiError({
      code: err?.code ?? 'INTERNAL_ERROR',
      status: response.status,
      requestId,
      detailPayload: err?.detail_payload,
    });
  }

  if (!parsed) {
    throw new ApiError({
      code: 'INTERNAL_ERROR',
      status: response.status,
      requestId: 'unknown',
      message: 'Empty or invalid response body',
    });
  }

  return parsed;
};

const unwrap = <T>(envelope: StandardEnvelope<T>): T => {
  if (envelope.data === null) {
    throw new ApiError({
      code: envelope.meta.error?.code ?? 'INTERNAL_ERROR',
      status: 200,
      requestId: envelope.meta.request_id,
      detailPayload: envelope.meta.error?.detail_payload,
    });
  }
  return envelope.data;
};

/**
 * `GET /auth/me`. Resolves to `{ user: null }` on 401 (guest is a normal state —
 * see api-mapping.md §D.1). Other error codes still throw.
 */
export const authMeGet = async ({ signal }: FetchOptions = {}): Promise<AuthMeResponseData> => {
  try {
    const envelope = await fetchEnvelope<AuthMeResponseData>('/auth/me', { method: 'GET', signal });
    return unwrap(envelope);
  } catch (err) {
    if (err instanceof ApiError && err.code === 'AUTH_REQUIRED') return { user: null };
    throw err;
  }
};

export const authLoginEmailPost = async (
  body: EmailLoginRequestBody,
  { signal }: FetchOptions = {},
): Promise<AuthSessionResponseData> => {
  const envelope = await fetchEnvelope<AuthSessionResponseData>('/auth/login/email', {
    method: 'POST',
    body,
    signal,
  });
  return unwrap(envelope);
};

export const authSignupEmailPost = async (
  body: EmailSignupRequestBody,
  { signal }: FetchOptions = {},
): Promise<AuthSessionResponseData> => {
  const envelope = await fetchEnvelope<AuthSessionResponseData>('/auth/signup/email', {
    method: 'POST',
    body,
    signal,
  });
  return unwrap(envelope);
};

interface OAuthCallbackParams {
  code: string;
  state: string;
  error?: string | null;
}

export const authOAuthCallbackGet = async (
  provider: OAuthProvider,
  { code, state, error }: OAuthCallbackParams,
  { signal }: FetchOptions = {},
): Promise<OAuthCallbackResponseData> => {
  const q = new URLSearchParams({ code, state });
  if (error) q.set('error', error);
  const envelope = await fetchEnvelope<OAuthCallbackResponseData>(
    `/auth/oauth/${provider}/callback?${q.toString()}`,
    { method: 'GET', signal },
  );
  return unwrap(envelope);
};

export const authSignupOAuthPost = async (
  body: OAuthSignupRequestBody,
  { signal }: FetchOptions = {},
): Promise<AuthSessionResponseData> => {
  const envelope = await fetchEnvelope<AuthSessionResponseData>('/auth/signup/oauth', {
    method: 'POST',
    body,
    signal,
  });
  return unwrap(envelope);
};

export const authLogoutPost = async ({ signal }: FetchOptions = {}): Promise<LogoutResponseData> => {
  const envelope = await fetchEnvelope<LogoutResponseData>('/auth/logout', { method: 'POST', signal });
  return unwrap(envelope);
};

/**
 * Not a fetch — returns the absolute URL the browser must redirect to so the
 * backend can 302 to the provider. Callers use `window.location.href = ...`.
 */
export const buildOAuthAuthorizeUrl = (provider: OAuthProvider, next?: string): string => {
  const q = new URLSearchParams();
  if (next) q.set('next', next);
  const qs = q.toString();
  return `${getApiBaseUrl()}/auth/oauth/${provider}/authorize${qs ? `?${qs}` : ''}`;
};

/**
 * Builds `?k=v&k2=v2…` — drops `undefined` / `null`. For simple flat dicts only.
 * Arrays are out of scope for the current discover endpoints.
 */
const buildQueryString = (params: Record<string, unknown>): string => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
};

// ─────────────────────────────────────────────────────
// Discover — Products
// ─────────────────────────────────────────────────────

/**
 * `GET /products?tab=popular|new`. Guest OK. Paginated:
 * - popular: `(cursor_popularity, cursor_id)` keyset
 * - new: `cursor_id` only keyset
 *
 * Returns the feed body plus raw `meta.next` for `useInfiniteQuery`.
 */
export const productsGet = async (
  query: ProductFeedQuery,
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<ProductFeedResponse>> => {
  const envelope = await fetchEnvelope<ProductFeedResponse>(
    `/products${buildQueryString({
      tab: query.tab,
      cursor_popularity: query.cursor_popularity,
      cursor_id: query.cursor_id,
      limit: query.limit,
    })}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

/**
 * `GET /products/foryou`. Auth required. `data.mode` is either `affinity` or
 * `popular_fallback`; FE renders a banner based on the first page's mode and
 * keeps passing the same cursor shape on subsequent pages.
 */
export const productsForYouGet = async (
  query: ForYouQuery,
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<ForYouFeedResponse>> => {
  const envelope = await fetchEnvelope<ForYouFeedResponse>(
    `/products/foryou${buildQueryString({
      limit: query.limit,
      cursor_rank: query.cursor_rank,
      cursor_popularity: query.cursor_popularity,
      cursor_id: query.cursor_id,
    })}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

/** `GET /products/following`. Auth required. No pagination — single payload. */
export const productsFollowingGet = async (
  { signal }: FetchOptions = {},
): Promise<FollowingFeedResponse> => {
  const envelope = await fetchEnvelope<FollowingFeedResponse>('/products/following', {
    method: 'GET',
    signal,
  });
  return unwrap(envelope);
};

/**
 * `GET /products/{id}`. Guest OK. BE records a view event automatically
 * for authenticated callers — FE makes no extra call.
 */
export const productDetailGet = async (
  productId: string,
  { signal }: FetchOptions = {},
): Promise<ProductDetail> => {
  const envelope = await fetchEnvelope<ProductDetail>(`/products/${productId}`, {
    method: 'GET',
    signal,
  });
  return unwrap(envelope);
};

/** `GET /products/{id}/related`. LIMIT 4 fixed on the server. */
export const productRelatedGet = async (
  productId: string,
  { signal }: FetchOptions = {},
): Promise<RelatedResponse> => {
  const envelope = await fetchEnvelope<RelatedResponse>(`/products/${productId}/related`, {
    method: 'GET',
    signal,
  });
  return unwrap(envelope);
};

// ─────────────────────────────────────────────────────
// Wishlist
// ─────────────────────────────────────────────────────

/**
 * `GET /wishlist`. Auth required. Offset-paginated with `skip/limit` — returns
 * rich product items with `is_wishlisted: true` and a `saved_at` timestamp.
 */
export const wishlistGet = async (
  query: WishlistQuery,
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<WishlistListResponse>> => {
  const envelope = await fetchEnvelope<WishlistListResponse>(
    `/wishlist${buildQueryString({
      category: query.category,
      skip: query.skip,
      limit: query.limit,
    })}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

/**
 * `POST /wishlist/{product_id}`. Idempotent — repeated calls return the same
 * `wishlist_count` (no double-add).
 */
export const wishlistAddPost = async (
  productId: string,
  { signal }: FetchOptions = {},
): Promise<WishlistToggleResponse> => {
  const envelope = await fetchEnvelope<WishlistToggleResponse>(`/wishlist/${productId}`, {
    method: 'POST',
    signal,
  });
  return unwrap(envelope);
};

/**
 * `DELETE /wishlist/{product_id}`. Idempotent — 200 even if the row did not
 * exist; `wishlist_count` reflects the post-delete total.
 */
export const wishlistRemoveDelete = async (
  productId: string,
  { signal }: FetchOptions = {},
): Promise<WishlistToggleResponse> => {
  const envelope = await fetchEnvelope<WishlistToggleResponse>(`/wishlist/${productId}`, {
    method: 'DELETE',
    signal,
  });
  return unwrap(envelope);
};

// ─────────────────────────────────────────────────────
// Brand
// ─────────────────────────────────────────────────────

/**
 * Builds the Index query string. `style` is encoded as repeat params
 * (`?style=a&style=b`) — matches BE `List[str]` parsing and the contract
 * in `docs/plans/brand/api-mapping.md` §C.B1. Other keys go through as-is.
 *
 * `undefined`/`null` values are dropped. Booleans serialise to `"true"`/`"false"`.
 */
const buildBrandIndexQueryString = (query: BrandIndexQuery): string => {
  const q = new URLSearchParams();
  if (query.sort !== undefined) q.set('sort', query.sort);
  if (query.style !== undefined) {
    for (const s of query.style) q.append('style', s);
  }
  if (query.limit !== undefined) q.set('limit', String(query.limit));
  if (query.cursor_name !== undefined) q.set('cursor_name', query.cursor_name);
  if (query.cursor_product_added !== undefined) q.set('cursor_product_added', query.cursor_product_added);
  if (query.cursor_is_featured !== undefined) q.set('cursor_is_featured', String(query.cursor_is_featured));
  if (query.cursor_id !== undefined) q.set('cursor_id', query.cursor_id);
  const s = q.toString();
  return s ? `?${s}` : '';
};

/**
 * `GET /brands` — Index grid + Featured shortlist share the same endpoint.
 * Guest OK. Paginated via sort-specific keyset cursors; FE forwards `meta.next`
 * untouched (see api-mapping.md §D).
 */
export const brandIndexGet = async (
  query: BrandIndexQuery = {},
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<BrandIndexResponse>> => {
  const envelope = await fetchEnvelope<BrandIndexResponse>(
    `/brands${buildBrandIndexQueryString(query)}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

/**
 * `GET /brands/{slug}` — Detail body including 0~3 `related_brands` embed.
 * Throws `ApiError { code: 'BRAND_NOT_FOUND' }` on 404 (slug absent or
 * `is_active=false`).
 */
export const brandDetailGet = async (
  slug: string,
  { signal }: FetchOptions = {},
): Promise<BrandDetail> => {
  const envelope = await fetchEnvelope<BrandDetail>(`/brands/${slug}`, {
    method: 'GET',
    signal,
  });
  return unwrap(envelope);
};

/**
 * `GET /brands/{slug}/products` — brand-scoped product grid with optional
 * `category` filter and `(popularity, id)` keyset pagination. Response
 * includes `count_total` and `count_by_category` for tab labels (§C.B3).
 */
export const brandProductsGet = async (
  slug: string,
  query: BrandProductsQuery = {},
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<BrandProductsResponse>> => {
  const envelope = await fetchEnvelope<BrandProductsResponse>(
    `/brands/${slug}/products${buildQueryString({
      category: query.category,
      limit: query.limit,
      cursor_popularity: query.cursor_popularity,
      cursor_id: query.cursor_id,
    })}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

// ─────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────

/**
 * Builds the Search query string. `style` is repeat-encoded to match BE
 * `List[str]` parsing (same regime as brand index, see
 * `docs/plans/search/api-mapping.md` §C). Cursor keys are forwarded verbatim
 * from a previous `meta.next` dict — only the sort-relevant pair is ever set.
 */
const buildSearchQueryString = (query: SearchQuery): string => {
  const q = new URLSearchParams();
  q.set('q', query.q);
  if (query.sort !== undefined) q.set('sort', query.sort);
  if (query.category !== undefined) q.set('category', query.category);
  if (query.style !== undefined) {
    for (const s of query.style) q.append('style', s);
  }
  if (query.price_min !== undefined) q.set('price_min', String(query.price_min));
  if (query.price_max !== undefined) q.set('price_max', String(query.price_max));
  if (query.limit !== undefined) q.set('limit', String(query.limit));
  if (query.cursor_score !== undefined) q.set('cursor_score', String(query.cursor_score));
  if (query.cursor_created !== undefined) q.set('cursor_created', query.cursor_created);
  if (query.cursor_price !== undefined) q.set('cursor_price', String(query.cursor_price));
  if (query.cursor_id !== undefined) q.set('cursor_id', query.cursor_id);
  return `?${q.toString()}`;
};

/**
 * `GET /search` — hybrid search. Guest OK. Products are cursor-paginated
 * (sort-scoped keyset); brands are top-5 on the first page and `[]` on later
 * pages. `data.meta_info.degraded_reason` exposes embedding degrade.
 */
export const searchGet = async (
  query: SearchQuery,
  { signal }: FetchOptions = {},
): Promise<PaginatedResult<SearchResponseData>> => {
  const envelope = await fetchEnvelope<SearchResponseData>(
    `/search${buildSearchQueryString(query)}`,
    { method: 'GET', signal },
  );
  return { data: unwrap(envelope), nextPageParams: envelope.meta.next ?? null };
};

/**
 * `GET /search/suggestions` — empty-state helper. Guest gets `recent: []`
 * + BE-provided fixed `suggestions`; logged-in adds up to 5 distinct
 * recent queries (30-day window).
 */
export const searchSuggestionsGet = async (
  { signal }: FetchOptions = {},
): Promise<SearchSuggestionsResponseData> => {
  const envelope = await fetchEnvelope<SearchSuggestionsResponseData>(
    '/search/suggestions',
    { method: 'GET', signal },
  );
  return unwrap(envelope);
};

/**
 * `POST /brands/{slug}/follow`. Auth required. Idempotent — repeated calls
 * return the same `is_followed=true` / `follower_count` (no double count).
 */
export const brandFollowAdd = async (
  slug: string,
  { signal }: FetchOptions = {},
): Promise<BrandFollowResponse> => {
  const envelope = await fetchEnvelope<BrandFollowResponse>(`/brands/${slug}/follow`, {
    method: 'POST',
    signal,
  });
  return unwrap(envelope);
};

/**
 * `DELETE /brands/{slug}/follow`. Auth required. Idempotent — 200 even when
 * no follow row existed. Unlike wishlist DELETE, 404 on unknown/inactive slug.
 */
export const brandFollowRemove = async (
  slug: string,
  { signal }: FetchOptions = {},
): Promise<BrandFollowResponse> => {
  const envelope = await fetchEnvelope<BrandFollowResponse>(`/brands/${slug}/follow`, {
    method: 'DELETE',
    signal,
  });
  return unwrap(envelope);
};
