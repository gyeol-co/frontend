'use client';

import type React from 'react';

import { useQuery } from '@tanstack/react-query';

import { ProductCard } from 'src/components/(products)/product-card';
import { ProductDetailBreadcrumb } from 'src/components/(products)/product-detail-breadcrumb';
import { ProductEmptyState } from 'src/components/(products)/product-empty-state';
import { ProductGallery } from 'src/components/(products)/product-gallery';
import { ProductMetaGrid } from 'src/components/(products)/product-meta-grid';
import { ProductPrice } from 'src/components/(products)/product-price';
import { WishlistToggleButton } from 'src/components/(wishlist)/wishlist-toggle-button';
import { Header } from 'src/components/header';
import {
  productDetailQueryOptions,
  productRelatedQueryOptions,
} from 'src/hooks/(products)';
import { ApiError } from 'src/lib/api-client';

export interface ProductDetailPageProps {
  productId: string;
}

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
    Loading…
  </div>
);

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const detailQuery = useQuery(productDetailQueryOptions(productId));
  const relatedQuery = useQuery(productRelatedQueryOptions(productId));

  const renderBody = () => {
    if (detailQuery.isPending) return LOADING_FALLBACK;

    if (detailQuery.isError) {
      const err = detailQuery.error;
      if (err instanceof ApiError && err.code === 'PRODUCT_NOT_FOUND') {
        return (
          <ProductEmptyState
            title="상품을 찾을 수 없어요."
            hint="이미 내려간 상품이거나 링크가 잘못되었어요."
            cta={{ label: 'Discover로 돌아가기', href: '/discover' }}
          />
        );
      }
      return (
        <ProductEmptyState
          title="지금은 불러올 수 없어요."
          hint="잠시 후 다시 시도해주세요."
        />
      );
    }

    const product = detailQuery.data;
    const nextPath = `/products/${product.id}`;

    return (
      <>
        <ProductDetailBreadcrumb brand={product.brand} productName={product.name} />

        <div
          style={{
            padding: '40px 48px 32px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
          }}
        >
          <ProductGallery product={product} />

          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 1.6,
                color: 'rgba(17,17,17,0.55)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {product.brand.name}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 44,
                fontWeight: 400,
                letterSpacing: -1.1,
                lineHeight: 1.02,
                margin: '0 0 8px',
                textWrap: 'balance',
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                paddingBottom: 20,
                borderBottom: '1px solid rgba(17,17,17,0.12)',
                marginBottom: 22,
              }}
            >
              <ProductPrice
                originalPrice={product.original_price}
                discountedPrice={product.discounted_price}
                isSoldout={product.is_soldout}
                size="detail"
              />
              <div
                style={{
                  marginTop: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: 1.3,
                  color: 'rgba(17,17,17,0.55)',
                  textTransform: 'uppercase',
                }}
              >
                {product.category}
                {product.fit ? ` · ${product.fit}` : ''}
              </div>
            </div>

            {product.styles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                {product.styles.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      letterSpacing: 0.8,
                      color: 'rgba(17,17,17,0.65)',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(17,17,17,0.15)',
                      padding: '4px 10px',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                marginBottom: 32,
                flexWrap: 'wrap',
              }}
            >
              <WishlistToggleButton
                productId={product.id}
                initialIsSaved={product.is_wishlisted}
                loginNext={nextPath}
              />
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  padding: '12px 18px',
                  background: '#111',
                  color: '#fafaf8',
                  textDecoration: 'none',
                }}
              >
                Go to {product.brand.platform ?? 'store'} ↗
              </a>
            </div>

            {product.description && (
              <div
                style={{
                  borderTop: '1px solid rgba(17,17,17,0.12)',
                  paddingTop: 22,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    letterSpacing: 1.4,
                    color: 'rgba(17,17,17,0.5)',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  About this piece
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    fontWeight: 400,
                    letterSpacing: -0.1,
                    color: 'rgba(17,17,17,0.88)',
                    textWrap: 'pretty',
                  }}
                >
                  {product.description}
                </div>
              </div>
            )}

            <ProductMetaGrid product={product} />
          </div>
        </div>

        {relatedQuery.data && relatedQuery.data.items.length > 0 && (
          <div
            style={{
              padding: '36px 48px 48px',
              borderTop: '1px solid rgba(17,17,17,0.12)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: '1px solid rgba(17,17,17,0.08)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: -0.4,
                }}
              >
                비슷한 결의 아이템
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
                Same brand or shared style
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                columnGap: 24,
                rowGap: 32,
              }}
            >
              {relatedQuery.data.items.map((r) => (
                <ProductCard
                  key={r.id}
                  product={r}
                  variant="compact"
                  showMeta={false}
                  loginNext={nextPath}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 40 }} />
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', color: '#111' }}>
      <Header />
      <main>{renderBody()}</main>
    </div>
  );
};

export default ProductDetailPage;
