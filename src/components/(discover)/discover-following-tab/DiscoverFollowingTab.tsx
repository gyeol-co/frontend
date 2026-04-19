'use client';

import type React from 'react';

import { useQuery } from '@tanstack/react-query';

import { ProductEmptyState } from 'src/components/(products)';
import { productFollowingQueryOptions } from 'src/hooks/(products)';
import { useAuthRequired } from 'src/hooks/useAuthRequired';

import DiscoverFollowingBrandSection from './DiscoverFollowingBrandSection';

/**
 * Following tab — groups recent new arrivals by followed brand.
 * Auth-gated. API returns every followed brand with at least one item in the
 * last 7 days, so an empty `brands` array indicates either no follows or no
 * new arrivals.
 */
const DiscoverFollowingTab: React.FC = () => {
  const { isLoading: authLoading, isAuthorized } = useAuthRequired({
    next: '/discover?tab=following',
  });

  const query = useQuery({
    ...productFollowingQueryOptions,
    enabled: isAuthorized,
  });

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
        Loading following…
      </div>
    );
  }

  if (query.isError || !query.data) {
    return <ProductEmptyState title="지금은 불러올 수 없어요." hint="잠시 후 다시 시도해주세요." />;
  }

  const { total_new, brands } = query.data;

  if (brands.length === 0) {
    return (
      <ProductEmptyState
        title="주시 중인 브랜드가 아직 없어요."
        hint="Discover에서 마음에 드는 브랜드를 팔로우해보세요."
        cta={{ label: 'Discover로 돌아가기', href: '/discover' }}
      />
    );
  }

  return (
    <div style={{ padding: '12px 48px 40px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '20px 0 16px',
          borderBottom: '1px solid rgba(17,17,17,0.08)',
          marginBottom: 24,
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
              marginBottom: 6,
            }}
          >
            Following · {brands.length} brands
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            주시 중인 브랜드의 신상 · {total_new}건
          </div>
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
          Updated daily
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {brands.map((block) => (
          <DiscoverFollowingBrandSection key={block.brand.slug} block={block} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverFollowingTab;
