'use client';

import type React from 'react';

import Link from 'next/link';

import { ProductPrice } from 'src/components/(products)/product-price';
import { WishlistSaveChip } from 'src/components/(wishlist)/wishlist-save-chip';

import type { ProductListItem } from 'src/types/product-types';

export interface ProductCardProps {
  product: ProductListItem;
  /** Compact card variant for Saved / Related. */
  variant?: 'plain' | 'compact';
  /**
   * Override the default category label line (e.g. to hide it on dense grids).
   * `true` shows category + fit, `false` hides that line.
   */
  showMeta?: boolean;
  /** Return path after login when guest taps the save chip. */
  loginNext?: string;
  /** Optional slot rendered above the title — used by rank/new variants. */
  headerSlot?: React.ReactNode;
  /** Optional slot rendered below the name — used by New card for styles chips. */
  stylesSlot?: React.ReactNode;
  /** Badge overlaid on the thumbnail (e.g. "New · 어제"). */
  thumbnailBadge?: React.ReactNode;
}

/**
 * Core product card — thumbnail + brand + name + price. Sold-out badge is part
 * of `ProductPrice` (bottom row), but an overlay `Sold out` tag is also drawn
 * on the image when the item is sold out. Matches design §shared.jsx.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'plain',
  showMeta = true,
  loginNext,
  headerSlot,
  stylesSlot,
  thumbnailBadge,
}) => {
  const compact = variant === 'compact';
  const muted = 'rgba(17,17,17,0.55)';
  const line = 'rgba(17,17,17,0.08)';

  return (
    <Link
      href={`/products/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={{ color: '#111', fontFamily: 'var(--font-sans)', position: 'relative' }}>
        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3 / 4',
            background: '#e8e6e1',
            overflow: 'hidden',
          }}
        >
          <img
            src={product.thumbnail_url}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {product.is_soldout && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 2,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                background: '#111',
                color: '#fafaf8',
                padding: '4px 8px',
              }}
            >
              Sold out
            </div>
          )}
          {thumbnailBadge}
        </div>

        {/* Body */}
        <div style={{ paddingTop: 12 }}>
          {headerSlot}

          <div
            style={{
              fontSize: 9.5,
              letterSpacing: 1.4,
              color: muted,
              fontWeight: 500,
              marginBottom: 6,
              textTransform: 'uppercase',
            }}
          >
            {product.brand.name}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              marginBottom: 3,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                fontFamily: 'var(--font-display)',
                fontSize: compact ? 16 : 19,
                color: '#111',
                letterSpacing: 0,
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </div>
            <WishlistSaveChip
              productId={product.id}
              initialIsSaved={product.is_wishlisted}
              loginNext={loginNext}
            />
          </div>

          {showMeta && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'baseline',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: 0.8,
                color: muted,
                marginBottom: 10,
                textTransform: 'uppercase',
              }}
            >
              <span>{product.category}</span>
              {product.fit && (
                <>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{product.fit}</span>
                </>
              )}
            </div>
          )}

          {stylesSlot}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 8,
              borderTop: `1px solid ${line}`,
              marginTop: 4,
            }}
          >
            <ProductPrice
              originalPrice={product.original_price}
              discountedPrice={product.discounted_price}
              isSoldout={false}
              size="card"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
