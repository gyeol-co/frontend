import { Suspense } from 'react';

import { SearchPage } from 'src/components/(search)';

const SearchFallback = () => (
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
    Loading search…
  </div>
);

/**
 * `/search` route. The inner client page reads `useSearchParams` via
 * `useSearchUrlState`, so we wrap in `<Suspense>` per Next.js 15 CSR bailout
 * rules (matches the `/brands` route pattern).
 */
const SearchRoute = () => (
  <Suspense fallback={<SearchFallback />}>
    <SearchPage />
  </Suspense>
);

export default SearchRoute;
