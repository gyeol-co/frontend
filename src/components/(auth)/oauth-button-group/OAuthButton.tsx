import type React from 'react';

import type { OAuthProvider } from 'src/types/auth-types';

export interface OAuthButtonProps {
  provider: OAuthProvider;
  label: string;
  onClick: () => void;
}

const PROVIDER_LETTER: Record<OAuthProvider, string> = {
  kakao: 'K',
  naver: 'N',
  google: 'G',
};

/**
 * Desaturated Gyeol-style OAuth button. Design: lines 927-951.
 */
const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, label, onClick }) => {
  const letter = PROVIDER_LETTER[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        marginBottom: 8,
        background: 'transparent',
        color: '#111',
        border: '1px solid rgba(17,17,17,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          border: '1px solid #111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {letter}
      </span>
      <span>{label}</span>
      <span style={{ marginLeft: 'auto', opacity: 0.4 }}>↗</span>
    </button>
  );
};

export default OAuthButton;
