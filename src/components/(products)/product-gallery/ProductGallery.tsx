'use client';

import { useState } from 'react';
import type React from 'react';

import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { ProductDetail } from 'src/types/product-types';

export interface ProductGalleryProps {
  product: ProductDetail;
}

/**
 * Detail page gallery — large hero image + a 4-up thumbnail strip below.
 * Clicking a thumbnail swaps the hero image. Matches `Gyeol Unified.html`
 * lines 2004-2027.
 */
const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.thumbnail_url);

  const thumbnails = product.image_urls.slice(0, 4);
  const daysLabel = formatDaysAgo(product.created);
  const isNew = daysLabel && daysLabel !== `${8}일 전`; // rough 7-day guard at UI level

  return (
    <div style={{ position: 'relative', maxWidth: 520, marginInline: 'auto' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          background: '#e8e6e1',
          overflow: 'hidden',
        }}
      >
        <img
          src={mainImage}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {isNew && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              background: '#111',
              color: '#fafaf8',
              padding: '5px 10px',
            }}
          >
            New · {daysLabel}
          </div>
        )}
      </div>

      {thumbnails.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(thumbnails.length, 1)}, 1fr)`,
            gap: 10,
            marginTop: 12,
          }}
        >
          {thumbnails.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setMainImage(url)}
              style={{
                padding: 0,
                border: mainImage === url ? '2px solid #111' : '2px solid transparent',
                cursor: 'pointer',
                background: 'transparent',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                <img
                  src={url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
