import { useEffect, useState } from 'react';

/**
 * Debounce a value — returns the latest `value` only after `delayMs` of
 * no further changes. Primary use: keystroke-heavy inputs (search query)
 * that drive URL/network side effects.
 *
 * Domain-independent; lives at `hooks/` root per `rules/frontend/hook.md`.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
};
