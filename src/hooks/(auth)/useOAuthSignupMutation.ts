import { useMutation, useQueryClient } from '@tanstack/react-query';

import { POLICY_TEXTS } from 'src/constants/auth-policies';
import { authMeQueryOptions } from 'src/hooks/(auth)/auth.queries';
import { authSignupOAuthPost } from 'src/lib/api-client';

import type { OAuthSignupInput } from 'src/schemas/auth-schemas';
import type { ConsentEntry, ConsentKey, OAuthSignupRequestBody } from 'src/types/auth-types';

const toConsentArray = (bools: Record<ConsentKey, boolean>): ConsentEntry[] => {
  const order: ConsentKey[] = ['terms', 'privacy', 'age_14_plus', 'marketing'];
  return order.map((key) => ({
    type: key,
    policy_version: POLICY_TEXTS[key].version,
    is_granted: bools[key],
    method: 'signup',
  }));
};

const toRequestBody = (input: OAuthSignupInput): OAuthSignupRequestBody => ({
  pending_token: input.pending_token,
  display_name: input.display_name.trim(),
  consents: toConsentArray(input.consents),
});

export const useOAuthSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: OAuthSignupInput) => authSignupOAuthPost(toRequestBody(input)),
    onSuccess: (data) => {
      queryClient.setQueryData(authMeQueryOptions.queryKey, { user: data.user });
    },
  });
};
