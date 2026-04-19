'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthMe } from 'src/hooks/(auth)';

export interface UseAuthRequiredParams {
  /** Path to restore after login — becomes `?next={next}`. */
  next: string;
}

export interface UseAuthRequiredReturn {
  isLoading: boolean;
  isAuthorized: boolean;
}

/**
 * Shared guard for protected routes (For You / Following / Saved).
 *
 * While `/auth/me` is still probing, returns `isLoading: true` so the caller
 * can render a skeleton. Once resolved:
 * - logged in → `isAuthorized: true`, no redirect
 * - guest → replace to `/login?next={next}` and keep `isAuthorized: false`
 *
 * Kept as a hook rather than queryOptions because the redirect is a side
 * effect that belongs to any component gating on auth.
 */
export const useAuthRequired = ({ next }: UseAuthRequiredParams): UseAuthRequiredReturn => {
  const router = useRouter();
  const { user, isGuest, isLoading } = useAuthMe();

  useEffect(() => {
    if (!isGuest) return;
    const qs = new URLSearchParams({ next }).toString();
    router.replace(`/login?${qs}`);
  }, [isGuest, next, router]);

  return {
    isLoading,
    isAuthorized: !!user,
  };
};
