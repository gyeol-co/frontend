import type React from 'react';

import type { OAuthProvider } from 'src/types/auth-types';

export interface SignupFormOAuthBannerProps {
  provider: OAuthProvider;
  providerEmail: string;
}

/**
 * OAuth-mode banner: "Signed in with kakao — you@kakao.com".
 * Design: lines 1150-1162.
 */
const SignupFormOAuthBanner: React.FC<SignupFormOAuthBannerProps> = ({ provider, providerEmail }) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        marginBottom: 20,
        background: '#f0eee9',
        border: '1px solid rgba(17,17,17,0.08)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.55)',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        Signed in with {provider}
      </div>
      <div style={{ fontSize: 13 }}>{providerEmail}</div>
    </div>
  );
};

export default SignupFormOAuthBanner;
