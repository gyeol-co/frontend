'use client';

import { Suspense } from 'react';
import type React from 'react';

import {
  DiscoverFollowingTab,
  DiscoverForYouTab,
  DiscoverNewTab,
  DiscoverPopularTab,
} from 'src/components/(discover)';
import { ProductTabBar } from 'src/components/(products)';
import { Header } from 'src/components/header';
import { useDiscoverTabFromUrl } from 'src/hooks/useDiscoverTabFromUrl';

import type { ProductTab } from 'src/components/(products)';

const TABS: ProductTab[] = [
  { key: 'popular', label: 'Popular', labelKo: '지금 주목받는' },
  { key: 'new', label: 'New', labelKo: '새로 들어온 · 7일' },
  { key: 'foryou', label: 'For You', labelKo: '본 아이템 기반' },
  { key: 'following', label: 'Following', labelKo: '주시 중인 브랜드' },
];

/**
 * Inner component reads `useSearchParams` via `useDiscoverTabFromUrl`.
 * Next.js 15 requires that any use of `useSearchParams` in a CSR-bailed page
 * sits inside a `<Suspense>` boundary.
 */
const DiscoverPageInner: React.FC = () => {
  const { tab, setTab } = useDiscoverTabFromUrl();

  const renderTabContent = () => {
    switch (tab) {
      case 'popular':
        return <DiscoverPopularTab />;
      case 'new':
        return <DiscoverNewTab />;
      case 'foryou':
        return <DiscoverForYouTab />;
      case 'following':
        return <DiscoverFollowingTab />;
    }
  };

  return (
    <>
      <ProductTabBar tabs={TABS} activeTab={tab} onSelect={setTab} />
      {renderTabContent()}
    </>
  );
};

const DiscoverSkeleton: React.FC = () => (
  <div
    style={{
      padding: '60px 48px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: 1.4,
      color: 'rgba(17,17,17,0.5)',
      textTransform: 'uppercase',
    }}
  >
    Loading discover…
  </div>
);

const DiscoverPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', color: '#111' }}>
      <Header />
      <main>
        <Suspense fallback={<DiscoverSkeleton />}>
          <DiscoverPageInner />
        </Suspense>
      </main>
    </div>
  );
};

export default DiscoverPage;
