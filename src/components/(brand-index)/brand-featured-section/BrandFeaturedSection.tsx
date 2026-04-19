'use client';

import type React from 'react';

import { useQuery } from '@tanstack/react-query';

import { BrandCard } from 'src/components/(brand-index)/brand-card';
import { brandFeaturedShortlistQueryOptions } from 'src/hooks/(brands)';

/**
 * "Featured this week" 4-card shortlist on the Index page. Rendered only when
 * the parent's sort is `alpha` and no style filter is active (see design
 * `design/project/brand-views.jsx` L153). Parent controls the mount gate.
 *
 * Uses a dedicated queryOptions key (`useQuery`, single page) so the store
 * type doesn't collide with the paginated main grid even though both hit
 * `GET /brands?sort=featured`.
 */
const BrandFeaturedSection: React.FC = () => {
  const query = useQuery(brandFeaturedShortlistQueryOptions());

  if (query.isPending || query.isError) return null;

  const items = query.data.data.items;
  if (items.length === 0) return null;

  return (
    <div style={{ padding: '32px 48px 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: '1px solid rgba(17,17,17,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.4,
          }}
        >
          Featured this week
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
          Editor&apos;s pick · {items.length}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 28,
        }}
      >
        {items.map((b) => (
          <BrandCard key={b.slug} brand={b} variant="compact" loginNext="/brands" />
        ))}
      </div>
    </div>
  );
};

export default BrandFeaturedSection;
