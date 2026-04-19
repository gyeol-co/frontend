import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { PaginatedResult, WishlistListResponse } from 'src/types/product-types';

/**
 * O(1) membership lookup against the wishlist cache.
 *
 * We scan every `wishlist/list/*` query (both `wishlistListQueryOptions` and
 * `wishlistListInfiniteQueryOptions`) and collect product ids from whichever
 * pages React Query happens to have cached. That gives toggle chips and
 * "Save" buttons a cheap source of truth without re-fetching anything.
 *
 * Falls back to the product's own `is_wishlisted` when the page hasn't loaded
 * the wishlist yet (e.g. Discover visited before Saved).
 */

interface WishlistQueryData {
  data: WishlistListResponse;
  nextPageParams: unknown;
}

interface WishlistInfiniteQueryData {
  pages: WishlistQueryData[];
}

const isPaginatedResult = (v: unknown): v is PaginatedResult<WishlistListResponse> =>
  typeof v === 'object' && v !== null && 'data' in v && 'nextPageParams' in v;

const isInfiniteData = (v: unknown): v is WishlistInfiniteQueryData =>
  typeof v === 'object' && v !== null && 'pages' in v && Array.isArray((v as WishlistInfiniteQueryData).pages);

export const useIsInWishlist = (productId: string, fallback = false): boolean => {
  const queryClient = useQueryClient();

  const savedIds = useMemo(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.findAll({ queryKey: ['wishlist', 'list'] });

    const set = new Set<string>();
    for (const q of queries) {
      const data = q.state.data;

      if (isInfiniteData(data)) {
        for (const page of data.pages) {
          for (const item of page.data.items) set.add(item.id);
        }
        continue;
      }

      if (isPaginatedResult(data)) {
        for (const item of data.data.items) set.add(item.id);
      }
    }
    return set;
  }, [queryClient]);

  if (savedIds.has(productId)) return true;
  if (savedIds.size === 0) return fallback;
  return false;
};
