'use client';

import { useCallback, useMemo, useRef } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { parseBrandIndexSort } from 'src/schemas/brand-filters-schema';

import type { BrandIndexSort } from 'src/types/brand-types';

export interface UseBrandIndexUrlStateReturn {
  /** Active sort — falls back to `'alpha'` for missing/invalid URL. */
  sort: BrandIndexSort;
  /** Selected style filter values (repeat param `?style=a&style=b`). */
  style: string[];
  setSort: (sort: BrandIndexSort) => void;
  setStyle: (style: string[]) => void;
  /** Clears `?sort=` and `?style=` from the URL. */
  clear: () => void;
}

/**
 * URL-backed Brand Index filter state. Keeps `/brands?sort=&style=...` in sync
 * so deep-links and browser back/forward feel natural. Cursor is deliberately
 * not stored in the URL (first-page reset on share is the expected behavior).
 */
export const useBrandIndexUrlState = () => {
  const _return = useRef({} as UseBrandIndexUrlStateReturn);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawSort = searchParams.get('sort');
  const sort = parseBrandIndexSort(rawSort);

  const style = useMemo(() => {
    const values = searchParams.getAll('style');
    // Drop empties. Duplicates are kept as-is — BE treats them as set membership.
    return values.filter((v) => v.length > 0);
  }, [searchParams]);

  const writeParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setSort = useCallback(
    (nextSort: BrandIndexSort) => {
      writeParams((params) => {
        // Default `alpha` is represented by an absent `?sort=` param.
        if (nextSort === 'alpha') params.delete('sort');
        else params.set('sort', nextSort);
      });
    },
    [writeParams],
  );

  const setStyle = useCallback(
    (nextStyle: string[]) => {
      writeParams((params) => {
        params.delete('style');
        for (const s of nextStyle) params.append('style', s);
      });
    },
    [writeParams],
  );

  const clear = useCallback(() => {
    writeParams((params) => {
      params.delete('sort');
      params.delete('style');
    });
  }, [writeParams]);

  _return.current.sort = sort;
  _return.current.style = style;
  _return.current.setSort = setSort;
  _return.current.setStyle = setStyle;
  _return.current.clear = clear;
  return _return.current;
};
