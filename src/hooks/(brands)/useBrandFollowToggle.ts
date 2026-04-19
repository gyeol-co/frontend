import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

import { brandFollowAdd, brandFollowRemove } from 'src/lib/api-client';

import { brandDetailQueryOptions } from 'src/hooks/(brands)/brand.queries';

import type {
  BrandDetail,
  BrandFollowResponse,
  BrandIndexItem,
  BrandIndexResponse,
} from 'src/types/brand-types';
import type { PaginatedResult } from 'src/types/product-types';

/**
 * Follow/unfollow toggle with optimistic cache patching.
 *
 * Optimistic update surfaces:
 *   - `['brand', slug]` single query — toggles `is_followed` and shifts
 *     `follower_count` ±1 by inferring from the current state (detail payload
 *     doesn't ship `follower_count` yet, but if/when it does the count is
 *     reconciled by `onSuccess` with the server number).
 *   - Every `['brands', 'index', 'infinite', ...]` infinite query — maps each
 *     page's `items[]` and flips `is_followed` for the matching slug.
 *   - Every `['brands', 'index', 'featured-shortlist', ...]` — same.
 *   - `related_brands[]` array inside any cached Brand Detail — same.
 *
 * Reconciliation: only `['brand', slug]` is invalidated after the server
 * commits. Index and featured caches keep the optimistic value (refetching
 * the whole paginated tree is expensive; `is_followed` is per-user state and
 * stays in sync via this hook).
 *
 * Error handling (code-specific toast/redirect) lives in the component — this
 * hook surfaces `ApiError` via the returned mutation.
 */

type ToggleVariables = {
  slug: string;
  isCurrentlyFollowed: boolean;
};

interface OptimisticSnapshot {
  // Detail query snapshots by `['brand', slug]`.
  detailEntries: Array<[readonly unknown[], BrandDetail | undefined]>;
  // Index infinite-query snapshots — stores the original `InfiniteData`.
  indexEntries: Array<[readonly unknown[], InfiniteData<PaginatedResult<BrandIndexResponse>> | undefined]>;
  // Featured shortlist snapshots — `useQuery` result of `PaginatedResult<BrandIndexResponse>`.
  featuredEntries: Array<[readonly unknown[], PaginatedResult<BrandIndexResponse> | undefined]>;
}

const toggleBrandIndexItem = (item: BrandIndexItem, slug: string, nextIsFollowed: boolean): BrandIndexItem =>
  item.slug === slug ? { ...item, is_followed: nextIsFollowed } : item;

export const useBrandFollowToggle = () => {
  const queryClient = useQueryClient();

  return useMutation<BrandFollowResponse, Error, ToggleVariables, OptimisticSnapshot>({
    mutationFn: ({ slug, isCurrentlyFollowed }) =>
      isCurrentlyFollowed ? brandFollowRemove(slug) : brandFollowAdd(slug),

    onMutate: async ({ slug, isCurrentlyFollowed }) => {
      const nextIsFollowed = !isCurrentlyFollowed;

      // Cancel any in-flight refetches that would clobber our optimistic patch.
      await queryClient.cancelQueries({ queryKey: ['brand', slug] });
      await queryClient.cancelQueries({ queryKey: ['brands', 'index'] });

      // Snapshot every affected cache entry before we mutate anything.
      const detailEntries = queryClient.getQueriesData<BrandDetail>({ queryKey: ['brand', slug] });
      const indexEntries = queryClient.getQueriesData<InfiniteData<PaginatedResult<BrandIndexResponse>>>({
        queryKey: ['brands', 'index', 'infinite'],
      });
      const featuredEntries = queryClient.getQueriesData<PaginatedResult<BrandIndexResponse>>({
        queryKey: ['brands', 'index', 'featured-shortlist'],
      });

      // Patch the seed brand's detail cache.
      for (const [key, value] of detailEntries) {
        if (!value) continue;
        queryClient.setQueryData<BrandDetail>(key, {
          ...value,
          is_followed: nextIsFollowed,
          related_brands: value.related_brands.map((b) => toggleBrandIndexItem(b, slug, nextIsFollowed)),
        });
      }

      // Also flip the seed slug inside any *other* cached Detail's
      // `related_brands[]`. A sibling brand page might have this brand listed.
      const otherDetailEntries = queryClient.getQueriesData<BrandDetail>({ queryKey: ['brand'] });
      for (const [key, value] of otherDetailEntries) {
        // Skip the seed slug detail — already patched above.
        if (!value || value.slug === slug) continue;
        const hasSlug = value.related_brands.some((b) => b.slug === slug);
        if (!hasSlug) continue;
        queryClient.setQueryData<BrandDetail>(key, {
          ...value,
          related_brands: value.related_brands.map((b) => toggleBrandIndexItem(b, slug, nextIsFollowed)),
        });
      }

      // Patch every paginated Index grid.
      for (const [key, value] of indexEntries) {
        if (!value) continue;
        queryClient.setQueryData<InfiniteData<PaginatedResult<BrandIndexResponse>>>(key, {
          ...value,
          pages: value.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((item) => toggleBrandIndexItem(item, slug, nextIsFollowed)),
            },
          })),
        });
      }

      // Patch the Featured shortlist(s).
      for (const [key, value] of featuredEntries) {
        if (!value) continue;
        queryClient.setQueryData<PaginatedResult<BrandIndexResponse>>(key, {
          ...value,
          data: {
            ...value.data,
            items: value.data.items.map((item) => toggleBrandIndexItem(item, slug, nextIsFollowed)),
          },
        });
      }

      return { detailEntries, indexEntries, featuredEntries };
    },

    onError: (_err, _variables, context) => {
      if (!context) return;
      for (const [key, value] of context.detailEntries) {
        queryClient.setQueryData(key, value);
      }
      for (const [key, value] of context.indexEntries) {
        queryClient.setQueryData(key, value);
      }
      for (const [key, value] of context.featuredEntries) {
        queryClient.setQueryData(key, value);
      }
    },

    onSettled: (_data, _err, { slug }) => {
      // Reconcile Detail cache with server state (authoritative follower_count
      // if present). Index + Featured keep the optimistic value — follow state
      // is per-user, not expected to drift.
      void queryClient.invalidateQueries({ queryKey: brandDetailQueryOptions(slug).queryKey });
    },
  });
};
