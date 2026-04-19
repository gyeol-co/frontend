'use client';

import { useMemo } from 'react';
import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { BrandEmptyState } from 'src/components/(brands)/brand-empty-state';
import { BrandFeaturedSection } from 'src/components/(brand-index)/brand-featured-section';
import { BrandIndexGrid } from 'src/components/(brand-index)/brand-index-grid';
import { BrandSortBar } from 'src/components/(brand-index)/brand-sort-bar';
import { Header } from 'src/components/header';
import { BRAND_STYLE_OPTIONS } from 'src/constants/brand-styles';
import {
  brandIndexInfiniteQueryOptions,
  useBrandIndexUrlState,
} from 'src/hooks/(brands)';

const LOADING_FALLBACK = (
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
    Loading brands…
  </div>
);

/**
 * Brand Index — Hero + SortBar + optional Featured shortlist + main grid.
 * Filter state (sort + style) is URL-backed; cursor lives in React Query.
 */
const BrandIndexPage: React.FC = () => {
  const { sort, style, setSort, setStyle, clear } = useBrandIndexUrlState();

  const query = useInfiniteQuery(brandIndexInfiniteQueryOptions({ sort, style }));

  const items = useMemo(
    () => (query.data ? query.data.pages.flatMap((p) => p.data.items) : []),
    [query.data],
  );

  const showFeatured = sort === 'alpha' && style.length === 0;

  const renderBody = () => {
    if (query.isPending) return LOADING_FALLBACK;

    if (query.isError) {
      return (
        <BrandEmptyState
          title="지금은 불러올 수 없어요."
          hint="잠시 후 다시 시도해주세요."
        />
      );
    }

    if (items.length === 0) {
      const filtered = style.length > 0 || sort !== 'alpha';
      return (
        <BrandEmptyState
          title={filtered ? '이 스타일에는 아직 브랜드가 없어요.' : '브랜드가 아직 없어요.'}
          hint={filtered ? 'Try clearing the filters.' : 'Crawler가 채우는 동안 기다려주세요.'}
          action={filtered ? { label: '필터 지우기', onClick: clear } : undefined}
        />
      );
    }

    return (
      <>
        {showFeatured && <BrandFeaturedSection />}
        <BrandIndexGrid
          sort={sort}
          items={items}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          onLoadMore={() => query.fetchNextPage()}
          loginNext="/brands"
        />
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', color: '#111' }}>
      <Header />
      <main>
        <div
          style={{
            padding: '48px 48px 32px',
            borderBottom: '1px solid rgba(17,17,17,0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'end',
            gap: 40,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 1.8,
                color: 'rgba(17,17,17,0.55)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              The Index · {items.length} brands
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 58,
                fontWeight: 400,
                letterSpacing: -1.4,
                lineHeight: 1,
                margin: '0 0 12px',
                textWrap: 'balance',
              }}
            >
              결이 고른 브랜드들.
            </h1>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(17,17,17,0.6)',
                letterSpacing: -0.1,
                maxWidth: 640,
              }}
            >
              우리 기준을 통과한 브랜드들. 런던·파리·도쿄·서울·뉴욕에서. 각자의 문법으로, 각자의 속도로.
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              letterSpacing: 1.4,
              color: 'rgba(17,17,17,0.55)',
              textTransform: 'uppercase',
              textAlign: 'right',
            }}
          >
            <div>Updated weekly</div>
          </div>
        </div>

        <BrandSortBar
          sort={sort}
          onSortChange={setSort}
          style={style}
          styleOptions={BRAND_STYLE_OPTIONS}
          onStyleChange={setStyle}
          shownCount={items.length}
        />

        {renderBody()}
      </main>
    </div>
  );
};

export default BrandIndexPage;
