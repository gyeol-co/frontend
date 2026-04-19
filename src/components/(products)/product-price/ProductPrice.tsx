import type React from 'react';

import { formatPrice } from 'src/utils/format-price';

export interface ProductPriceProps {
  originalPrice: number;
  discountedPrice: number | null;
  isSoldout: boolean;
  /** Compact layout for grid cards; full size for detail hero. */
  size?: 'card' | 'detail';
}

/**
 * Price row — main price + strikethrough original + `−N%` badge + optional
 * sold-out badge. Matches `Gyeol Unified.html` lines 2059-2093.
 */
const ProductPrice: React.FC<ProductPriceProps> = ({
  originalPrice,
  discountedPrice,
  isSoldout,
  size = 'card',
}) => {
  const price = formatPrice(originalPrice, discountedPrice);
  const isDetail = size === 'detail';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: isDetail ? 16 : 8,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontFamily: isDetail ? 'var(--font-display)' : 'var(--font-sans)',
          fontSize: isDetail ? 28 : 13,
          fontWeight: isDetail ? 500 : 400,
          letterSpacing: isDetail ? -0.4 : 0.2,
          color: '#111',
        }}
      >
        {price.main}
      </span>
      {price.discounted && price.orig && (
        <>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isDetail ? 13 : 10,
              letterSpacing: isDetail ? 0.4 : 0.6,
              color: 'rgba(17,17,17,0.45)',
              textDecoration: 'line-through',
            }}
          >
            {price.orig}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isDetail ? 11 : 9.5,
              letterSpacing: 1.4,
              color: '#111',
              textTransform: 'uppercase',
              border: '1px solid #111',
              padding: isDetail ? '3px 8px' : '2px 6px',
            }}
          >
            −{price.rate}%
          </span>
        </>
      )}
      {isSoldout && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isDetail ? 11 : 9.5,
            letterSpacing: 1.4,
            color: '#fafaf8',
            background: '#111',
            padding: isDetail ? '3px 8px' : '2px 6px',
            textTransform: 'uppercase',
          }}
        >
          Sold out
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
