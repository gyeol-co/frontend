'use client';

import type React from 'react';

import { useRouter } from 'next/navigation';

import { useAuthMe } from 'src/hooks/(auth)';
import { useIsInWishlist, useWishlistToggle } from 'src/hooks/(wishlist)';
import { ApiError } from 'src/lib/api-client';

export interface WishlistSaveChipProps {
  productId: string;
  /**
   * Seed value for `useIsInWishlist` when the wishlist cache hasn't loaded yet
   * (e.g. visiting Discover before Saved). Typically the `is_wishlisted` field
   * on the list item.
   */
  initialIsSaved?: boolean;
  /** Path to restore after login when a guest clicks save. */
  loginNext?: string;
}

/**
 * Small `+ Save` / `✓ Saved` chip for product cards.
 *
 * - Stops event propagation so it doesn't also trigger the card's navigate.
 * - Guest click → `/login?next=...` (redirect rather than toast).
 * - On failure: rolls back via the list invalidate in `useWishlistToggle`
 *   and surfaces a lightweight status through the button label change only
 *   (toasts aren't wired up yet; upgrade when a toast system lands).
 */
const WishlistSaveChip: React.FC<WishlistSaveChipProps> = ({
  productId,
  initialIsSaved = false,
  loginNext,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuthMe();
  const isSaved = useIsInWishlist(productId, initialIsSaved);
  const toggle = useWishlistToggle();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;

    if (!user) {
      const next = loginNext ?? '/discover';
      const qs = new URLSearchParams({ next }).toString();
      router.push(`/login?${qs}`);
      return;
    }

    try {
      await toggle.mutateAsync({ productId, isCurrentlyInList: isSaved });
    } catch (err) {
      // Toast system not wired yet — fall back to native alert for cap / 404
      // so the user gets some signal. `useWishlistToggle.onSettled` refetches
      // the wishlist list which reverts the chip visual.
      if (err instanceof ApiError) {
        if (err.code === 'WISHLIST_FULL') {
          alert('위시리스트는 최대 500개까지 저장할 수 있어요.');
          return;
        }
        if (err.code === 'PRODUCT_NOT_FOUND') {
          alert('이미 사라진 상품이에요.');
          return;
        }
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={isSaved}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        padding: '4px 8px',
        flexShrink: 0,
        border: `1px solid ${isSaved ? '#111' : 'rgba(17,17,17,0.15)'}`,
        background: isSaved ? '#111' : 'transparent',
        color: isSaved ? '#fafaf8' : '#111',
        cursor: toggle.isPending ? 'wait' : 'pointer',
        opacity: toggle.isPending ? 0.6 : 1,
        fontWeight: 500,
      }}
    >
      {isSaved ? '✓ Saved' : '+ Save'}
    </button>
  );
};

export default WishlistSaveChip;
