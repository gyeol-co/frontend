/**
 * Korean "N days ago" label for product cards and detail `Added` meta row.
 *
 * - same UTC day as now → "오늘"
 * - yesterday → "어제"
 * - further → "N일 전"
 *
 * Accepts ISO 8601 strings. Invalid input → `null`.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const formatDaysAgo = (isoTimestamp: string | null | undefined, now: Date = new Date()): string | null => {
  if (!isoTimestamp) return null;
  const then = new Date(isoTimestamp);
  if (Number.isNaN(then.getTime())) return null;

  const diffDays = Math.floor((now.getTime() - then.getTime()) / MS_PER_DAY);
  if (diffDays < 0) return '오늘';
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  return `${diffDays}일 전`;
};
