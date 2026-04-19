'use client';

import type React from 'react';

import { useQuery } from '@tanstack/react-query';

import { BrandEmptyState } from 'src/components/(brands)/brand-empty-state';
import { BrandHero } from 'src/components/(brand-detail)/brand-hero';
import { BrandMetaGrid } from 'src/components/(brand-detail)/brand-meta-grid';
import { BrandProductsSection } from 'src/components/(brand-detail)/brand-products-section';
import { BrandRelatedBlock } from 'src/components/(brand-detail)/brand-related-block';
import { Header } from 'src/components/header';
import {
  brandDetailQueryOptions,
  useBrandDetailUrlState,
} from 'src/hooks/(brands)';
import { ApiError } from 'src/lib/api-client';

export interface BrandDetailPageProps {
  slug: string;
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
    Loading brand…
  </div>
);

/**
 * Brand Detail — Hero + Meta + Products + Related. Detail body and products
 * grid are fetched in parallel (independent queryOptions). Category tab state
 * lives in the URL (`?category=top`).
 *
 * 404 `BRAND_NOT_FOUND` → inline empty state with back-to-index CTA.
 */
const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ slug }) => {
  const detailQuery = useQuery(brandDetailQueryOptions(slug));
  const { category, setCategory } = useBrandDetailUrlState();

  const renderBody = () => {
    if (detailQuery.isPending) return LOADING_FALLBACK;

    if (detailQuery.isError) {
      const err = detailQuery.error;
      if (err instanceof ApiError && err.code === 'BRAND_NOT_FOUND') {
        return (
          <BrandEmptyState
            title="존재하지 않거나 비활성 브랜드입니다."
            hint="링크가 잘못되었거나 이미 내려간 브랜드예요."
            cta={{ label: 'Brand Index로 돌아가기', href: '/brands' }}
          />
        );
      }
      return (
        <BrandEmptyState
          title="지금은 불러올 수 없어요."
          hint="잠시 후 다시 시도해주세요."
        />
      );
    }

    const brand = detailQuery.data;

    return (
      <>
        <BrandHero brand={brand} />
        <div style={{ padding: '0 48px' }}>
          <BrandMetaGrid brand={brand} />
        </div>
        <BrandProductsSection
          slug={brand.slug}
          category={category}
          onCategoryChange={setCategory}
        />
        <BrandRelatedBlock brands={brand.related_brands} />
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

export default BrandDetailPage;
