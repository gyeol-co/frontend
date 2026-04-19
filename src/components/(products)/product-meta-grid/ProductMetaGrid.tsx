import type React from 'react';

import { formatDaysAgo } from 'src/utils/format-days-ago';

import type { ProductDetail } from 'src/types/product-types';

export interface ProductMetaGridProps {
  product: ProductDetail;
}

interface MetaRowProps {
  label: string;
  children: React.ReactNode;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, children }) => (
  <>
    <div
      style={{
        color: 'rgba(17,17,17,0.45)',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 9.5,
        paddingTop: 2,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {label}
    </div>
    <div style={{ lineHeight: 1.55, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 0.6 }}>
      {children}
    </div>
  </>
);

/**
 * Product detail meta grid. Key/value layout matches `Gyeol Unified.html`
 * lines 2144-2225.
 */
const ProductMetaGrid: React.FC<ProductMetaGridProps> = ({ product }) => {
  const daysLabel = formatDaysAgo(product.created);
  const tagsLabel = product.tags.length > 0 ? product.tags.join(' · ') : '—';

  return (
    <div
      style={{
        borderTop: '1px solid rgba(17,17,17,0.12)',
        paddingTop: 22,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        Details · {product.id.slice(0, 8)}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '96px 1fr',
          rowGap: 12,
          columnGap: 20,
          color: 'rgba(17,17,17,0.85)',
        }}
      >
        <MetaRow label="Brand">
          <span>{product.brand.name}</span>
          {product.brand.name_ko && (
            <span style={{ color: 'rgba(17,17,17,0.55)' }}> · {product.brand.name_ko}</span>
          )}
        </MetaRow>

        <MetaRow label="Category">
          {product.category}
          {product.subcategory ? ` · ${product.subcategory}` : ''}
          {product.sub_category_detail ? ` · ${product.sub_category_detail}` : ''}
        </MetaRow>

        {product.fit && <MetaRow label="Fit">{product.fit}</MetaRow>}

        {product.color && <MetaRow label="Color">{product.color}</MetaRow>}

        {product.pattern && <MetaRow label="Pattern">{product.pattern}</MetaRow>}

        {product.material.length > 0 && (
          <MetaRow label="Material">{product.material.join(' · ')}</MetaRow>
        )}

        {product.details.length > 0 && (
          <MetaRow label="Details">{product.details.join(' · ')}</MetaRow>
        )}

        {product.styles.length > 0 && (
          <MetaRow label="Styles">{product.styles.join(' · ')}</MetaRow>
        )}

        <MetaRow label="Tags">{tagsLabel}</MetaRow>

        <MetaRow label="Added">
          {product.created.slice(0, 10)}
          {daysLabel ? ` (${daysLabel})` : ''}
        </MetaRow>

        <MetaRow label="Views · 7d">{product.stats.view_count_7d.toLocaleString()}</MetaRow>

        <MetaRow label="Saved by">{product.stats.wishlist_count.toLocaleString()} people</MetaRow>
      </div>
    </div>
  );
};

export default ProductMetaGrid;
