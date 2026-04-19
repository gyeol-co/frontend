'use client';

import type React from 'react';

import OAuthButton from 'src/components/(auth)/oauth-button-group/OAuthButton';
import { useOAuthAuthorize } from 'src/hooks/(auth)';

import type { OAuthProvider } from 'src/types/auth-types';

export interface OAuthButtonGroupProps {
  /** Where the browser should land after a successful round-trip. */
  next?: string;
}

interface ProviderSpec {
  provider: OAuthProvider;
  label: string;
}

// Kakao 를 맨 아래로 내림 — 현재 개인 개발자 앱이라 이메일 scope 을 못
// 받아 OAuth 성공률이 불안정. Google/Naver 우선 노출, 비즈앱 전환하면
// 원래 순서로 복구.
const PROVIDERS: ProviderSpec[] = [
  { provider: 'google', label: 'Continue with Google' },
  { provider: 'naver', label: 'Continue with Naver' },
  { provider: 'kakao', label: 'Continue with Kakao' },
];

/**
 * Renders all three OAuth CTAs. Wires `useOAuthAuthorize` so clicks navigate
 * the browser to the BE authorize endpoint (which 302s to the provider).
 */
const OAuthButtonGroup: React.FC<OAuthButtonGroupProps> = ({ next }) => {
  const { startAuthorize } = useOAuthAuthorize();

  return (
    <>
      {PROVIDERS.map(({ provider, label }) => (
        <OAuthButton
          key={provider}
          provider={provider}
          label={label}
          onClick={() => startAuthorize(provider, next)}
        />
      ))}
    </>
  );
};

export default OAuthButtonGroup;
