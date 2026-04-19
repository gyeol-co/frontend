import type React from 'react';

import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { BrandDetail } from 'src/types/brand-types';

export interface BrandMetaGridProps {
  brand: BrandDetail;
}

interface MetaRowProps {
  label: string;
  children: React.ReactNode;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, children }) => (
  <>
    <div
      style={{
        color: 'rgba(17,17,17,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 9.5,
        paddingTop: 2,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: 0.8,
        color: 'rgba(17,17,17,0.85)',
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  </>
);

/**
 * About + Meta 2-column panel on Brand Detail. Only BE-provided fields render;
 * design fields without backing data (region / founder / fabric) stay hidden.
 * Matches `design/project/brand-views.jsx` L363-430.
 */
const BrandMetaGrid: React.FC<BrandMetaGridProps> = ({ brand }) => {
  const updatedDays = formatDaysAgo(brand.product_added);
  const updatedLabel = updatedDays
    ? brand.new_count > 0
      ? `${updatedDays} (+${brand.new_count} new)`
      : updatedDays
    : 'No updates yet';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: 48,
        padding: '32px 0 40px',
        borderTop: '1px solid rgba(17,17,17,0.12)',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.4,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          About
        </div>
        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.75,
            color: 'rgba(17,17,17,0.85)',
            textWrap: 'pretty',
            letterSpacing: -0.1,
          }}
        >
          {brand.description ?? '아직 소개가 준비되지 않았어요.'}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.4,
            color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Meta
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            rowGap: 10,
            columnGap: 12,
          }}
        >
          {brand.styles.length > 0 && (
            <MetaRow label="Style">
              {brand.styles.map((s) => s.toUpperCase()).join(' · ')}
            </MetaRow>
          )}

          <MetaRow label="Items">{brand.product_count} in Gyeol</MetaRow>

          <MetaRow label="Updated">{updatedLabel}</MetaRow>
        </div>
      </div>
    </div>
  );
};

export default BrandMetaGrid;
