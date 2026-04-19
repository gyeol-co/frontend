'use client';

import type React from 'react';

import { ProductCard } from 'src/components/(products)/product-card';
import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { ProductListItem } from 'src/types/product-types';

export interface ProductNewCardProps {
  product: ProductListItem;
  loginNext?: string;
}

/**
 * "New" card — NEW + days-ago badge overlaid on the thumbnail, plus up to two
 * style chips below the name. Used by `new` and `foryou` tabs.
 */
const ProductNewCard: React.FC<ProductNewCardProps> = ({ product, loginNext }) => {
  const daysLabel = formatDaysAgo(product.created);

  const renderNewBadge = () =>
    daysLabel && (
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
        New · {daysLabel}
      </div>
    );

  const renderStylesSlot = () =>
    product.styles.length > 0 && (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
        {product.styles.slice(0, 2).map((s) => (
          <span
            key={s}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8.5,
              letterSpacing: 0.6,
              color: 'rgba(17,17,17,0.55)',
              border: '1px solid rgba(17,17,17,0.12)',
              padding: '2px 6px',
              textTransform: 'uppercase',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    );

  return (
    <ProductCard
      product={product}
      variant="compact"
      loginNext={loginNext}
      thumbnailBadge={renderNewBadge()}
      stylesSlot={renderStylesSlot()}
    />
  );
};

export default ProductNewCard;
