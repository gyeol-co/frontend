/**
 * Product category labels — used by filter bars, meta grids, and Saved page.
 * Mirrors the `ProductCategory` enum in `src/types/product-types.ts`.
 */

import type { ProductCategory } from 'src/types/product-types';

export interface CategoryOption {
  key: ProductCategory | 'all';
  label: string;
}

/** Display order for pills (matches the design prototype). */
export const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'all', label: 'All' },
  { key: 'outer', label: 'Outer' },
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'acc', label: 'Accessories' },
  { key: 'shoes', label: 'Shoes' },
];

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  outer: 'Outer',
  top: 'Top',
  bottom: 'Bottom',
  acc: 'Accessories',
  shoes: 'Shoes',
};

export const PRODUCT_CATEGORY_KEYS: ProductCategory[] = ['outer', 'top', 'bottom', 'acc', 'shoes'];

/** Type guard for `?category=` URL param. */
export const isProductCategory = (value: string | null | undefined): value is ProductCategory =>
  value === 'outer' || value === 'top' || value === 'bottom' || value === 'acc' || value === 'shoes';
