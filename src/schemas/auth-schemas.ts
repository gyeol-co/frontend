/**
 * Zod schemas for auth forms. FE state uses `Record<ConsentKey, boolean>` for
 * UI convenience; the mutation hook flattens to `ConsentEntry[]` before wire.
 *
 * Contract: `docs/plans/auth/structure-plan.md` §4.2.
 */

import { z } from 'zod';

export const emailLoginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});
export type EmailLoginInput = z.infer<typeof emailLoginSchema>;

/**
 * Checkbox state shape — required 3 must be `true`, marketing is free.
 * Mutations flatten this into `ConsentEntry[]` of length 4.
 */
const consentBoolsSchema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({ message: '이용약관 동의가 필요합니다.' }),
  }),
  privacy: z.literal(true, {
    errorMap: () => ({ message: '개인정보 처리방침 동의가 필요합니다.' }),
  }),
  age_14_plus: z.literal(true, {
    errorMap: () => ({ message: '만 14세 이상 확인이 필요합니다.' }),
  }),
  marketing: z.boolean(),
});
export type ConsentBools = z.infer<typeof consentBoolsSchema>;

export const emailSignupSchema = z
  .object({
    email: z.string().email('올바른 이메일을 입력해주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 해요.'),
    password_confirm: z.string(),
    display_name: z
      .string()
      .trim()
      .min(1, '표시 이름을 입력해주세요.')
      .max(40, '표시 이름은 40자 이내여야 해요.'),
    consents: consentBoolsSchema,
  })
  .refine((d) => d.password === d.password_confirm, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['password_confirm'],
  });
export type EmailSignupInput = z.infer<typeof emailSignupSchema>;

export const oauthSignupSchema = z.object({
  pending_token: z.string().min(1),
  display_name: z
    .string()
    .trim()
    .min(1, '표시 이름을 입력해주세요.')
    .max(40, '표시 이름은 40자 이내여야 해요.'),
  consents: consentBoolsSchema,
});
export type OAuthSignupInput = z.infer<typeof oauthSignupSchema>;
