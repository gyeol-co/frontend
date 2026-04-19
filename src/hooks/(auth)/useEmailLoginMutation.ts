import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authMeQueryOptions } from 'src/hooks/(auth)/auth.queries';
import { authLoginEmailPost } from 'src/lib/api-client';

import type { EmailLoginInput } from 'src/schemas/auth-schemas';

export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EmailLoginInput) => authLoginEmailPost(input),
    onSuccess: (data) => {
      // Response includes full user — prime cache instead of refetching.
      queryClient.setQueryData(authMeQueryOptions.queryKey, { user: data.user });
    },
  });
};
