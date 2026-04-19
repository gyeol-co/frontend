# gyeol-frontend

> [Gyeol](https://gyeol.co) web app — Next.js 15 (App Router) + React 19 + TypeScript strict.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router, React 19, RSC + client islands |
| Server state | TanStack Query v5 (queryOptions pattern, `useInfiniteQuery` for cursor feeds) |
| Forms / validation | React Hook Form + zod resolvers |
| URL state | `useSearchParams` + feature-local hooks (`useBrandIndexUrlState`, `useSearchUrlState`) |
| Styling | Inline `style` + CSS variables (no CSS-in-JS runtime, no Tailwind) |
| Build | pnpm, Node 20, `output: 'standalone'` for Docker |
| Typechecking | `tsc --noEmit` enforced pre-deploy |

## Structure

```
src/
├── app/                                    # Next.js App Router — server shells + Suspense boundaries
│   ├── (auth)/
│   │   ├── login/, signup/, oauth/[provider]/callback/
│   ├── brands/                             # /brands + /brands/[slug]
│   ├── products/[product_id]/
│   ├── discover/, saved/, search/
│   ├── layout.tsx, providers.tsx
│   └── page.tsx                            # root redirect → /discover
├── components/
│   ├── header/                             # shared top nav
│   ├── (auth)/                             # login / signup / OAuth button group
│   ├── (products)/                         # product-card, detail-page, gallery, meta-grid, ...
│   ├── (brands)/                           # brand-cover, follow-button, empty-state
│   ├── (brand-index)/                      # brand-card, sort-bar, index-grid, featured-section
│   ├── (brand-detail)/                     # hero, meta-grid, products-section, related-block
│   ├── (discover)/                         # discover-page, discover-tab-bar
│   ├── (wishlist)/                         # wishlist-page, wishlist-save-chip
│   └── (search)/                           # search-page, bar, filter-bar, brands-row, products-grid, ...
├── hooks/
│   ├── (auth)/                             # useAuthMe, useLogoutMutation, useOAuthAuthorize, ...
│   ├── (products)/, (brands)/, (wishlist)/, (search)/
│   │     └── {entity}.queries.ts           # exported `queryOptions` — never wrap a bare `useQuery`
│   └── useDebouncedValue.ts
├── lib/
│   ├── api-client.ts                       # fetch + envelope unwrap + `ApiError` throw
│   └── error-codes.ts                      # shared error code union
├── schemas/                                # zod URL param / form schemas
├── types/                                  # shared contract types (FE ↔ BE)
└── constants/                              # brand styles, product categories, sort options, ...
```

### Naming convention

- PascalCase file names mirror the exported React component (`ProductCard.tsx` → `ProductCard`).
- Entity groups live under parenthesized dirs (`(products)`, `(brand-index)`) matching the related BE API resource.
- Each group has an `index.ts` barrel that re-exports children — component imports go through the barrel, not individual files.
- Hooks use camelCase (`useBrandIndexUrlState.ts`); utils and constants use kebab-case.

## Query patterns

TanStack Query v5 with **no wrapper hooks around a bare `useQuery`**. Every endpoint ships a `queryOptions` (or `infiniteQueryOptions`) constant/factory:

```ts
// hooks/(brands)/brand.queries.ts
export const brandIndexInfiniteQueryOptions = ({ sort, style }) =>
  infiniteQueryOptions({
    queryKey: ['brands', 'index', 'infinite', { sort, style: [...style].sort() }],
    queryFn: ({ pageParam, signal }) => brandIndexGet({ sort, style, ...pageParam }, { signal }),
    initialPageParam: {},
    getNextPageParam: (last) => last.nextPageParams ?? undefined,
  });

// components/(brand-index)/brand-index-page/BrandIndexPage.tsx
const query = useInfiniteQuery(brandIndexInfiniteQueryOptions({ sort, style }));
```

Mutations return plain `useMutation` and never toast inside the hook — components own the user-facing feedback.

## Envelope + errors

`lib/api-client.ts` enforces the standard success/error envelope used by the backend. Non-2xx responses are thrown as `ApiError` instances carrying the BE's `error.code`, so feature code can branch on codes like `BRAND_NOT_FOUND` or `WISHLIST_FULL` without peeking at HTTP status directly.

## Local run

```bash
pnpm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local
pnpm dev                              # http://localhost:3000
pnpm typecheck                        # tsc --noEmit (mandatory before deploy)
```

## Portfolio note

The codebase follows a single rule: **URL is the source of truth** for anything a user can share or bookmark (filter state, search query, pagination entry). Cursor lives only in React Query cache (first-page reset on share is the expected behaviour). This makes deep links feel like the rest of the product — no orphan states, no "oops, that link doesn't reproduce what I saw".
