'use client';

import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductEmptyState, ProductGrid, ProductNewCard } from 'src/components/(products)';
import { productFeedInfiniteQueryOptions } from 'src/hooks/(products)';

const PAGE_SIZE = 8;

/**
 * New tab — most recently added products. `id DESC` keyset order, so uuid v7
 * makes this equivalent to "newest first".
 */
const DiscoverNewTab: React.FC = () => {
  const query = useInfiniteQuery(productFeedInfiniteQueryOptions('new', PAGE_SIZE));

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
        Loading new arrivals…
      </div>
    );
  }

  if (query.isError) {
    return <ProductEmptyState title="지금은 불러올 수 없어요." hint="잠시 후 다시 시도해주세요." />;
  }

  const items = query.data.pages.flatMap((p) => p.data.items);

  if (items.length === 0) {
    return <ProductEmptyState title="신상이 아직 없어요." hint="Crawler가 채우는 동안 기다려주세요." />;
  }

  return (
    <div style={{ padding: '28px 48px 40px' }}>
      <ProductGrid
        items={items}
        renderCard={(product) => (
          <ProductNewCard product={product} loginNext="/discover?tab=new" />
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

export default DiscoverNewTab;
