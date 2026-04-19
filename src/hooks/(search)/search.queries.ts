import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

import { searchGet, searchSuggestionsGet } from 'src/lib/api-client';

import type { ProductCategory, NextPageParams } from 'src/types/product-types';
import type { SearchQuery, SearchSort } from 'src/types/search-types';

/**
 * Search queryOptions — `/search` infinite (products + brands embed) and
 * `/search/suggestions` single-shot.
 *
 * Cursor pagination is opaque: sort-specific keys (`cursor_score`,
 * `cursor_created`, `cursor_price`, `cursor_id`) ride through as-is from
 * `meta.next` — FE never parses the dict.
 *
 * `staleTime` defaults are inherited from `providers.tsx`. Short-lived search
 * results don't need a local override.
 */

export interface SearchInfiniteParams {
  q: string;
  sort: SearchSort;
  /** Repeat-encoded on the wire; sort before handing in to stabilise queryKey. */
  style: string[];
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
}

const DEFAULT_SEARCH_LIMIT = 24;

/**
 * Infinite query for the `/search` products grid + top-5 brands embed.
 *
 * Pass `enabled: q.length >= 2 && (priceMin == null || priceMax == null || priceMin <= priceMax)`
 * from the consumer — the query options themselves don't gate.
 *
 * `placeholderData: keepPreviousData` is set here so debounce-driven refetches
 * don't flash the grid.
 */
export const searchInfiniteQueryOptions = ({
  q,
  sort,
  style,
  category,
  priceMin,
  priceMax,
  limit = DEFAULT_SEARCH_LIMIT,
}: SearchInfiniteParams) => {
  const sortedStyle = [...style].sort();
  return infiniteQueryOptions({
    queryKey: [
      'search',
      'infinite',
      { q, sort, style: sortedStyle, category, priceMin, priceMax, limit },
    ] as const,
    queryFn: ({ pageParam, signal }) =>
      searchGet(
        {
          q,
          sort,
          style: sortedStyle,
          category,
          price_min: priceMin,
          price_max: priceMax,
          limit,
          ...(pageParam as Partial<SearchQuery>),
        },
        { signal },
      ),
    initialPageParam: {} as NextPageParams,
    getNextPageParam: (lastPage) => lastPage.nextPageParams ?? undefined,
    placeholderData: keepPreviousData,
  });
};

/**
 * `GET /search/suggestions` — empty-state hints. Guest/login agnostic from the
 * FE's side: BE returns `recent: []` for guests and the fixed `suggestions`
 * list for both.
 */
export const searchSuggestionsQueryOptions = () =>
  queryOptions({
    queryKey: ['search', 'suggestions'] as const,
    queryFn: ({ signal }) => searchSuggestionsGet({ signal }),
    staleTime: 5 * 60 * 1000,
  });
