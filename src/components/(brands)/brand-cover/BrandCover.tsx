'use client';

import type React from 'react';

import { getBrandCoverStripe } from 'src/utils/brand-cover-stripe';

export interface BrandCoverProps {
  slug: string;
  name: string;
  coverUrl: string | null;
  /** CSS aspect-ratio. Default `4 / 3` for the main grid; `5 / 4` for compact. */
  aspect?: string;
  /** Render the centered brand wordmark on top of the stripe. Default true. */
  showWordmark?: boolean;
  /** Fill the parent container (parent must be `position: relative`). Ignores `aspect`. */
  fill?: boolean;
}

/**
 * Brand cover placeholder. Uses the CDN `cover_url` when provided; otherwise
 * falls back to a deterministic slug-hash stripe + centered wordmark.
 */
const BrandCover: React.FC<BrandCoverProps> = ({
  slug,
  name,
  coverUrl,
  aspect = '4 / 3',
  showWordmark = true,
  fill = false,
}) => {
  const stripe = getBrandCoverStripe(slug);

  const containerStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: coverUrl ? '#f2f0ec' : stripe.background,
      }
    : {
        width: '100%',
        aspectRatio: aspect,
        position: 'relative',
        overflow: 'hidden',
        background: coverUrl ? '#f2f0ec' : stripe.background,
      };

  return (
    <div style={containerStyle}>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            // 비율 제각각인 로고/배너/상품 썸네일을 letterbox 로 감싸 잘림 방지.
            // 가로가 부족하면 좌우에, 세로가 부족하면 상하에 컨테이너 배경색(#f2f0ec) 이 보임.
            objectFit: 'contain',
            display: 'block',
            padding: 12,
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 14,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: 1,
              color: 'rgba(0,0,0,0.45)',
              background: 'rgba(255,255,255,0.5)',
              padding: '2px 6px',
              textTransform: 'uppercase',
            }}
          >
            {name.split(' ')[0]} / COVER
          </div>
          {showWordmark && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 38,
                fontWeight: 400,
                letterSpacing: -0.6,
                color: 'rgba(17,17,17,0.8)',
                textAlign: 'center',
                padding: '0 20px',
                textWrap: 'balance',
              }}
            >
              {name}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrandCover;
