'use client';

import { Suspense, useEffect, useState } from 'react';
import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { AuthShell, SignupForm } from 'src/components/(auth)';

import type { SignupFormMode } from 'src/components/(auth)';
import type { OAuthProvider, PendingOAuthState } from 'src/types/auth-types';

const isOAuthProvider = (value: string | null): value is OAuthProvider =>
  value === 'kakao' || value === 'naver' || value === 'google';

/**
 * Inner — reads search params and sessionStorage. Must sit under a Suspense
 * boundary because of `useSearchParams` (Next 15 prerender rule).
 */
const SignupFormWithParams: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode: SignupFormMode = isOAuthProvider(searchParams.get('mode')) ? 'oauth' : 'email';
  const [pending, setPending] = useState<PendingOAuthState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate OAuth pending state. Delay render until we've checked sessionStorage
  // so we don't briefly render an empty OAuth form.
  useEffect(() => {
    if (mode !== 'oauth') {
      setIsHydrated(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem('auth.pendingOAuth');
      if (raw) {
        const parsed = JSON.parse(raw) as PendingOAuthState;
        if (parsed.pending_token && isOAuthProvider(parsed.provider)) {
          setPending(parsed);
        }
      }
    } catch {
      // Malformed sessionStorage — treat as absent.
    }
    setIsHydrated(true);
  }, [mode]);

  // If OAuth mode but no valid pending — bounce to /login.
  useEffect(() => {
    if (mode === 'oauth' && isHydrated && !pending) {
      router.replace('/login');
    }
  }, [mode, isHydrated, pending, router]);

  if (!isHydrated) {
    return (
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <SignupForm
      mode={mode}
      pending={pending ?? undefined}
      onGoLogin={() => router.push('/login')}
    />
  );
};

const SignupPage: React.FC = () => {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignupFormWithParams />
      </Suspense>
    </AuthShell>
  );
};

export default SignupPage;
