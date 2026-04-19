'use client';

import { useMemo, useState } from 'react';
import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductCard, ProductEmptyState, ProductGrid } from 'src/components/(products)';
import { Header } from 'src/components/header';
import { WishlistCategoryFilter } from 'src/components/(wishlist)/wishlist-category-filter';
import { wishlistListInfiniteQueryOptions } from 'src/hooks/(wishlist)';
import { useAuthRequired } from 'src/hooks/useAuthRequired';

import type { ProductCategory } from 'src/types/product-types';

const WISHLIST_CAP = 500;

/**
 * Saved page — user's wishlist grid. Auth-gated. Category filter is component
 * local state (doesn't survive refresh yet; URL-sync can be added when/if
 * shareability matters).
 */
const SavedPage: React.FC = () => {
  const { isLoading: authLoading, isAuthorized } = useAuthRequired({ next: '/saved' });
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  const query = useInfiniteQuery({
    ...wishlistListInfiniteQueryOptions(activeCategory ?? undefined),
    enabled: isAuthorized,
  });

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

  const renderBody = () => {
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
          Loading saved…
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

    return (
      <>
        <WishlistCategoryFilter
          activeCategory={activeCategory}
          onChange={setActiveCategory}
          counts={countByCategory}
          filteredCount={items.length}
          totalCount={countTotal}
        />

        {items.length === 0 ? (
          <ProductEmptyState
            title={countTotal === 0 ? '아직 저장한 것이 없어요.' : '이 카테고리엔 없네요.'}
            hint={
              countTotal === 0
                ? 'Discover에서 상품 카드의 + 버튼으로 저장할 수 있어요.'
                : 'Try another category.'
            }
            cta={countTotal === 0 ? { label: 'Discover로 가기', href: '/discover' } : undefined}
          />
        ) : (
          <div style={{ padding: '28px 48px 48px' }}>
            <ProductGrid
              items={items}
              renderCard={(product) => (
                <ProductCard
                  product={product}
                  variant="compact"
                  loginNext="/saved"
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
        )}
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', color: '#111' }}>
      <Header />
      <main>
        {/* Hero */}
        <div
          style={{
            padding: '32px 48px 28px',
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
                marginBottom: 10,
              }}
            >
              Saved · {countTotal} of {WISHLIST_CAP}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                fontWeight: 400,
                letterSpacing: -1.2,
                lineHeight: 1,
                margin: '0 0 10px',
                textWrap: 'balance',
              }}
            >
              저장해 둔 것들.
            </h1>
            <div
              style={{
                fontSize: 12.5,
                color: 'rgba(17,17,17,0.6)',
                letterSpacing: -0.1,
                maxWidth: 640,
              }}
            >
              다시 볼만한 것, 한 번 더 생각할 것. 결정은 천천히.
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
            <div>Private list</div>
            <div style={{ opacity: 0.6, marginTop: 4 }}>Max {WISHLIST_CAP}</div>
          </div>
        </div>

        {renderBody()}
      </main>
    </div>
  );
};

export default SavedPage;
