import { useMutation, useQueryClient } from '@tanstack/react-query';

import { wishlistAddPost, wishlistRemoveDelete } from 'src/lib/api-client';

import type { WishlistToggleResponse } from 'src/types/product-types';

/**
 * Wishlist add / remove mutation wrapper.
 *
 * Deliberately **no optimistic cache patching** for the wishlist-list payload:
 * the list carries compound state (`count_total`, `count_by_category`, items
 * in `saved_at DESC` order, `saved_at` timestamps we'd have to fabricate) and
 * the BE response is fast enough that `onSettled` invalidate is the simpler
 * source of truth. Save chip UI stays responsive via React Query's
 * `isPending` + the eventual re-hydration of `useIsInWishlist`.
 *
 * Toast/UI feedback lives in the component (see rules/frontend/query.md).
 */

export interface ToggleInput {
  productId: string;
  isCurrentlyInList: boolean;
}

export const useWishlistToggle = () => {
  const queryClient = useQueryClient();

  return useMutation<WishlistToggleResponse, Error, ToggleInput>({
    mutationFn: ({ productId, isCurrentlyInList }: ToggleInput) =>
      isCurrentlyInList ? wishlistRemoveDelete(productId) : wishlistAddPost(productId),
    onSettled: () => {
      // Invalidate every wishlist-list variant (category-filtered + infinite).
      void queryClient.invalidateQueries({ queryKey: ['wishlist', 'list'] });
    },
  });
};
