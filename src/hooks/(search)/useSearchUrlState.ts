'use client';

import { useCallback, useMemo, useRef } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  parseSearchCategory,
  parseSearchPrice,
  parseSearchSort,
} from 'src/schemas/search-filters-schema';

import type { ProductCategory } from 'src/types/product-types';
import type { SearchSort } from 'src/types/search-types';

export interface UseSearchUrlStateReturn {
  /** Current `?q=` — empty string if absent. Min-length gating is the consumer's job. */
  q: string;
  /** Active sort — falls back to `'relevance'`. */
  sort: SearchSort;
  /** Single category filter or `null` when absent. */
  category: ProductCategory | null;
  /** Multi-select style filter (repeat param). */
  styles: string[];
  /** Optional KRW min price — `undefined` when absent or invalid. */
  priceMin: number | undefined;
  /** Optional KRW max price — `undefined` when absent or invalid. */
  priceMax: number | undefined;
  setQ: (q: string) => void;
  setSort: (sort: SearchSort) => void;
  setCategory: (category: ProductCategory | null) => void;
  setStyles: (styles: string[]) => void;
  setPrice: (min: number | undefined, max: number | undefined) => void;
  /** Resets sort/category/styles/price — keeps `q`. */
  clearFilters: () => void;
  /** Clears `q` as well (back to SearchEmptyState). */
  clearAll: () => void;
}

/**
 * URL-backed Search filter state. Keeps `/search?q=&sort=&category=&style=...
 * &price_min=&price_max=` in sync so deep-links and browser back/forward feel
 * natural. Cursor is intentionally not stored in the URL (first-page reset on
 * share is the expected behavior).
 */
export const useSearchUrlState = () => {
  const _return = useRef({} as UseSearchUrlStateReturn);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const sort = parseSearchSort(searchParams.get('sort'));
  const category = parseSearchCategory(searchParams.get('category'));

  const styles = useMemo(() => {
    return searchParams.getAll('style').filter((v) => v.length > 0);
  }, [searchParams]);

  const priceMin = parseSearchPrice(searchParams.get('price_min'));
  const priceMax = parseSearchPrice(searchParams.get('price_max'));

  const writeParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setQ = useCallback(
    (nextQ: string) => {
      writeParams((params) => {
        const trimmed = nextQ.trim();
        if (trimmed.length === 0) params.delete('q');
        else params.set('q', trimmed);
      });
    },
    [writeParams],
  );

  const setSort = useCallback(
    (nextSort: SearchSort) => {
      writeParams((params) => {
        // Default `relevance` represented by absence — matches brand index style.
        if (nextSort === 'relevance') params.delete('sort');
        else params.set('sort', nextSort);
      });
    },
    [writeParams],
  );

  const setCategory = useCallback(
    (nextCategory: ProductCategory | null) => {
      writeParams((params) => {
        if (nextCategory === null) params.delete('category');
        else params.set('category', nextCategory);
      });
    },
    [writeParams],
  );

  const setStyles = useCallback(
    (nextStyles: string[]) => {
      writeParams((params) => {
        params.delete('style');
        for (const s of nextStyles) params.append('style', s);
      });
    },
    [writeParams],
  );

  const setPrice = useCallback(
    (min: number | undefined, max: number | undefined) => {
      writeParams((params) => {
        if (min === undefined) params.delete('price_min');
        else params.set('price_min', String(min));
        if (max === undefined) params.delete('price_max');
        else params.set('price_max', String(max));
      });
    },
    [writeParams],
  );

  const clearFilters = useCallback(() => {
    writeParams((params) => {
      params.delete('sort');
      params.delete('category');
      params.delete('style');
      params.delete('price_min');
      params.delete('price_max');
    });
  }, [writeParams]);

  const clearAll = useCallback(() => {
    writeParams((params) => {
      params.delete('q');
      params.delete('sort');
      params.delete('category');
      params.delete('style');
      params.delete('price_min');
      params.delete('price_max');
    });
  }, [writeParams]);

  _return.current.q = q;
  _return.current.sort = sort;
  _return.current.category = category;
  _return.current.styles = styles;
  _return.current.priceMin = priceMin;
  _return.current.priceMax = priceMax;
  _return.current.setQ = setQ;
  _return.current.setSort = setSort;
  _return.current.setCategory = setCategory;
  _return.current.setStyles = setStyles;
  _return.current.setPrice = setPrice;
  _return.current.clearFilters = clearFilters;
  _return.current.clearAll = clearAll;
  return _return.current;
};
