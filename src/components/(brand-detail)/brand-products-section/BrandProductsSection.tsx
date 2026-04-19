'use client';

import { useMemo } from 'react';
import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductCard, ProductGrid } from 'src/components/(products)';
import { brandProductsInfiniteQueryOptions } from 'src/hooks/(brands)';
import { CATEGORY_OPTIONS } from 'src/constants/product-categories';

import type { ProductCategory } from 'src/types/product-types';

export interface BrandProductsSectionProps {
  slug: string;
  category: ProductCategory | null;
  onCategoryChange: (category: ProductCategory | null) => void;
}

/**
 * "All items" section on Brand Detail. Category tabs + 4-col product grid +
 * Load more. Discover's `ProductCard` is reused (`variant='plain'`).
 *
 * `count_total` is the brand-wide total (filter-invariant) — used for the
 * "N of M" indicator. `count_by_category` labels every tab, including those
 * with zero items (design keeps the button visible).
 */
const BrandProductsSection: React.FC<BrandProductsSectionProps> = ({
  slug,
  category,
  onCategoryChange,
}) => {
  const query = useInfiniteQuery(
    brandProductsInfiniteQueryOptions({ slug, category: category ?? undefined }),
  );

  const items = useMemo(
    () => (query.data ? query.data.pages.flatMap((p) => p.data.items) : []),
    [query.data],
  );

  const firstPage = query.data?.pages[0]?.data;
  const countTotal = firstPage?.count_total ?? 0;
  const countByCategory = firstPage?.count_by_category ?? {
    outer: 0,
    top: 0,
    bottom: 0,
    acc: 0,
    shoes: 0,
  };
  const visibleCountLabel = category ? countByCategory[category] : countTotal;

  const loginNext = `/brands/${slug}`;

  const tabStyle = (active: boolean): React.CSSProperties => ({
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

  const renderBody = () => {
    if (query.isPending) {
      return (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.45)',
            textTransform: 'uppercase',
          }}
        >
          Loading items…
        </div>
      );
    }

    if (query.isError) {
      return (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.45)',
            textTransform: 'uppercase',
          }}
        >
          지금은 불러올 수 없어요.
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.45)',
            textTransform: 'uppercase',
          }}
        >
          이 카테고리엔 아직 없네요.
        </div>
      );
    }

    return (
      <>
        <div style={{ paddingBottom: 40 }}>
          <ProductGrid
            items={items}
            renderCard={(product) => (
              <ProductCard product={product} variant="plain" loginNext={loginNext} />
            )}
          />
        </div>
        {query.hasNextPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
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
      </>
    );
  };

  return (
    <div
      style={{
        borderTop: '1px solid rgba(17,17,17,0.12)',
        padding: '32px 48px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(17,17,17,0.08)',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: -0.6,
            }}
          >
            All items
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.3,
              color: 'rgba(17,17,17,0.5)',
              textTransform: 'uppercase',
            }}
          >
            {visibleCountLabel} of {countTotal}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORY_OPTIONS.map((opt) => {
            const active =
              opt.key === 'all' ? category === null : category === opt.key;
            const count = opt.key === 'all' ? countTotal : countByCategory[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onCategoryChange(opt.key === 'all' ? null : opt.key)}
                style={tabStyle(active)}
              >
                {opt.label} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {renderBody()}
    </div>
  );
};

export default BrandProductsSection;
