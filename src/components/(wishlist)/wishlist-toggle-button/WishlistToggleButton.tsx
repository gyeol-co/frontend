'use client';

import { useState } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';

import { useAuthMe } from 'src/hooks/(auth)';
import { useIsInWishlist, useWishlistToggle } from 'src/hooks/(wishlist)';
import { ApiError } from 'src/lib/api-client';

export interface WishlistToggleButtonProps {
  productId: string;
  /** Seed the initial state until the wishlist list cache warms up. */
  initialIsSaved?: boolean;
  /** Redirect target after login for guests. */
  loginNext?: string;
}

/**
 * Large `+ Save / ✓ Saved` CTA used on the product detail page.
 * Mirrors `Gyeol Unified.html` lines 2107-2122.
 */
const WishlistToggleButton: React.FC<WishlistToggleButtonProps> = ({
  productId,
  initialIsSaved = false,
  loginNext,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuthMe();
  const isSaved = useIsInWishlist(productId, initialIsSaved);
  const toggle = useWishlistToggle();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (isLoading) return;
    setStatusMessage(null);

    if (!user) {
      const next = loginNext ?? `/products/${productId}`;
      const qs = new URLSearchParams({ next }).toString();
      router.push(`/login?${qs}`);
      return;
    }

    try {
      await toggle.mutateAsync({ productId, isCurrentlyInList: isSaved });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'WISHLIST_FULL') {
          setStatusMessage('최대 500개까지 저장할 수 있어요.');
          return;
        }
        if (err.code === 'PRODUCT_NOT_FOUND') {
          setStatusMessage('이미 사라진 상품이에요.');
          return;
        }
        if (err.code === 'AUTH_REQUIRED') {
          const next = loginNext ?? `/products/${productId}`;
          router.push(`/login?${new URLSearchParams({ next }).toString()}`);
          return;
        }
      }
      setStatusMessage('일시적인 오류가 발생했어요.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={toggle.isPending}
        aria-pressed={isSaved}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          padding: '12px 18px',
          border: `1px solid ${isSaved ? '#111' : 'rgba(17,17,17,0.2)'}`,
          background: isSaved ? '#111' : 'transparent',
          color: isSaved ? '#fafaf8' : '#111',
          cursor: toggle.isPending ? 'wait' : 'pointer',
          fontWeight: 500,
          minWidth: 120,
        }}
      >
        {isSaved ? '✓ Saved' : '＋ Save'}
      </button>
      {statusMessage && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.2,
            color: 'rgba(17,17,17,0.65)',
            textTransform: 'uppercase',
          }}
        >
          ! {statusMessage}
        </div>
      )}
    </div>
  );
};

export default WishlistToggleButton;
