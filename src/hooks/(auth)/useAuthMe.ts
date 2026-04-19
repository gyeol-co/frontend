import { useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { authMeQueryOptions } from 'src/hooks/(auth)/auth.queries';

import type { UserResponse } from 'src/types/auth-types';

export interface UseAuthMeReturn {
  /** Current user, or null when guest / still loading. */
  user: UserResponse | null;
  /** Resolved guest state — `true` only after fetch settles with no user. */
  isGuest: boolean;
  isLoading: boolean;
}

/**
 * Derived session state. Wraps `authMeQueryOptions` and exposes `isGuest` so
 * consumers don't have to reconstruct `!isLoading && !user` at each call site.
 */
export const useAuthMe = () => {
  const _return = useRef({} as UseAuthMeReturn);
  const { data, isLoading } = useQuery(authMeQueryOptions);

  _return.current.user = data?.user ?? null;
  _return.current.isGuest = !isLoading && !data?.user;
  _return.current.isLoading = isLoading;
  return _return.current;
};
