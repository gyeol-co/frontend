/**
 * Auth — shared types between FE and BE.
 *
 * Contract source: `docs/plans/auth/api-mapping.md` §B/§C/§D.
 */

export type OAuthProvider = 'kakao' | 'naver' | 'google';

export type ConsentKey = 'terms' | 'privacy' | 'age_14_plus' | 'marketing';
export type ConsentMethod = 'signup' | 'settings' | 're_consent';

export interface ConsentEntry {
  type: ConsentKey;
  /** FE hard-codes `'v1.0'` from `POLICY_TEXTS`. */
  policy_version: string;
  is_granted: boolean;
  /** Server forces `'signup'` regardless of request value. */
  method: ConsentMethod;
}

/**
 * Shared user shape. All user-returning endpoints (`/auth/me`, login, signup,
 * OAuth callback case A) wrap this in `{ data: { user: UserResponse }, meta }`.
 */
export interface UserResponse {
  /** UUID v7. */
  id: string;
  email: string;
  display_name: string;
  /** Style tags, empty array on fresh signup. */
  styles: string[];
  /** `password_hash IS NOT NULL`. OAuth-only accounts are false. */
  has_password: boolean;
  /** Linked OAuth providers, ordered by link creation. */
  oauth_providers: OAuthProvider[];
  /** ISO 8601 last-visited. `null` until first login. */
  visited: string | null;
  /** ISO 8601 account creation. */
  created: string;
}

export interface AuthMeResponseData {
  /** `null` when guest (FE converts 401 to this shape). */
  user: UserResponse | null;
}

export interface AuthSessionResponseData {
  user: UserResponse;
}

/**
 * Discriminated union on `status`. `logged_in` = session issued.
 * `needs_signup` = no session yet, FE must hand the `pending_token` back to `/auth/signup/oauth`.
 */
export type OAuthCallbackResponseData =
  | {
      status: 'logged_in';
      user: UserResponse;
      next: string;
    }
  | {
      status: 'needs_signup';
      pending_token: string;
      provider: OAuthProvider;
      provider_email: string;
      next: string;
    };

export interface LogoutResponseData {
  logged_out: true;
}

/**
 * FE request shapes — exported so API client functions can type their `body`.
 */
export interface EmailLoginRequestBody {
  email: string;
  password: string;
}

export interface EmailSignupRequestBody {
  email: string;
  password: string;
  display_name: string;
  consents: ConsentEntry[];
}

export interface OAuthSignupRequestBody {
  pending_token: string;
  display_name: string;
  consents: ConsentEntry[];
}

/**
 * Shape stored in `sessionStorage` between OAuth callback and signup completion.
 */
export interface PendingOAuthState {
  pending_token: string;
  provider: OAuthProvider;
  provider_email: string;
  next: string;
}
