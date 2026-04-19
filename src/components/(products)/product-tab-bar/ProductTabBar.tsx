'use client';

import type React from 'react';

import type { DiscoverTabKey } from 'src/hooks/useDiscoverTabFromUrl';

export interface ProductTab {
  key: DiscoverTabKey;
  label: string;
  labelKo: string;
}

export interface ProductTabBarProps {
  tabs: ProductTab[];
  activeTab: DiscoverTabKey;
  onSelect: (key: DiscoverTabKey) => void;
}

/**
 * 4-wide tab header shared by Discover. Visual matches
 * `Gyeol Unified.html` lines 217-249.
 */
const ProductTabBar: React.FC<ProductTabBarProps> = ({ tabs, activeTab, onSelect }) => {
  return (
    <div
      style={{
        padding: '32px 48px 14px',
        display: 'flex',
        gap: 40,
        alignItems: 'flex-end',
        borderBottom: '1px solid rgba(17,17,17,0.08)',
        flexWrap: 'wrap',
      }}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              paddingBottom: 12,
              borderBottom: active ? '2px solid #111' : '2px solid transparent',
              marginBottom: -1,
              fontFamily: 'inherit',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 36,
                fontWeight: 400,
                letterSpacing: -0.8,
                lineHeight: 1,
                color: active ? '#111' : 'rgba(17,17,17,0.3)',
              }}
            >
              {tab.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: active ? 'rgba(17,17,17,0.55)' : 'rgba(17,17,17,0.3)',
                marginTop: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.labelKo}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductTabBar;
