/**
 * Price formatter for the product grid and detail page.
 *
 * Behavior matches the design prototype (`Gyeol Unified.html` line 349):
 * - no discount → `{ main: '₩ 123,000', orig: null, rate: 0, discounted: false }`
 * - discount → `{ main: '₩ 90,000', orig: '₩ 123,000', rate: 27, discounted: true }`
 */

export interface FormattedPrice {
  main: string;
  /** Original price (strike-through). `null` when there's no discount. */
  orig: string | null;
  /** Percent off, rounded to integer (0-99). */
  rate: number;
  discounted: boolean;
}

const formatKrw = (value: number): string => `₩ ${value.toLocaleString('ko-KR')}`;

export const formatPrice = (
  originalPrice: number,
  discountedPrice: number | null,
): FormattedPrice => {
  const orig = formatKrw(originalPrice);
  if (discountedPrice != null && discountedPrice < originalPrice) {
    const rate = Math.round((1 - discountedPrice / originalPrice) * 100);
    return {
      main: formatKrw(discountedPrice),
      orig,
      rate,
      discounted: true,
    };
  }
  return { main: orig, orig: null, rate: 0, discounted: false };
};
