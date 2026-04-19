import { queryOptions } from '@tanstack/react-query';

import { authMeGet } from 'src/lib/api-client';

/**
 * Session probe. `authMeGet` catches 401 internally and resolves to
 * `{ user: null }`, so the query is always a resolved promise — never rejected
 * from normal guest state. Other 4xx/5xx still bubble.
 *
 * `staleTime` matches `api-mapping.md` §F.
 */
export const authMeQueryOptions = queryOptions({
  queryKey: ['auth', 'me'] as const,
  queryFn: ({ signal }) => authMeGet({ signal }),
  staleTime: 5 * 60 * 1000,
  retry: false,
});
