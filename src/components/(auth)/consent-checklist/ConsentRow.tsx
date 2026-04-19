import type React from 'react';

export interface ConsentRowProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  /** `undefined` when rendered as the "전체 동의" row. */
  required?: boolean;
  /** "전체 동의" row — bolder copy, suppresses the 필수/선택 chip. */
  emphasis?: boolean;
  /** Detail-expand handler. Omit to hide the "보기 / 접기" button. */
  onViewDetail?: () => void;
  expanded?: boolean;
}

/**
 * One checkbox row + optional required/optional chip + view toggle.
 * Design: lines 1266-1312.
 */
const ConsentRow: React.FC<ConsentRowProps> = ({
  checked,
  onToggle,
  label,
  required,
  emphasis,
  onViewDetail,
  expanded,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 0',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: 20,
          height: 20,
          border: `1px solid ${checked ? '#111' : 'rgba(17,17,17,0.25)'}`,
          background: checked ? '#111' : 'transparent',
          color: '#fafaf8',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          flexShrink: 0,
        }}
        aria-checked={checked}
        role="checkbox"
      >
        {checked ? '✓' : ''}
      </button>
      <div
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: emphasis ? 500 : 400,
          color: emphasis ? '#111' : 'rgba(17,17,17,0.85)',
          letterSpacing: -0.1,
        }}
      >
        {label}
      </div>
      {required !== undefined && !emphasis && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: required ? '#111' : 'rgba(17,17,17,0.5)',
            padding: '2px 6px',
            border: `1px solid ${required ? '#111' : 'rgba(17,17,17,0.15)'}`,
          }}
        >
          {required ? '필수' : '선택'}
        </span>
      )}
      {onViewDetail && (
        <button
          type="button"
          onClick={onViewDetail}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.5)',
          }}
        >
          {expanded ? '접기' : '보기'}
        </button>
      )}
    </div>
  );
};

export default ConsentRow;
