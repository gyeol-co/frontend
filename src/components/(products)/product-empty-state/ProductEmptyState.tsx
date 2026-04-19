import type React from 'react';

import Link from 'next/link';

export interface ProductEmptyStateProps {
  title: string;
  hint?: string;
  cta?: { label: string; href: string };
}

/**
 * Empty / error state shared by Discover feeds, Saved, and Related.
 * Matches the "아직 저장한 것이 없어요" block in `Gyeol Unified.html` lines 762-778.
 */
const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ title, hint, cta }) => {
  return (
    <div
      style={{
        padding: '100px 48px',
        textAlign: 'center',
        color: '#111',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: -0.4,
          marginBottom: 12,
          color: 'rgba(17,17,17,0.75)',
        }}
      >
        {title}
      </div>
      {hint && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase',
            marginBottom: cta ? 24 : 0,
          }}
        >
          {hint}
        </div>
      )}
      {cta && (
        <Link
          href={cta.href}
          style={{
            display: 'inline-block',
            marginTop: 12,
            padding: '10px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            background: '#111',
            color: '#fafaf8',
            textDecoration: 'none',
          }}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
};

export default ProductEmptyState;
