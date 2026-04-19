'use client';

import type React from 'react';

import { useRouter } from 'next/navigation';

import { BrandCover } from 'src/components/(brands)/brand-cover';
import { BrandFollowButton } from 'src/components/(brands)/brand-follow-button';

import type { BrandDetail } from 'src/types/brand-types';

export interface BrandHeroProps {
  brand: BrandDetail;
}

/**
 * Detail top block — breadcrumb ← · title · tagline · follow + visit-official
 * · cover on the right. Matches `design/project/brand-views.jsx` L306-361.
 */
const BrandHero: React.FC<BrandHeroProps> = ({ brand }) => {
  const router = useRouter();
  const nextPath = `/brands/${brand.slug}`;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace('/brands');
  };

  const metaLine = [
    brand.styles.slice(0, 2).map((s) => s.toUpperCase()).join(' · '),
  ]
    .filter(Boolean)
    .join(' · ');


  const sep = <span style={{ color: 'rgba(17,17,17,0.3)' }}>/</span>;

  return (
    <>
      <div
        style={{
          padding: '18px 48px',
          borderBottom: '1px solid rgba(17,17,17,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          background: '#fafaf8',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            letterSpacing: 'inherit',
            textTransform: 'inherit',
            color: 'rgba(17,17,17,0.55)',
          }}
        >
          ← Brands
        </button>
        {sep}
        <span style={{ color: '#111' }}>{brand.name}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 480px) 1fr',
          alignItems: 'stretch',
          borderBottom: '1px solid rgba(17,17,17,0.08)',
        }}
      >
        <div
          style={{
            padding: '56px 48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {metaLine && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 1.8,
                color: 'rgba(17,17,17,0.55)',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              {metaLine}
            </div>
          )}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 52,
              fontWeight: 400,
              letterSpacing: -1.4,
              lineHeight: 0.96,
              margin: 0,
              textWrap: 'balance',
            }}
          >
            {brand.name}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 28,
            }}
          >
            <BrandFollowButton
              slug={brand.slug}
              isFollowed={brand.is_followed}
              variant="large"
              loginNext={nextPath}
              stopPropagation={false}
            />
            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  color: '#111',
                  textDecoration: 'none',
                  borderBottom: '1px solid #111',
                  paddingBottom: 1,
                }}
              >
                Visit official ↗
              </a>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            minHeight: 440,
            background: '#f0eee9',
          }}
        >
          <BrandCover slug={brand.slug} name={brand.name} coverUrl={brand.cover_url} fill />
        </div>
      </div>
    </>
  );
};

export default BrandHero;
