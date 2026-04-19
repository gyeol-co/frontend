'use client';

import type React from 'react';

import { BrandCard } from 'src/components/(brand-index)/brand-card';

import type { BrandIndexItem } from 'src/types/brand-types';

export interface SearchBrandsRowProps {
  /** Top-5 brand matches from `pages[0].data.brands`. Parent hides row on empty. */
  brands: BrandIndexItem[];
  /** Passed to each `BrandCard` for guest follow → login redirect. */
  loginNext?: string;
}

/**
 * Horizontal row of top-matching brands (max 5) above the main product grid.
 * Reuses `BrandCard variant='compact'` for MVP — swap to a search-specific
 * card if design demands.
 */
const SearchBrandsRow: React.FC<SearchBrandsRowProps> = ({ brands, loginNext }) => {
  if (brands.length === 0) return null;

  return (
    <section
      style={{
        padding: '28px 48px',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.6,
          color: 'rgba(17,17,17,0.55)',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        브랜드 · {brands.length}
      </div>
      {/* Fixed 5-col grid — brand card width stays stable regardless of
          match count (1 brand ≠ full-width banner). Cards left-align;
          remaining columns stay empty. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 16,
        }}
      >
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} variant="compact" loginNext={loginNext} />
        ))}
      </div>
    </section>
  );
};

export default SearchBrandsRow;
