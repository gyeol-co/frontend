'use client';

import type React from 'react';

import { BrandCard } from 'src/components/(brand-index)/brand-card';

import type { BrandIndexItem } from 'src/types/brand-types';

export interface BrandRelatedBlockProps {
  brands: BrandIndexItem[];
}

/**
 * "비슷한 결의 브랜드" block on Brand Detail. Renders 0-3 related brands as
 * minimal cards (no cover, no follow button) on a beige background. Parent
 * should not render the block when `brands.length === 0`.
 */
const BrandRelatedBlock: React.FC<BrandRelatedBlockProps> = ({ brands }) => {
  if (brands.length === 0) return null;

  return (
    <div
      style={{
        borderTop: '1px solid rgba(17,17,17,0.12)',
        padding: '32px 48px 48px',
        background: '#f0eee9',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: -0.4,
          }}
        >
          비슷한 결의 브랜드
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
          Share similar style tags
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {brands.map((b) => (
          <BrandCard key={b.slug} brand={b} variant="related" />
        ))}
      </div>
    </div>
  );
};

export default BrandRelatedBlock;
