import { Suspense } from 'react';

import { BrandIndexPage } from 'src/components/(brand-index)';

const BrandIndexFallback = () => (
  <div
    style={{
      padding: '60px 48px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: 1.4,
      color: 'rgba(17,17,17,0.5)',
      textTransform: 'uppercase',
      background: '#fafaf8',
      minHeight: '100vh',
    }}
  >
    Loading brands…
  </div>
);

/**
 * `/brands` Index route. The inner client page reads `useSearchParams` via
 * `useBrandIndexUrlState`, so we wrap it in `<Suspense>` per Next.js 15 CSR
 * bailout rules.
 */
const BrandsRoute = () => (
  <Suspense fallback={<BrandIndexFallback />}>
    <BrandIndexPage />
  </Suspense>
);

export default BrandsRoute;
