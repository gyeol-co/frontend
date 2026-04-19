'use client';

import type React from 'react';

import Link from 'next/link';

import { BrandCover } from 'src/components/(brands)/brand-cover';
import { BrandFollowButton } from 'src/components/(brands)/brand-follow-button';
import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { BrandIndexItem } from 'src/types/brand-types';

export type BrandCardVariant = 'full' | 'compact' | 'related';

export interface BrandCardProps {
  brand: BrandIndexItem;
  /**
   * - `full` — main 3-col Index grid. Full meta, styles chips, footer stats.
   * - `compact` — Featured shortlist. Smaller cover, no tagline/chips.
   * - `related` — Detail's related block. Minimal: title + region/styles meta + chips, no cover.
   */
  variant?: BrandCardVariant;
  /** Return path after login for guests when they tap follow. */
  loginNext?: string;
}

const muted = 'rgba(17,17,17,0.55)';
const line = 'rgba(17,17,17,0.08)';

/**
 * Index grid card — cover + name + follow chip + meta + style chips + footer.
 * `variant` switches between the 3-col Index grid (`full`), the Featured
 * shortlist (`compact`), and the Detail Related block (`related`, no cover).
 */
const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  variant = 'full',
  loginNext,
}) => {
  const isCompact = variant === 'compact';
  const isRelated = variant === 'related';

  const metaLine = brand.name_ko || brand.styles.slice(0, 2).map((s) => s.toUpperCase()).join(' · ');
  const daysLabel = formatDaysAgo(brand.product_added);

  if (isRelated) {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          background: '#fafaf8',
          border: '1px solid rgba(17,17,17,0.1)',
          padding: 20,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.3,
            marginBottom: 6,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.4,
            color: muted,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {metaLine || '—'}
        </div>
        {brand.styles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {brand.styles.slice(0, 3).map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: 0.6,
                  color: muted,
                  textTransform: 'uppercase',
                  border: '1px solid rgba(17,17,17,0.12)',
                  padding: '2px 7px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/brands/${brand.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <BrandCover
        slug={brand.slug}
        name={brand.name}
        coverUrl={brand.cover_url}
        aspect={isCompact ? '5 / 4' : '4 / 3'}
      />

      <div style={{ paddingTop: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isCompact ? 18 : 22,
              fontWeight: 500,
              letterSpacing: -0.3,
              lineHeight: 1.15,
              flex: 1,
              minWidth: 0,
            }}
          >
            {brand.name}
          </div>
          <BrandFollowButton
            slug={brand.slug}
            isFollowed={brand.is_followed}
            variant="chip"
            loginNext={loginNext}
          />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: 1.4,
            color: muted,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {metaLine || '—'}
        </div>

        {!isCompact && brand.styles.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 10,
            }}
          >
            {brand.styles.slice(0, 3).map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: 0.6,
                  color: muted,
                  textTransform: 'uppercase',
                  border: '1px solid rgba(17,17,17,0.1)',
                  padding: '2px 7px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: 10,
            borderTop: `1px solid ${line}`,
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.2,
            color: muted,
            textTransform: 'uppercase',
          }}
        >
          <span>{brand.product_count} items</span>
          {brand.new_count > 0 ? (
            <span style={{ color: '#111' }}>
              +{brand.new_count} new{daysLabel ? ` · ${daysLabel}` : ''}
            </span>
          ) : (
            <span style={{ opacity: 0.6 }}>{daysLabel ? `Updated ${daysLabel}` : 'No updates yet'}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;
