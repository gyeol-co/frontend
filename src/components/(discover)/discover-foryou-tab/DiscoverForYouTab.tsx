'use client';

import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductEmptyState, ProductGrid, ProductNewCard } from 'src/components/(products)';
import { productForYouInfiniteQueryOptions } from 'src/hooks/(products)';
import { useAuthRequired } from 'src/hooks/useAuthRequired';

import type { ForYouMode } from 'src/types/product-types';

const PAGE_SIZE = 8;

interface ForYouBannerProps {
  mode: ForYouMode;
}

const ForYouBanner: React.FC<ForYouBannerProps> = ({ mode }) => {
  const copy =
    mode === 'affinity'
      ? '취향에 맞춘 제안'
      : '당신을 위한 선택이 준비되는 중이에요. 지금 인기 있는 것부터.';
  return (
    <div
      style={{
        padding: '28px 48px 0',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: 1.4,
        color: 'rgba(17,17,17,0.55)',
        textTransform: 'uppercase',
      }}
    >
      {copy}
    </div>
  );
};

/**
 * For You tab — gated on auth. Banner copy depends on which mode the BE chose
 * on the first page: `affinity` (personalized) vs `popular_fallback` (not
 * enough signal yet, show popular).
 */
const DiscoverForYouTab: React.FC = () => {
  const { isLoading: authLoading, isAuthorized } = useAuthRequired({
    next: '/discover?tab=foryou',
  });

  const query = useInfiniteQuery({
    ...productForYouInfiniteQueryOptions(PAGE_SIZE),
    enabled: isAuthorized,
  });

  if (authLoading || !isAuthorized) {
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
        {authLoading ? 'Checking session…' : 'Redirecting to sign in…'}
      </div>
    );
  }

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
        Loading For You…
      </div>
    );
  }

  if (query.isError) {
    return <ProductEmptyState title="지금은 불러올 수 없어요." hint="잠시 후 다시 시도해주세요." />;
  }

  const firstPage = query.data.pages[0];
  const mode = firstPage.data.mode;
  const items = query.data.pages.flatMap((p) => p.data.items);

  if (items.length === 0) {
    return (
      <>
        <ForYouBanner mode={mode} />
        <div style={{ padding: '40px 48px 40px' }}>
          <ProductEmptyState
            title="취향 데이터가 아직 부족해요."
            hint="조금만 둘러보면 금세 채워져요."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ForYouBanner mode={mode} />
      <div style={{ padding: '16px 48px 40px' }}>
        <ProductGrid
          items={items}
          renderCard={(product) => (
            <ProductNewCard product={product} loginNext="/discover?tab=foryou" />
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
    </>
  );
};

export default DiscoverForYouTab;
