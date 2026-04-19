/**
 * Error codes surfaced by the backend envelope (`meta.error.code`).
 * Source of truth: `docs/plans/auth/api-mapping.md` §E.
 *
 * NOTE: union over enum (see rules/frontend/typescript.md). Unknown codes are
 * passed through as plain string — FE defaults to generic toast.
 */
export type AuthErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DEACTIVATED'
  | 'CONSENT_REQUIRED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'OAUTH_ALREADY_LINKED'
  | 'OAUTH_STATE_MISMATCH'
  | 'OAUTH_USER_DENIED'
  | 'OAUTH_PROVIDER_ERROR'
  | 'PENDING_TOKEN_INVALID'
  | 'PENDING_TOKEN_EXPIRED'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMITED'
  /** FE-synthesised when fetch itself throws (offline / DNS / CORS). */
  | 'NETWORK_ERROR';

/**
 * Discover / Wishlist error codes. `api-mapping.md` §G.
 * Shared with auth codes via `ApiErrorCode`.
 */
export type DiscoverErrorCode =
  | 'PRODUCT_NOT_FOUND'
  | 'WISHLIST_FULL';

/**
 * Brand error codes. `docs/plans/brand/api-mapping.md` §G.
 * `AUTH_REQUIRED` / `ACCOUNT_DEACTIVATED` / `VALIDATION_ERROR` reuse existing
 * auth codes.
 */
export type BrandErrorCode = 'BRAND_NOT_FOUND';

/** Union of every code FE branches on. Unknown codes fall through as string. */
export type ApiErrorCode = AuthErrorCode | DiscoverErrorCode | BrandErrorCode;

/**
 * Envelope-embedded error. `detail_payload` is free-form and schema-less
 * at the type level — consumers narrow ad-hoc.
 */
export interface ApiErrorEnvelope {
  code: string;
  detail_payload?: Record<string, unknown>;
}
