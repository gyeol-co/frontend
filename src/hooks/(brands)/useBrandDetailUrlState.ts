'use client';

import { useCallback, useRef } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { parseBrandDetailCategory } from 'src/schemas/brand-filters-schema';

import type { ProductCategory } from 'src/types/product-types';

export interface UseBrandDetailUrlStateReturn {
  /** `null` means "All" — no category filter applied. */
  category: ProductCategory | null;
  setCategory: (category: ProductCategory | null) => void;
}

/**
 * URL-backed category tab state for Brand Detail's "All items" section.
 * `/brands/{slug}?category=top` keeps the tab selection across refresh/share.
 */
export const useBrandDetailUrlState = () => {
  const _return = useRef({} as UseBrandDetailUrlStateReturn);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = parseBrandDetailCategory(searchParams.get('category'));

  const setCategory = useCallback(
    (nextCategory: ProductCategory | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextCategory === null) params.delete('category');
      else params.set('category', nextCategory);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  _return.current.category = category;
  _return.current.setCategory = setCategory;
  return _return.current;
};
