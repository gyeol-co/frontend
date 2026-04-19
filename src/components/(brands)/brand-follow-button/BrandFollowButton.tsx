'use client';

import { useState } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';

import { useAuthMe } from 'src/hooks/(auth)';
import { useBrandFollowToggle } from 'src/hooks/(brands)';
import { ApiError } from 'src/lib/api-client';

export type BrandFollowButtonVariant = 'chip' | 'large';

export interface BrandFollowButtonProps {
  slug: string;
  isFollowed: boolean;
  /** `chip` — for cards (small mono pill). `large` — Hero button. */
  variant?: BrandFollowButtonVariant;
  /** Return path after login for guests. */
  loginNext?: string;
  /** Stops `onClick` propagation so card navigation isn't triggered. Default `true`. */
  stopPropagation?: boolean;
}

interface ButtonStyle {
  padding: string;
  fontSize: number;
  letterSpacing: number;
  minWidth?: number;
}

const VARIANT_STYLE: Record<BrandFollowButtonVariant, ButtonStyle> = {
  chip: { padding: '4px 8px', fontSize: 9, letterSpacing: 1.2 },
  large: { padding: '10px 16px', fontSize: 10.5, letterSpacing: 1.4, minWidth: 140 },
};

const LABEL = {
  chip: { followed: '✓ Following', idle: '+ Follow' },
  large: { followed: '✓ Following', idle: '+ Follow brand' },
};

/**
 * Shared follow button. Guests get redirected to `/login?next=...`;
 * authenticated users trigger the optimistic toggle in `useBrandFollowToggle`.
 *
 * On error: rolls back via the hook and surfaces a compact inline status (toast
 * system not wired yet). `BRAND_NOT_FOUND` / `AUTH_REQUIRED` are handled with
 * a redirect-or-message strategy per `api-mapping.md` §G.
 */
const BrandFollowButton: React.FC<BrandFollowButtonProps> = ({
  slug,
  isFollowed,
  variant = 'chip',
  loginNext,
  stopPropagation = true,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuthMe();
  const toggle = useBrandFollowToggle();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isLoading) return;
    setStatusMessage(null);

    if (!user) {
      const next = loginNext ?? `/brands/${slug}`;
      const qs = new URLSearchParams({ next }).toString();
      router.push(`/login?${qs}`);
      return;
    }

    try {
      await toggle.mutateAsync({ slug, isCurrentlyFollowed: isFollowed });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'BRAND_NOT_FOUND') {
          setStatusMessage('브랜드를 찾을 수 없어요.');
          return;
        }
        if (err.code === 'AUTH_REQUIRED') {
          const next = loginNext ?? `/brands/${slug}`;
          router.push(`/login?${new URLSearchParams({ next }).toString()}`);
          return;
        }
        if (err.code === 'ACCOUNT_DEACTIVATED') {
          router.push('/login');
          return;
        }
      }
      setStatusMessage('일시적인 오류가 발생했어요.');
    }
  };

  const style = VARIANT_STYLE[variant];
  const label = isFollowed ? LABEL[variant].followed : LABEL[variant].idle;

  const button = (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={isFollowed}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        textTransform: 'uppercase',
        padding: style.padding,
        flexShrink: 0,
        border: `1px solid ${isFollowed ? '#111' : 'rgba(17,17,17,0.2)'}`,
        background: isFollowed ? '#111' : 'transparent',
        color: isFollowed ? '#fafaf8' : '#111',
        cursor: toggle.isPending ? 'wait' : 'pointer',
        opacity: toggle.isPending ? 0.6 : 1,
        fontWeight: 500,
        minWidth: style.minWidth,
      }}
    >
      {label}
    </button>
  );

  if (!statusMessage) return button;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      {button}
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
    </div>
  );
};

export default BrandFollowButton;
