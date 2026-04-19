import type React from 'react';

import Link from 'next/link';

export interface BrandEmptyStateProps {
  title: string;
  hint?: string;
  cta?: { label: string; href: string };
  /** Optional inline action button (e.g. "필터 지우기") — rendered next to the CTA link. */
  action?: { label: string; onClick: () => void };
}

/**
 * Empty / error state for Brand Index + Detail. Mirrors the discover
 * `ProductEmptyState` tone — same typography, tightly centered.
 */
const BrandEmptyState: React.FC<BrandEmptyStateProps> = ({ title, hint, cta, action }) => {
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
            marginBottom: cta || action ? 24 : 0,
          }}
        >
          {hint}
        </div>
      )}
      {(cta || action) && (
        <div style={{ display: 'inline-flex', gap: 10, marginTop: 12 }}>
          {cta && (
            <Link
              href={cta.href}
              style={{
                display: 'inline-block',
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
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              style={{
                padding: '10px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                background: 'transparent',
                color: '#111',
                border: '1px solid rgba(17,17,17,0.2)',
                cursor: 'pointer',
              }}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandEmptyState;
