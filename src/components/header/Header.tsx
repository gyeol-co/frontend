'use client';

import { useState } from 'react';
import type React from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthMe, useLogoutMutation } from 'src/hooks/(auth)';
import { ApiError } from 'src/lib/api-client';

interface NavItem {
  label: string;
  href: string;
  /** Pathname prefixes that mark this tab active (handles nested routes). */
  match: readonly string[];
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Discover', href: '/discover', match: ['/discover', '/products'] },
  { label: 'Brands', href: '/brands', match: ['/brands'] },
  { label: 'Saved', href: '/saved', match: ['/saved'] },
];

const isNavActive = (item: NavItem, pathname: string) =>
  item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

/**
 * Minimal placeholder header. The full `UnifiedNav` (Discover/Brands/Saved
 * tabs + counts) ships alongside product/brand features — this build covers
 * only auth state.
 */
const Header: React.FC = () => {
  const { user, isLoading } = useAuthMe();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  const handleLogoutClick = async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
      router.replace('/login');
    } catch (err) {
      if (err instanceof ApiError) setError('로그아웃에 실패했어요.');
      else setError('일시적인 오류가 발생했어요.');
    }
  };

  const renderRight = () => {
    if (isLoading) return null;
    if (user) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.75)',
          }}
        >
          <span>{user.display_name}</span>
          <button
            type="button"
            onClick={handleLogoutClick}
            disabled={logoutMutation.isPending}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: logoutMutation.isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'inherit',
              color: '#111',
              borderBottom: '1px solid #111',
              paddingBottom: 1,
            }}
          >
            {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      );
    }
    return (
      <Link
        href="/login"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: '#111',
          borderBottom: '1px solid #111',
          paddingBottom: 1,
          textDecoration: 'none',
        }}
      >
        Sign in ↗
      </Link>
    );
  };

  return (
    <header
      style={{
        borderTop: '2px solid #111',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        padding: '18px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: '#fafaf8',
      }}
    >
      <Link
        href="/discover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          textDecoration: 'none',
          color: 'inherit',
          justifySelf: 'start',
        }}
      >
        <svg width="24" height="30" viewBox="0 0 120 150" fill="none" style={{ flexShrink: 0 }}>
          <g stroke="#111" strokeWidth="3" strokeLinecap="square">
            <line x1="20" y1="14" x2="100" y2="14" />
            <line x1="100" y1="14" x2="100" y2="42" />
            <line x1="20" y1="60" x2="100" y2="60" />
            <line x1="20" y1="76" x2="100" y2="76" />
            <line x1="60" y1="50" x2="60" y2="92" />
            <line x1="20" y1="106" x2="100" y2="106" />
            <line x1="100" y1="106" x2="100" y2="120" />
            <line x1="20" y1="120" x2="100" y2="120" />
            <line x1="20" y1="120" x2="20" y2="134" />
            <line x1="20" y1="134" x2="112" y2="134" />
          </g>
        </svg>
        <div
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 4,
            color: '#111',
          }}
        >
          GYEOL
        </div>
      </Link>

      <nav style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                letterSpacing: 2.2,
                textTransform: 'uppercase',
                color: active ? '#111' : 'rgba(17,17,17,0.45)',
                fontWeight: active ? 500 : 400,
                borderBottom: active ? '2px solid #111' : '2px solid transparent',
                padding: '8px 0',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 20 }}>
        {error && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.65)',
              textTransform: 'uppercase',
            }}
          >
            ! {error}
          </span>
        )}
        <Link
          href="/search"
          aria-label="Search"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: pathname.startsWith('/search') ? '#111' : 'rgba(17,17,17,0.7)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span aria-hidden>⌕</span>
          <span>Search</span>
        </Link>
        {renderRight()}
      </div>
    </header>
  );
};

export default Header;
