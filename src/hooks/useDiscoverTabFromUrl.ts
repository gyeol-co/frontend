'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type DiscoverTabKey = 'popular' | 'new' | 'foryou' | 'following';

export const DISCOVER_TAB_KEYS: DiscoverTabKey[] = ['popular', 'new', 'foryou', 'following'];

const DEFAULT_TAB: DiscoverTabKey = 'popular';

const isDiscoverTabKey = (v: string | null | undefined): v is DiscoverTabKey =>
  v === 'popular' || v === 'new' || v === 'foryou' || v === 'following';

export interface UseDiscoverTabFromUrlReturn {
  /** Active tab — falls back to `'popular'` when the URL is missing/invalid. */
  tab: DiscoverTabKey;
  /** Updates `?tab=` via `router.replace`, preserving other params. */
  setTab: (tab: DiscoverTabKey) => void;
}

/**
 * URL-backed discover tab state.
 *
 * Using URL search params keeps back/forward and deep-linking natural
 * (`/discover?tab=foryou`). Nothing else in discover is URL-synced for now —
 * category filters, cursor, etc. live in React Query cache only.
 */
export const useDiscoverTabFromUrl = (): UseDiscoverTabFromUrlReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get('tab');
  const tab: DiscoverTabKey = isDiscoverTabKey(raw) ? raw : DEFAULT_TAB;

  const setTab = useCallback(
    (next: DiscoverTabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', next);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab };
};
