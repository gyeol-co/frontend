/**
 * Search sort options rendered by `SearchFilterBar`. Keep in sync with the
 * `SearchSort` union in `src/types/search-types.ts`.
 */

import type { SearchSort } from 'src/types/search-types';

export interface SearchSortOption {
  key: SearchSort;
  label: string;
}

export const SEARCH_SORT_OPTIONS: readonly SearchSortOption[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'recent', label: 'Recent' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
] as const;
