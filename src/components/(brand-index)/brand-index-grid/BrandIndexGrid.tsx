'use client';

import type React from 'react';

import { BrandCard } from 'src/components/(brand-index)/brand-card';

import type { BrandIndexItem, BrandIndexSort } from 'src/types/brand-types';

export interface BrandIndexGridProps {
  sort: BrandIndexSort;
  items: BrandIndexItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** Login redirect target for guest follow clicks inside cards. */
  loginNext?: string;
}

const SORT_SECTION_LABEL: Record<BrandIndexSort, string> = {
  alpha: 'All brands',
  featured: 'Featured first',
  recent: 'By recent updates',
};

/**
 * Main 3-col Brand Index grid — header line (section title + count) +
 * `BrandCard` tiles + Load more button.
 *
 * Loading / error / empty states are the caller's responsibility; this
 * component just lays out whatever items it's handed.
 */
const BrandIndexGrid: React.FC<BrandIndexGridProps> = ({
  sort,
  items,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loginNext,
}) => {
  return (
    <div style={{ padding: '24px 48px 48px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 24,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(17,17,17,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.4,
          }}
        >
          {SORT_SECTION_LABEL[sort]}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase',
          }}
        >
          {items.length} brands
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {items.map((b) => (
          <BrandCard key={b.slug} brand={b} variant="full" loginNext={loginNext} />
        ))}
      </div>

      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              padding: '12px 24px',
              border: '1px solid rgba(17,17,17,0.2)',
              background: 'transparent',
              color: '#111',
              cursor: isFetchingNextPage ? 'wait' : 'pointer',
              opacity: isFetchingNextPage ? 0.5 : 1,
            }}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandIndexGrid;
