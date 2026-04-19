/**
 * Canonical brand style taxonomy. Source of truth is
 * `data/common/taxonomy.yaml` (`style:` list) — keep in sync if data pipeline
 * extends the enum.
 */
export const BRAND_STYLE_OPTIONS = [
  'american_casual',
  'amekaji',
  'street',
  'dandy',
  'minimalism',
  'classic',
  'workwear',
  'techwear',
  'preppy',
  'rock_chic',
  'outdoor',
  'military',
  'gorpcore',
  'heritage',
  'normcore',
  'vintage',
] as const;

export type BrandStyleTag = (typeof BRAND_STYLE_OPTIONS)[number];
