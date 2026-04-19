'use client';

import type React from 'react';

import { ProductCard } from 'src/components/(products)/product-card';
import { ProductGrid } from 'src/components/(products)/product-grid';

import type { ProductListItem } from 'src/types/product-types';

export interface SearchProductsGridProps {
  items: ProductListItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** Return path after login for guest wishlist taps. */
  loginNext?: string;
}

/**
 * Main product grid — reuses `ProductCard variant='plain'` + the shared
 * `ProductGrid` layout. Load-more is a manual button; infinite scroll
 * IntersectionObserver is out of scope per structure plan.
 */
const SearchProductsGrid: React.FC<SearchProductsGridProps> = ({
  items,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loginNext,
}) => (
  <section style={{ padding: '40px 48px 80px' }}>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: 1.6,
        color: 'rgba(17,17,17,0.55)',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}
    >
      상품 · {items.length}
    </div>
    <ProductGrid
      items={items}
      renderCard={(product) => (
        <ProductCard
          product={product}
          variant="plain"
          showMeta
          loginNext={loginNext}
        />
      )}
    />
    {hasNextPage && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: '#111',
            background: 'transparent',
            border: '1px solid #111',
            padding: '12px 24px',
            cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
            opacity: isFetchingNextPage ? 0.6 : 1,
          }}
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      </div>
    )}
  </section>
);

export default SearchProductsGrid;
