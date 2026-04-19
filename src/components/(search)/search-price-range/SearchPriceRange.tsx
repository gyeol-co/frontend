'use client';

import { useEffect, useState } from 'react';
import type React from 'react';

export interface SearchPriceRangeProps {
  /** Current KRW min — `undefined` when not set. */
  min: number | undefined;
  /** Current KRW max — `undefined` when not set. */
  max: number | undefined;
  /**
   * Fires on blur of either input (or Enter). Values are already coerced to
   * undefined when the field is empty or non-numeric.
   */
  onChange: (min: number | undefined, max: number | undefined) => void;
}

const parseField = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed.replace(/[^\d]/g, ''));
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.floor(n);
};

/**
 * Two KRW number inputs for `price_min` / `price_max`. Local state holds the
 * raw text so users can type partial values; commits to the parent on blur.
 */
const SearchPriceRange: React.FC<SearchPriceRangeProps> = ({ min, max, onChange }) => {
  const [minText, setMinText] = useState<string>(min !== undefined ? String(min) : '');
  const [maxText, setMaxText] = useState<string>(max !== undefined ? String(max) : '');

  // Sync external → internal when URL changes from outside (e.g. clearFilters).
  useEffect(() => {
    setMinText(min !== undefined ? String(min) : '');
  }, [min]);
  useEffect(() => {
    setMaxText(max !== undefined ? String(max) : '');
  }, [max]);

  const commit = () => {
    onChange(parseField(minText), parseField(maxText));
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: 88,
    padding: '6px 10px',
    border: '1px solid rgba(17,17,17,0.2)',
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    letterSpacing: 1.1,
    color: '#111',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Min KRW"
        value={minText}
        onChange={(e) => setMinText(e.target.value)}
        onBlur={commit}
        onKeyDown={handleEnter}
        style={inputStyle}
      />
      <span
        aria-hidden
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(17,17,17,0.4)',
        }}
      >
        —
      </span>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Max KRW"
        value={maxText}
        onChange={(e) => setMaxText(e.target.value)}
        onBlur={commit}
        onKeyDown={handleEnter}
        style={inputStyle}
      />
    </div>
  );
};

export default SearchPriceRange;
