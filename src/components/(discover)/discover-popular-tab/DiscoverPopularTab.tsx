'use client';

import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductEmptyState, ProductGrid, ProductRankCard } from 'src/components/(products)';
import { productFeedInfiniteQueryOptions } from 'src/hooks/(products)';

const PAGE_SIZE = 8;

/**
 * Popular tab — ranked grid of the most-popular products. Rank numbers are
 * computed FE-side (`i + 1`) since the API doesn't return rank on this feed
 * (see api-mapping.md §E, `ProductRankCard`).
 */
const DiscoverPopularTab: React.FC = () => {
  const query = useInfiniteQuery(productFeedInfiniteQueryOptions('popular', PAGE_SIZE));

  if (query.isPending) {
    return (
      <div
        style={{
          padding: '60px 48px',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
        }}
      >
        Loading popular…
      </div>
    );
  }

  if (query.isError) {
    return (
      <ProductEmptyState
        title="지금은 불러올 수 없어요."
        hint="잠시 후 다시 시도해주세요."
      />
    );
  }

  const items = query.data.pages.flatMap((p) => p.data.items);

  if (items.length === 0) {
    return <ProductEmptyState title="아직 가져온 상품이 없어요." hint="Seed 데이터가 들어오면 채워져요." />;
  }

  return (
    <div style={{ padding: '28px 48px 40px' }}>
      <ProductGrid
        items={items}
        renderCard={(product, i) => (
          <ProductRankCard
            product={product}
            rank={i + 1}
            loginNext="/discover?tab=popular"
          />
        )}
      />
      {query.hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              padding: '12px 24px',
              border: '1px solid rgba(17,17,17,0.2)',
              background: 'transparent',
              color: '#111',
              cursor: query.isFetchingNextPage ? 'wait' : 'pointer',
              opacity: query.isFetchingNextPage ? 0.5 : 1,
            }}
          >
            {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoverPopularTab;
