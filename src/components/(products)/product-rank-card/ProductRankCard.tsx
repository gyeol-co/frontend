'use client';

import type React from 'react';

import { ProductCard } from 'src/components/(products)/product-card';

import type { ProductListItem } from 'src/types/product-types';

export interface ProductRankCardProps {
  product: ProductListItem;
  /** 1-based — formatted as "01", "02", … (comes from `i + 1`, not API). */
  rank: number;
  loginNext?: string;
}

/**
 * Popular-tab card. Displays "지금 주목받는 중" copy + a large zero-padded
 * rank overlay in the top-left corner of the thumbnail.
 */
const ProductRankCard: React.FC<ProductRankCardProps> = ({ product, rank, loginNext }) => {
  const paddedRank = String(rank).padStart(2, '0');

  const renderHeader = () => (
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: 0.4,
        color: 'rgba(17,17,17,0.55)',
        marginBottom: 6,
        fontFamily: 'var(--font-sans)',
      }}
    >
      지금 주목받는 중
    </div>
  );

  const renderRankOverlay = () => (
    <div
      style={{
        position: 'absolute',
        left: 8,
        top: 4,
        zIndex: 2,
        fontFamily: 'var(--font-display)',
        fontSize: 44,
        fontWeight: 300,
        letterSpacing: -2,
        lineHeight: 0.85,
        color: '#fafaf8',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
      }}
    >
      {paddedRank}
    </div>
  );

  return (
    <ProductCard
      product={product}
      variant="compact"
      loginNext={loginNext}
      headerSlot={renderHeader()}
      thumbnailBadge={renderRankOverlay()}
    />
  );
};

export default ProductRankCard;
