'use client';

import type React from 'react';

import { CATEGORY_OPTIONS } from 'src/constants/product-categories';

import type { ProductCategory } from 'src/types/product-types';

export interface WishlistCategoryFilterProps {
  /** `null` = "All". */
  activeCategory: ProductCategory | null;
  onChange: (category: ProductCategory | null) => void;
  /** Per-category counts (excluding 'all'). Used as chip suffixes. */
  counts: Record<ProductCategory, number>;
  /** Visible count after filtering / total for the right-rail metric. */
  filteredCount: number;
  totalCount: number;
}

/**
 * Saved-page category chip bar + `N of M` indicator. Pure presentational.
 */
const WishlistCategoryFilter: React.FC<WishlistCategoryFilterProps> = ({
  activeCategory,
  onChange,
  counts,
  filteredCount,
  totalCount,
}) => {
  return (
    <div
      style={{
        padding: '16px 48px',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.3,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
        }}
      >
        Category
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CATEGORY_OPTIONS.map((opt) => {
          const active = opt.key === 'all' ? activeCategory === null : activeCategory === opt.key;
          const count = opt.key === 'all' ? totalCount : counts[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key === 'all' ? null : opt.key)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                padding: '6px 10px',
                border: `1px solid ${active ? '#111' : 'rgba(17,17,17,0.15)'}`,
                background: active ? '#111' : 'transparent',
                color: active ? '#fafaf8' : '#111',
                cursor: 'pointer',
              }}
            >
              {opt.label} · {count}
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(17,17,17,0.55)',
          textTransform: 'uppercase',
        }}
      >
        {filteredCount} of {totalCount}
      </div>
    </div>
  );
};

export default WishlistCategoryFilter;
