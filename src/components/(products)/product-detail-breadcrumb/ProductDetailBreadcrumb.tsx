'use client';

import type React from 'react';

import { useRouter } from 'next/navigation';

import type { BrandSummary } from 'src/types/product-types';

export interface ProductDetailBreadcrumbProps {
  brand: BrandSummary;
  productName: string;
}

/**
 * Breadcrumb nav on the product detail page. `← Back` hits
 * `router.back()`, falling through to `/discover` when the history is empty.
 * Brand link points at `/brands/{slug}` — that page is out of scope for
 * this feature, so clicks may 404 until brand detail ships.
 */
const ProductDetailBreadcrumb: React.FC<ProductDetailBreadcrumbProps> = ({
  brand,
  productName,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/discover');
  };

  const sep = <span style={{ color: 'rgba(17,17,17,0.3)' }}>/</span>;

  return (
    <div
      style={{
        padding: '18px 48px',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        background: '#fafaf8',
      }}
    >
      <button
        type="button"
        onClick={handleBack}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'inherit',
          color: 'rgba(17,17,17,0.55)',
        }}
      >
        ← Back
      </button>
      {sep}
      <span style={{ color: 'rgba(17,17,17,0.55)' }}>{brand.name}</span>
      {sep}
      <span
        style={{
          color: '#111',
          textTransform: 'none',
          letterSpacing: 0.2,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {productName}
      </span>
    </div>
  );
};

export default ProductDetailBreadcrumb;
