'use client';

import type React from 'react';

import type { BrandIndexSort } from 'src/types/brand-types';

export interface BrandSortBarProps {
  sort: BrandIndexSort;
  onSortChange: (sort: BrandIndexSort) => void;
  style: string[];
  /** Canonical style tag options (see `constants/brand-styles.ts`). */
  styleOptions: readonly string[];
  onStyleChange: (style: string[]) => void;
  /** Visible count for the right-rail indicator. */
  shownCount: number;
}

interface SortOption {
  key: BrandIndexSort;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'alpha', label: 'A–Z' },
  { key: 'featured', label: 'Featured' },
  { key: 'recent', label: 'Recent updates' },
];

/**
 * Brand Index sort buttons + style multi-select + "Showing N" indicator.
 * Sort is single-select; style is multi-select (clicking a chip toggles it
 * in place).
 *
 * Style options are supplied by the parent — derived from the loaded brand
 * items rather than a hard-coded constant. Empty list means no chips render
 * (first page hasn't resolved yet).
 */
const BrandSortBar: React.FC<BrandSortBarProps> = ({
  sort,
  onSortChange,
  style,
  styleOptions,
  onStyleChange,
  shownCount,
}) => {
  const handleStyleToggle = (tag: string) => {
    if (style.includes(tag)) {
      onStyleChange(style.filter((s) => s !== tag));
    } else {
      onStyleChange([...style, tag]);
    }
  };

  const pillStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    padding: '6px 10px',
    border: `1px solid ${active ? '#111' : 'rgba(17,17,17,0.15)'}`,
    background: active ? '#111' : 'transparent',
    color: active ? '#fafaf8' : '#111',
    cursor: 'pointer',
  });

  return (
    <div
      style={{
        padding: '18px 48px',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.3,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
        }}
      >
        Sort
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSortChange(opt.key)}
            style={pillStyle(sort === opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {styleOptions.length > 0 && (
        <>
          <div style={{ width: 1, height: 20, background: 'rgba(17,17,17,0.1)' }} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              letterSpacing: 1.3,
              color: 'rgba(17,17,17,0.5)',
              textTransform: 'uppercase',
            }}
          >
            Style
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onStyleChange([])}
              style={pillStyle(style.length === 0)}
            >
              All
            </button>
            {styleOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleStyleToggle(tag)}
                style={pillStyle(style.includes(tag))}
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(17,17,17,0.55)',
          textTransform: 'uppercase',
        }}
      >
        Showing {shownCount}
      </div>
    </div>
  );
};

export default BrandSortBar;
