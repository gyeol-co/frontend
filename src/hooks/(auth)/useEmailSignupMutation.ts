import { useMutation, useQueryClient } from '@tanstack/react-query';

import { POLICY_TEXTS } from 'src/constants/auth-policies';
import { authMeQueryOptions } from 'src/hooks/(auth)/auth.queries';
import { authSignupEmailPost } from 'src/lib/api-client';

import type { EmailSignupInput } from 'src/schemas/auth-schemas';
import type { ConsentEntry, ConsentKey, EmailSignupRequestBody } from 'src/types/auth-types';

/**
 * Flattens UI's `Record<ConsentKey, boolean>` into the wire shape. Always
 * emits 4 entries in canonical order — BE enforces `min_length=4, max_length=4`
 * and records every row in `consent_log`, including `marketing=false`.
 */
const toConsentArray = (bools: Record<ConsentKey, boolean>): ConsentEntry[] => {
  const order: ConsentKey[] = ['terms', 'privacy', 'age_14_plus', 'marketing'];
  return order.map((key) => ({
    type: key,
    policy_version: POLICY_TEXTS[key].version,
    is_granted: bools[key],
    method: 'signup',
  }));
};

const toRequestBody = (input: EmailSignupInput): EmailSignupRequestBody => ({
  email: input.email,
  password: input.password,
  display_name: input.display_name.trim(),
  consents: toConsentArray(input.consents),
});

export const useEmailSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EmailSignupInput) => authSignupEmailPost(toRequestBody(input)),
    onSuccess: (data) => {
      queryClient.setQueryData(authMeQueryOptions.queryKey, { user: data.user });
    },
  });
};
