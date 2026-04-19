/**
 * Zod schemas for Search URL search params.
 *
 * - `?q=` — plain string, min 2 chars enforced by `useSearchUrlState` consumer
 *   (short/missing `q` means empty state, no API call).
 * - `?sort=relevance|recent|price_asc|price_desc` — single value, defaults to
 *   `'relevance'` when missing/invalid.
 * - `?category=outer|top|bottom|acc|shoes` — single value, null when absent.
 * - `?style=a&style=b` — repeated, silently filtered to canonical set by caller.
 * - `?price_min=&price_max=` — positive integers (KRW). Invalid values drop to
 *   undefined rather than throwing — filter bar validates UI-side.
 *
 * Source of truth: `docs/plans/search/api-mapping.md` §C.
 */

import { z } from 'zod';

import type { SearchSort } from 'src/types/search-types';

const searchSortSchema = z.enum(['relevance', 'recent', 'price_asc', 'price_desc']);

export const parseSearchSort = (value: string | null | undefined): SearchSort => {
  const result = searchSortSchema.safeParse(value);
  return result.success ? result.data : 'relevance';
};

const productCategorySchema = z.enum(['outer', 'top', 'bottom', 'acc', 'shoes']);

export const parseSearchCategory = (value: string | null | undefined) => {
  if (!value) return null;
  const result = productCategorySchema.safeParse(value);
  return result.success ? result.data : null;
};

/**
 * Parse a KRW price param. Non-integer / negative / `NaN` → undefined so the
 * consumer can drop the filter entirely.
 */
export const parseSearchPrice = (value: string | null | undefined): number | undefined => {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined;
  return n;
};
