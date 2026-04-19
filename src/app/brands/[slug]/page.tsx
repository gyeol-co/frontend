import { Suspense } from 'react';

import { BrandDetailPage } from 'src/components/(brand-detail)';

interface BrandDetailRouteProps {
  params: Promise<{ slug: string }>;
}

const BrandDetailFallback = () => (
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
    Loading brand…
  </div>
);

/**
 * Server component wrapper — resolves the dynamic `slug` param and hands it
 * to the client `BrandDetailPage`. The inner page reads `useSearchParams`
 * for the category tab, so it sits inside `<Suspense>`.
 */
const BrandDetailRoute = async ({ params }: BrandDetailRouteProps) => {
  const { slug } = await params;
  return (
    <Suspense fallback={<BrandDetailFallback />}>
      <BrandDetailPage slug={slug} />
    </Suspense>
  );
};

export default BrandDetailRoute;
