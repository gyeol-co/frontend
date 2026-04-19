'use client';

import type React from 'react';

export interface SearchNoResultsProps {
  /** BE-echoed normalised query — drives "‘{query}'에 대한 결과" message. */
  query: string;
  /** Any filter beyond `q` is set — toggles the clear CTA. */
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

/**
 * Rendered when `q.length >= 2` but both products and brands came back empty.
 * Offers a filter-reset CTA that only appears when filters are the likely cause.
 */
const SearchNoResults: React.FC<SearchNoResultsProps> = ({
  query,
  hasActiveFilters,
  onClearFilters,
}) => (
  <div
    style={{
      padding: '80px 48px',
      textAlign: 'center',
      color: '#111',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26,
        fontWeight: 400,
        letterSpacing: -0.4,
        marginBottom: 10,
        textWrap: 'balance',
      }}
    >
      &lsquo;{query}&rsquo;에 대한 결과가 없어요.
    </div>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: 1.2,
        color: 'rgba(17,17,17,0.55)',
        textTransform: 'uppercase',
        marginBottom: 28,
      }}
    >
      다른 단어로 시도해보세요.
    </div>
    {hasActiveFilters && (
      <button
        type="button"
        onClick={onClearFilters}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: '#111',
          background: 'transparent',
          border: '1px solid #111',
          padding: '10px 16px',
          cursor: 'pointer',
        }}
      >
        필터 지우기
      </button>
    )}
  </div>
);

export default SearchNoResults;
