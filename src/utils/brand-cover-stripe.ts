import type React from 'react';

/**
 * Slug-hash stripe placeholder for brands without a `cover_url`. Mirrors the
 * design prototype (`design/project/brand-views.jsx` L8-38): each slug maps
 * to a deterministic `repeating-linear-gradient` with slightly different
 * angle / base lightness so every brand gets its own tone.
 *
 * Returns CSS properties ready to drop into a `<div style={...}/>`.
 */

const hashSlug = (slug: string): number => {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return sum;
};

export const getBrandCoverStripe = (slug: string): React.CSSProperties => {
  const h = hashSlug(slug);
  const angle = (h * 17) % 180;
  const base = 82 + ((h * 3) % 10);
  const background = `repeating-linear-gradient(${angle}deg, ` +
    `hsl(0,0%,${base}%) 0px, hsl(0,0%,${base}%) 2px, ` +
    `hsl(0,0%,${base + 8}%) 2px, hsl(0,0%,${base + 8}%) 14px)`;
  return { background };
};
