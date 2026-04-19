import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import {
  brandDetailGet,
  brandIndexGet,
  brandProductsGet,
} from 'src/lib/api-client';

import type {
  BrandIndexQuery,
  BrandIndexSort,
  BrandProductsQuery,
} from 'src/types/brand-types';
import type { NextPageParams, ProductCategory } from 'src/types/product-types';

/**
 * Brand queryOptions — `/brands` Index + Featured shortlist, `/brands/{slug}`
 * Detail, and `/brands/{slug}/products` grid.
 *
 * Cursor pagination is opaque: sort-specific keys (`cursor_name`,
 * `cursor_product_added`, `cursor_is_featured`, `cursor_id`) are forwarded
 * as-is from `meta.next` — FE never parses the dict.
 *
 * `staleTime` is inherited from the global default in `providers.tsx`.
 */

export interface BrandIndexInfiniteParams {
  sort: BrandIndexSort;
  /** Multi-select style filter. Sort before handing in to keep queryKey stable. */
  style: string[];
  limit?: number;
}

const DEFAULT_INDEX_LIMIT = 24;
const DEFAULT_FEATURED_LIMIT = 4;

/**
 * Infinite query for the main Index grid. `style` is sorted inside to keep the
 * queryKey hash stable across different array reference identities.
 */
export const brandIndexInfiniteQueryOptions = ({
  sort,
  style,
  limit = DEFAULT_INDEX_LIMIT,
}: BrandIndexInfiniteParams) => {
  const sortedStyle = [...style].sort();
  return infiniteQueryOptions({
    queryKey: ['brands', 'index', 'infinite', { sort, style: sortedStyle, limit }] as const,
    queryFn: ({ pageParam, signal }) =>
      brandIndexGet(
        {
          sort,
          style: sortedStyle,
          limit,
          ...(pageParam as Partial<BrandIndexQuery>),
        },
        { signal },
      ),
    initialPageParam: {} as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
  });
};

export interface BrandFeaturedShortlistParams {
  limit?: number;
}

/**
 * Featured shortlist for the Index hero — single page of the featured sort.
 * Separate from `brandIndexInfiniteQueryOptions` because it uses `useQuery`
 * (no pagination) and a distinct queryKey to avoid store-type collisions.
 */
export const brandFeaturedShortlistQueryOptions = ({
  limit = DEFAULT_FEATURED_LIMIT,
}: BrandFeaturedShortlistParams = {}) =>
  queryOptions({
    queryKey: ['brands', 'index', 'featured-shortlist', { limit }] as const,
    queryFn: ({ signal }) =>
      brandIndexGet({ sort: 'featured', limit }, { signal }),
  });

/** `GET /brands/{slug}` — Detail body + related embed. No pagination. */
export const brandDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['brand', slug] as const,
    queryFn: ({ signal }) => brandDetailGet(slug, { signal }),
  });

export interface BrandProductsInfiniteParams {
  slug: string;
  category?: ProductCategory;
  limit?: number;
}

const DEFAULT_PRODUCTS_LIMIT = 24;

/**
 * Infinite query for the Detail page's "All items" grid. `(popularity, id)`
 * keyset — FE forwards whatever `meta.next` returns.
 */
export const brandProductsInfiniteQueryOptions = ({
  slug,
  category,
  limit = DEFAULT_PRODUCTS_LIMIT,
}: BrandProductsInfiniteParams) =>
  infiniteQueryOptions({
    queryKey: ['brand', slug, 'products', 'infinite', { category, limit }] as const,
    queryFn: ({ pageParam, signal }) =>
      brandProductsGet(
        slug,
        { category, limit, ...(pageParam as Partial<BrandProductsQuery>) },
        { signal },
      ),
    initialPageParam: {} as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
  });
