'use client';

import type React from 'react';

import { SearchPriceRange } from 'src/components/(search)/search-price-range';
import { BRAND_STYLE_OPTIONS } from 'src/constants/brand-styles';
import { CATEGORY_OPTIONS } from 'src/constants/product-categories';
import { SEARCH_SORT_OPTIONS } from 'src/constants/search-sort-options';

import type { ProductCategory } from 'src/types/product-types';
import type { SearchSort } from 'src/types/search-types';

export interface SearchFilterBarProps {
  sort: SearchSort;
  onSortChange: (sort: SearchSort) => void;
  category: ProductCategory | null;
  onCategoryChange: (category: ProductCategory | null) => void;
  styles: string[];
  onStylesChange: (styles: string[]) => void;
  priceMin: number | undefined;
  priceMax: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  /** Accumulated items count for the right-rail indicator. */
  shownCount: number;
  /** Reset sort/category/styles/price — keeps `q`. */
  onClearFilters: () => void;
  /** True when any filter differs from defaults — toggles the clear CTA visibility. */
  hasActiveFilters: boolean;
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  padding: '6px 10px',
  border: `1px solid ${active ? '#111' : 'rgba(17,17,17,0.15)'}`,
  background: active ? '#111' : 'transparent',
  color: active ? '#fafaf8' : '#111',
  cursor: 'pointer',
});

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9.5,
  letterSpacing: 1.3,
  color: 'rgba(17,17,17,0.5)',
  textTransform: 'uppercase',
};

const divider: React.CSSProperties = {
  width: 1,
  height: 20,
  background: 'rgba(17,17,17,0.1)',
};

/**
 * Sort + category + style + price range filter bar. Layout follows the
 * brand `BrandSortBar` pattern but supports more axes (category pills, price
 * inputs, 4 sort options).
 */
const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  sort,
  onSortChange,
  category,
  onCategoryChange,
  styles,
  onStylesChange,
  priceMin,
  priceMax,
  onPriceChange,
  shownCount,
  onClearFilters,
  hasActiveFilters,
}) => {
  const handleStyleToggle = (tag: string) => {
    if (styles.includes(tag)) {
      onStylesChange(styles.filter((s) => s !== tag));
    } else {
      onStylesChange([...styles, tag]);
    }
  };

  return (
    <div
      style={{
        padding: '18px 48px',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Sort */}
      <div style={labelStyle}>Sort</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {SEARCH_SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSortChange(opt.key)}
            style={pillStyle(sort === opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Category */}
      <div style={labelStyle}>Category</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CATEGORY_OPTIONS.map((opt) => {
          const nextValue: ProductCategory | null = opt.key === 'all' ? null : opt.key;
          const active = opt.key === 'all' ? category === null : category === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onCategoryChange(nextValue)}
              style={pillStyle(active)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={divider} />

      {/* Style */}
      <div style={labelStyle}>Style</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onStylesChange([])}
          style={pillStyle(styles.length === 0)}
        >
          All
        </button>
        {BRAND_STYLE_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleStyleToggle(tag)}
            style={pillStyle(styles.includes(tag))}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Price */}
      <div style={labelStyle}>Price</div>
      <SearchPriceRange min={priceMin} max={priceMax} onChange={onPriceChange} />

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.7)',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(17,17,17,0.3)',
              paddingBottom: 1,
            }}
          >
            Clear filters
          </button>
        )}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.55)',
            textTransform: 'uppercase',
          }}
        >
          Showing {shownCount}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
