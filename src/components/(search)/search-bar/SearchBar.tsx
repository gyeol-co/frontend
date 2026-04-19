'use client';

import { useRef } from 'react';
import type React from 'react';

export interface SearchBarProps {
  /** Controlled input value — parent owns this (drives debounce + URL sync). */
  value: string;
  /** Every keystroke; parent debounces before updating URL. */
  onChange: (next: string) => void;
  /** Enter key or clicking the submit affordance. Parent flushes debounce. */
  onSubmit: (value: string) => void;
  /** Clear button — empties input and returns focus. */
  onClear: () => void;
  /** Auto-focus on first mount (empty state entry). */
  autoFocus?: boolean;
  /** Placeholder copy. */
  placeholder?: string;
}

/**
 * Top search input — big display-font text field + optional "×" clear chip.
 * Pure controlled component: owns no debounce or URL logic.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  autoFocus = false,
  placeholder = '무엇을 찾고 있나요?',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleClearClick = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '2px solid #111',
        padding: '18px 0',
      }}
    >
      <span
        aria-hidden
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: 2,
          color: 'rgba(17,17,17,0.4)',
          textTransform: 'uppercase',
        }}
      >
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-display)',
          fontSize: 38,
          fontWeight: 400,
          letterSpacing: -0.8,
          color: '#111',
        }}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClearClick}
          aria-label="Clear search"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.55)',
            textTransform: 'uppercase',
            padding: '6px 10px',
          }}
        >
          Clear ×
        </button>
      )}
    </form>
  );
};

export default SearchBar;
