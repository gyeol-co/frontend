'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { Header } from 'src/components/header';
import { SearchBar } from 'src/components/(search)/search-bar';
import { SearchBrandsRow } from 'src/components/(search)/search-brands-row';
import { SearchEmptyState } from 'src/components/(search)/search-empty-state';
import { SearchFilterBar } from 'src/components/(search)/search-filter-bar';
import { SearchNoResults } from 'src/components/(search)/search-no-results';
import { SearchProductsGrid } from 'src/components/(search)/search-products-grid';
import {
  searchInfiniteQueryOptions,
  searchSuggestionsQueryOptions,
  useSearchUrlState,
} from 'src/hooks/(search)';
import { useDebouncedValue } from 'src/hooks/useDebouncedValue';

const LOGIN_NEXT = '/search';

/**
 * Search container — reads URL state, debounces keystrokes against `?q=`,
 * drives the hybrid search query (products + brands embed) or the suggestions
 * query (empty state), and composes the page shell.
 *
 * `q.length >= 2` gates `/search` calls; otherwise `SearchEmptyState` uses the
 * suggestions endpoint. `price_min > price_max` also blocks the main query
 * (BE would 422). Embedding degrade surfaces as a one-time toast-equivalent
 * banner slot, see §E `data.meta_info` mapping.
 */
const SearchPage: React.FC = () => {
  const {
    q,
    sort,
    category,
    styles,
    priceMin,
    priceMax,
    setQ,
    setSort,
    setCategory,
    setStyles,
    setPrice,
    clearFilters,
  } = useSearchUrlState();

  // Local input — owns keystrokes; debounced value is pushed to URL.
  const [inputValue, setInputValue] = useState(q);
  const debouncedInput = useDebouncedValue(inputValue, 300);

  // Push debounced local → URL. Trim to avoid spurious updates on whitespace.
  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed !== q) setQ(trimmed);
    // Intentionally omit `setQ` from deps — identity changes per render and
    // would make the effect a push-loop with itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput, q]);

  // Query gate.
  const qTrimmed = q.trim();
  const pricesValid = priceMin === undefined || priceMax === undefined || priceMin <= priceMax;
  const canSearch = qTrimmed.length >= 2 && pricesValid;

  const searchQuery = useInfiniteQuery({
    ...searchInfiniteQueryOptions({
      q: qTrimmed,
      sort,
      style: styles,
      category: category ?? undefined,
      priceMin,
      priceMax,
    }),
    enabled: canSearch,
  });

  const suggestionsQuery = useQuery({
    ...searchSuggestionsQueryOptions(),
    enabled: !canSearch,
  });

  const items = useMemo(
    () => (searchQuery.data ? searchQuery.data.pages.flatMap((p) => p.data.products.items) : []),
    [searchQuery.data],
  );
  const firstPage = searchQuery.data?.pages[0]?.data;
  const brands = firstPage?.brands ?? [];
  const echoedQuery = firstPage?.query ?? qTrimmed;

  const hasActiveFilters =
    sort !== 'relevance' ||
    category !== null ||
    styles.length > 0 ||
    priceMin !== undefined ||
    priceMax !== undefined;

  // Embedding degrade banner — shown once per distinct first-page payload.
  const degradedReason = firstPage?.meta_info.degraded_reason ?? null;
  const [seenDegradeKey, setSeenDegradeKey] = useState<string | null>(null);
  const showDegradeBanner =
    degradedReason === 'embedding_unavailable' && seenDegradeKey !== `${qTrimmed}|${sort}`;
  const dismissRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (value: string) => {
    const trimmed = value.trim();
    setInputValue(trimmed);
    setQ(trimmed);
  };

  const handleClear = () => {
    setInputValue('');
    setQ('');
  };

  const handleChipClick = (value: string) => {
    setInputValue(value);
    setQ(value);
  };

  const renderBody = () => {
    if (!canSearch) {
      return (
        <SearchEmptyState
          recent={suggestionsQuery.data?.recent ?? []}
          suggestions={suggestionsQuery.data?.suggestions ?? []}
          onChipClick={handleChipClick}
          isLoading={suggestionsQuery.isPending}
        />
      );
    }

    if (searchQuery.isPending) {
      return (
        <div
          style={{
            padding: '60px 48px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.4,
            color: 'rgba(17,17,17,0.45)',
            textTransform: 'uppercase',
          }}
        >
          Searching…
        </div>
      );
    }

    if (searchQuery.isError) {
      return (
        <div
          style={{
            padding: '60px 48px',
            color: 'rgba(17,17,17,0.75)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.
        </div>
      );
    }

    const noResults = items.length === 0 && brands.length === 0;
    if (noResults) {
      return (
        <SearchNoResults
          query={echoedQuery}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      );
    }

    return (
      <>
        {showDegradeBanner && (
          <div
            style={{
              padding: '10px 48px',
              background: '#f2f0ec',
              borderBottom: '1px solid rgba(17,17,17,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.7)',
              textTransform: 'uppercase',
            }}
          >
            <span>정확도가 약간 낮을 수 있어요.</span>
            <button
              ref={dismissRef}
              type="button"
              onClick={() => setSeenDegradeKey(`${qTrimmed}|${sort}`)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
                color: 'rgba(17,17,17,0.55)',
              }}
            >
              Dismiss ×
            </button>
          </div>
        )}
        <SearchBrandsRow brands={brands} loginNext={LOGIN_NEXT} />
        <SearchProductsGrid
          items={items}
          hasNextPage={Boolean(searchQuery.hasNextPage)}
          isFetchingNextPage={searchQuery.isFetchingNextPage}
          onLoadMore={() => searchQuery.fetchNextPage()}
          loginNext={LOGIN_NEXT}
        />
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', color: '#111' }}>
      <Header />
      <main>
        <div
          style={{
            padding: '56px 48px 24px',
            borderBottom: '1px solid rgba(17,17,17,0.08)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.8,
              color: 'rgba(17,17,17,0.55)',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Search
          </div>
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onClear={handleClear}
            autoFocus={qTrimmed.length === 0}
          />
        </div>

        {canSearch && (
          <SearchFilterBar
            sort={sort}
            onSortChange={setSort}
            category={category}
            onCategoryChange={setCategory}
            styles={styles}
            onStylesChange={setStyles}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceChange={setPrice}
            shownCount={items.length}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {renderBody()}
      </main>
    </div>
  );
};

export default SearchPage;
