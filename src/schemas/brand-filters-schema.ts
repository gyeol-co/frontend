/**
 * Zod schemas for Brand URL search params.
 *
 * - `?sort=alpha|featured|recent` — single value, defaults to `alpha` when
 *   missing/invalid.
 * - `?style=a&style=b` — repeated string param, any non-empty string allowed
 *   (BE validates against actual brand styles).
 * - `?category=outer|top|bottom|acc|shoes` — single value on Detail page.
 *
 * Source of truth: `docs/plans/brand/api-mapping.md` §C.
 */

import { z } from 'zod';

export const brandIndexSortSchema = z.enum(['alpha', 'featured', 'recent']);

/**
 * URL-safe coercion — accepts `null` (missing) and returns the default.
 * Keeps silent fall-back behavior documented in api-mapping §G VALIDATION_ERROR.
 */
export const parseBrandIndexSort = (value: string | null | undefined) => {
  const result = brandIndexSortSchema.safeParse(value);
  return result.success ? result.data : 'alpha';
};

const productCategorySchema = z.enum(['outer', 'top', 'bottom', 'acc', 'shoes']);

export const parseBrandDetailCategory = (value: string | null | undefined) => {
  if (!value) return null;
  const result = productCategorySchema.safeParse(value);
  return result.success ? result.data : null;
};
