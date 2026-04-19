'use client';

import type React from 'react';

import Link from 'next/link';

import { ProductCard } from 'src/components/(products)';
import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { FollowingBrandBlock } from 'src/types/product-types';

export interface DiscoverFollowingBrandSectionProps {
  block: FollowingBrandBlock;
}

/**
 * One brand's latest items inside the Following tab. Header shows the brand
 * name + `+N new · {product_added}` metadata. Matches `Gyeol Unified.html`
 * lines 372-441.
 */
const DiscoverFollowingBrandSection: React.FC<DiscoverFollowingBrandSectionProps> = ({ block }) => {
  const { brand, new_count, items } = block;
  const lastUpdate = formatDaysAgo(brand.product_added);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderTop: '1px solid #111',
          paddingTop: 10,
          marginBottom: 14,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <Link
            href={`/brands/${brand.slug}`}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 12,
              letterSpacing: 1.2,
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#111',
              textDecoration: 'none',
            }}
          >
            {brand.name} ↗
          </Link>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: 0.6,
              color: 'rgba(17,17,17,0.55)',
              textTransform: 'uppercase',
            }}
          >
            +{new_count} new {lastUpdate ? ` · ${lastUpdate}` : ''}
          </div>
        </div>
        {brand.description && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.55)',
              textTransform: 'uppercase',
            }}
          >
            {brand.description.slice(0, 60)}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(items.length, 3)}, 1fr)`,
          gap: 18,
        }}
      >
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="compact"
            showMeta={false}
            loginNext="/discover?tab=following"
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoverFollowingBrandSection;
