'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import type React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { authMeQueryOptions } from 'src/hooks/(auth)';
import { ApiError, authOAuthCallbackGet } from 'src/lib/api-client';

import type { OAuthProvider, PendingOAuthState } from 'src/types/auth-types';

const isOAuthProvider = (value: string | undefined): value is OAuthProvider =>
  value === 'kakao' || value === 'naver' || value === 'google';

/**
 * Inner — reads search params and params. Wrapped in Suspense by the page.
 */
const OAuthCallbackInner: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const queryClient = useQueryClient();

  const providerParam = Array.isArray(params.provider) ? params.provider[0] : params.provider;
  const provider = isOAuthProvider(providerParam) ? providerParam : null;

  const [message, setMessage] = useState<string>('로그인을 마무리하고 있어요.');

  // Strict mode fires effects twice in dev — guard so we don't exchange the
  // code twice (state is single-use).
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const controller = new AbortController();

    const run = async () => {
      if (!provider) {
        router.replace('/login');
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (!code || !state) {
        setMessage('로그인 응답이 올바르지 않아요.');
        router.replace('/login');
        return;
      }

      try {
        const data = await authOAuthCallbackGet(
          provider,
          { code, state, error: errorParam },
          { signal: controller.signal },
        );

        if (data.status === 'logged_in') {
          queryClient.setQueryData(authMeQueryOptions.queryKey, { user: data.user });
          const nextPath = data.next.startsWith('/') ? data.next : '/discover';
          router.replace(nextPath);
          return;
        }

        // needs_signup — stash context for /signup to consume.
        const pending: PendingOAuthState = {
          pending_token: data.pending_token,
          provider: data.provider,
          provider_email: data.provider_email,
          next: data.next,
        };
        sessionStorage.setItem('auth.pendingOAuth', JSON.stringify(pending));
        router.replace(`/signup?mode=${data.provider}`);
      } catch (err) {
        // Aborted by Strict Mode cleanup — ignore.
        if (err instanceof DOMException && err.name === 'AbortError') return;

        if (err instanceof ApiError) {
          const friendly: Record<string, string> = {
            OAUTH_USER_DENIED: '로그인이 취소되었어요.',
            OAUTH_STATE_MISMATCH: '로그인을 다시 시도해주세요.',
            OAUTH_PROVIDER_ERROR: 'OAuth 로그인에 실패했어요.',
            ACCOUNT_DEACTIVATED: '비활성화된 계정입니다.',
          };
          setMessage(friendly[err.code] ?? '로그인에 실패했어요.');
        } else {
          setMessage('로그인에 실패했어요.');
        }
        setTimeout(() => router.replace('/login'), 1200);
      }
    };

    void run();

    return () => controller.abort();
  }, [provider, searchParams, router, queryClient]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        background: '#fafaf8',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.8,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
        }}
      >
        {provider ? `Continuing with ${provider}` : 'OAuth'}
      </div>
      <div style={{ fontSize: 14, color: 'rgba(17,17,17,0.75)' }}>{message}</div>
    </div>
  );
};

const OAuthCallbackPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafaf8',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.8,
              color: 'rgba(17,17,17,0.5)',
              textTransform: 'uppercase',
            }}
          >
            Loading…
          </div>
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
};

export default OAuthCallbackPage;
