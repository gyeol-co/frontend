import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { wishlistGet } from 'src/lib/api-client';

import type {
  NextPageParams,
  ProductCategory,
  WishlistQuery,
} from 'src/types/product-types';

/**
 * Wishlist queries. Pagination is offset-based (`skip/limit`) — the cap is 500
 * so `skip` stays shallow and offset pagination is safe.
 *
 * `useIsInWishlist` consumes the non-infinite form to derive a membership Set.
 */

export const wishlistListQueryOptions = (query: WishlistQuery = {}) =>
  queryOptions({
    queryKey: ['wishlist', 'list', query] as const,
    queryFn: ({ signal }) => wishlistGet(query, { signal }),
  });

export const wishlistListInfiniteQueryOptions = (category?: ProductCategory, limit = 100) =>
  infiniteQueryOptions({
    queryKey: ['wishlist', 'list', 'infinite', category, limit] as const,
    queryFn: ({ pageParam, signal }) =>
      wishlistGet(
        { category, limit, ...(pageParam as Partial<WishlistQuery>) },
        { signal },
      ),
    initialPageParam: { skip: 0 } as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
  });
