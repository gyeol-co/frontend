'use client';

import type React from 'react';

export interface SearchEmptyStateProps {
  /** Last 5 distinct queries for logged-in users. Empty array for guests. */
  recent: string[];
  /** BE-provided fixed suggestions. Available for guest + login. */
  suggestions: string[];
  /** Clicking a chip delegates to the parent to set `q` (bypasses debounce). */
  onChipClick: (value: string) => void;
  /** Hydration/fetch in progress — render muted placeholders instead of chips. */
  isLoading?: boolean;
}

const chipStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  padding: '8px 14px',
  border: '1px solid rgba(17,17,17,0.18)',
  background: 'transparent',
  color: '#111',
  cursor: 'pointer',
};

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9.5,
  letterSpacing: 1.6,
  color: 'rgba(17,17,17,0.5)',
  textTransform: 'uppercase',
  marginBottom: 14,
};

const sectionWrap: React.CSSProperties = {
  marginBottom: 36,
};

/**
 * Empty state shown when `q.length < 2`. Two sections:
 * - "최근 검색" — only when `recent.length > 0`.
 * - "추천 검색" — always (BE guarantees non-empty `suggestions`).
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  recent,
  suggestions,
  onChipClick,
  isLoading = false,
}) => {
  const renderChips = (items: string[]) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChipClick(value)}
          style={chipStyle}
        >
          {value}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div
        style={{
          padding: '40px 48px 80px',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.45)',
          textTransform: 'uppercase',
        }}
      >
        Loading suggestions…
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 48px 80px' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          letterSpacing: -0.3,
          color: '#111',
          marginBottom: 32,
        }}
      >
        이렇게 찾아보세요.
      </div>

      {recent.length > 0 && (
        <div style={sectionWrap}>
          <div style={sectionLabel}>최근 검색</div>
          {renderChips(recent)}
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={sectionWrap}>
          <div style={sectionLabel}>추천 검색</div>
          {renderChips(suggestions)}
        </div>
      )}
    </div>
  );
};

export default SearchEmptyState;
