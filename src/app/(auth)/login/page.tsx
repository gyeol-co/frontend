'use client';

import { Suspense, useEffect } from 'react';
import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { AuthShell, LoginForm } from 'src/components/(auth)';
import { useAuthMe } from 'src/hooks/(auth)';

const LoginFormWithParams: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthMe();

  // Reject absolute URLs (open-redirect) — default back to /discover.
  const rawNext = searchParams.get('next');
  const next = rawNext && rawNext.startsWith('/') ? rawNext : '/discover';

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  return <LoginForm next={next} onGoSignup={() => router.push('/signup')} />;
};

/**
 * Next 15 requires components that read `useSearchParams` to live inside a
 * Suspense boundary so the static prerender can serialize a fallback.
 */
const LoginPage: React.FC = () => {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <LoginFormWithParams />
      </Suspense>
    </AuthShell>
  );
};

export default LoginPage;
