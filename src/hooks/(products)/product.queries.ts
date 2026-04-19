import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import {
  productDetailGet,
  productRelatedGet,
  productsFollowingGet,
  productsForYouGet,
  productsGet,
} from 'src/lib/api-client';

import type {
  ForYouQuery,
  NextPageParams,
  ProductFeedQuery,
  ProductFeedTab,
} from 'src/types/product-types';

/**
 * `queryOptions` for the product feed tabs.
 *
 * - Popular / New both use the same route (`GET /products`) with `tab` as
 *   a discriminator; Popular returns `(cursor_popularity, cursor_id)`, New
 *   returns `(cursor_id)`. We don't try to normalize those shapes — FE
 *   spreads `meta.next` verbatim into the next request.
 * - For You: mode-aware. First page drives whether affinity or popular_fallback
 *   is active, and subsequent pages reuse whatever cursor shape the BE returned.
 * - Following: not paginated.
 *
 * `staleTime` is inherited from the global default in `providers.tsx`.
 */

/** Single-page query — useful for server-prefetch or `/saved` page header probes. */
export const productFeedQueryOptions = (query: ProductFeedQuery) =>
  queryOptions({
    queryKey: ['products', 'feed', query] as const,
    queryFn: ({ signal }) => productsGet(query, { signal }),
  });

/**
 * Infinite query for Popular / New. `getNextPageParam` returns the raw dict
 * the BE sent — TanStack forwards it to the next `queryFn` as `pageParam`.
 * When `meta.next` is `null`, `hasNextPage` becomes false.
 */
export const productFeedInfiniteQueryOptions = (tab: ProductFeedTab, limit = 20) =>
  infiniteQueryOptions({
    queryKey: ['products', 'feed', 'infinite', tab, limit] as const,
    queryFn: ({ pageParam, signal }) =>
      productsGet(
        { tab, limit, ...(pageParam as Partial<ProductFeedQuery>) },
        { signal },
      ),
    initialPageParam: {} as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
  });

/** Infinite query for For You. Mode lives in `data.mode` on each page. */
export const productForYouInfiniteQueryOptions = (limit = 20) =>
  infiniteQueryOptions({
    queryKey: ['products', 'foryou', 'infinite', limit] as const,
    queryFn: ({ pageParam, signal }) =>
      productsForYouGet(
        { limit, ...(pageParam as Partial<ForYouQuery>) },
        { signal },
      ),
    initialPageParam: {} as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
  });

/** `GET /products/following` — no pagination. */
export const productFollowingQueryOptions = queryOptions({
  queryKey: ['products', 'following'] as const,
  queryFn: ({ signal }) => productsFollowingGet({ signal }),
});

export const productDetailQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ['product', productId] as const,
    queryFn: ({ signal }) => productDetailGet(productId, { signal }),
  });

export const productRelatedQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: ['product', productId, 'related'] as const,
    queryFn: ({ signal }) => productRelatedGet(productId, { signal }),
  });
