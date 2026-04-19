import { useCallback, useRef } from 'react';

import { buildOAuthAuthorizeUrl } from 'src/lib/api-client';

import type { OAuthProvider } from 'src/types/auth-types';

export interface UseOAuthAuthorizeReturn {
  /**
   * Kicks off OAuth by assigning `window.location.href`. The BE responds with
   * a 302 to the provider. `next` is an optional path the user should land on
   * after the full login round-trip.
   */
  startAuthorize: (provider: OAuthProvider, next?: string) => void;
}

export const useOAuthAuthorize = () => {
  const _return = useRef({} as UseOAuthAuthorizeReturn);

  const startAuthorize = useCallback((provider: OAuthProvider, next = '/discover') => {
    window.location.href = buildOAuthAuthorizeUrl(provider, next);
  }, []);

  _return.current.startAuthorize = startAuthorize;
  return _return.current;
};
