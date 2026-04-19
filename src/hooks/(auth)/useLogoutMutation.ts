import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authMeQueryOptions } from 'src/hooks/(auth)/auth.queries';
import { authLogoutPost } from 'src/lib/api-client';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authLogoutPost(),
    onSuccess: () => {
      // Drop every cached query — wishlist / follows / personalized data must
      // not leak across sessions. Reseed `/auth/me` with guest state.
      queryClient.setQueryData(authMeQueryOptions.queryKey, { user: null });
      queryClient.clear();
      queryClient.setQueryData(authMeQueryOptions.queryKey, { user: null });
    },
  });
};
