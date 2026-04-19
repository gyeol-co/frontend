'use client';

import type React from 'react';

import type { ProductListItem } from 'src/types/product-types';

export interface ProductGridProps {
  items: ProductListItem[];
  renderCard: (product: ProductListItem, index: number) => React.ReactNode;
  /** Optional column count override. Default 4. */
  columns?: number;
}

/**
 * Layout-only grid. Callers pass a `renderCard` slot so the same grid works
 * for Popular rank cards, New cards, For You cards, and Related products.
 *
 * Loading / error / empty states are the caller's responsibility — this
 * component just lays out whatever items it's handed.
 */
const ProductGrid: React.FC<ProductGridProps> = ({ items, renderCard, columns = 4 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: 24,
        rowGap: 40,
      }}
    >
      {items.map((item, i) => (
        <div key={item.id}>{renderCard(item, i)}</div>
      ))}
    </div>
  );
};

export default ProductGrid;
