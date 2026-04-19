'use client';

import { useEffect, useState } from 'react';
import type React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import type { Resolver } from 'react-hook-form';

import { AuthInput } from 'src/components/(auth)/auth-input';
import { AuthSubmit } from 'src/components/(auth)/auth-submit';
import { ConsentChecklist } from 'src/components/(auth)/consent-checklist';
import SignupFormEmailFields from 'src/components/(auth)/signup-form/SignupFormEmailFields';
import SignupFormOAuthBanner from 'src/components/(auth)/signup-form/SignupFormOAuthBanner';
import { useEmailSignupMutation, useOAuthSignupMutation } from 'src/hooks/(auth)';
import { ApiError } from 'src/lib/api-client';
import { emailSignupSchema, oauthSignupSchema } from 'src/schemas/auth-schemas';

import type { ConsentBools, EmailSignupInput, OAuthSignupInput } from 'src/schemas/auth-schemas';
import type { PendingOAuthState } from 'src/types/auth-types';

export type SignupFormMode = 'email' | 'oauth';

export interface SignupFormProps {
  mode: SignupFormMode;
  /** Required when `mode === 'oauth'`. Restored from `sessionStorage` by parent. */
  pending?: PendingOAuthState;
  /** Clicking "로그인 ↗" should navigate to login. */
  onGoLogin: () => void;
}

/**
 * Initial state where none of the required boxes are checked yet. Cast to
 * `ConsentBools` because zod's `z.literal(true)` narrows the resolved type
 * to require `true` — but RHF tolerates invalid initial state.
 */
const DEFAULT_CONSENT = {
  terms: false,
  privacy: false,
  age_14_plus: false,
  marketing: false,
} as unknown as ConsentBools;

const SignupForm: React.FC<SignupFormProps> = ({ mode, pending, onGoLogin }) => {
  const isOAuth = mode === 'oauth';
  const router = useRouter();

  const emailSignupMutation = useEmailSignupMutation();
  const oauthSignupMutation = useOAuthSignupMutation();

  const [globalError, setGlobalError] = useState<string | null>(null);

  // Two separate forms to keep Zod resolvers honest — one per mode.
  // zodResolver's typed signature needs explicit `Resolver<T>` to pin TFieldValues;
  // otherwise useForm sees the abstract `FieldValues` bound inside handleSubmit.
  const emailForm = useForm<EmailSignupInput>({
    resolver: zodResolver(emailSignupSchema) as Resolver<EmailSignupInput>,
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      password_confirm: '',
      display_name: '',
      consents: DEFAULT_CONSENT,
    },
  });

  const oauthForm = useForm<OAuthSignupInput>({
    resolver: zodResolver(oauthSignupSchema) as Resolver<OAuthSignupInput>,
    mode: 'onTouched',
    defaultValues: {
      pending_token: pending?.pending_token ?? '',
      display_name: '',
      consents: DEFAULT_CONSENT,
    },
  });

  // When pending arrives late (hydration), keep RHF's pending_token in sync.
  useEffect(() => {
    if (isOAuth && pending?.pending_token) {
      oauthForm.setValue('pending_token', pending.pending_token);
    }
  }, [isOAuth, pending?.pending_token, oauthForm]);

  const handleEmailSubmit = async (input: EmailSignupInput) => {
    setGlobalError(null);
    try {
      await emailSignupMutation.mutateAsync(input);
      router.replace('/discover');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_ALREADY_EXISTS') {
          emailForm.setError('email', { message: '이미 사용 중인 이메일입니다.' });
          return;
        }
        if (err.code === 'CONSENT_REQUIRED') {
          emailForm.setError('consents', {
            message: '필수 항목에 동의해야 가입할 수 있어요.',
          });
          return;
        }
        if (err.code === 'VALIDATION_ERROR') {
          setGlobalError('입력값을 다시 확인해주세요.');
          return;
        }
      }
      setGlobalError('일시적인 오류가 발생했어요.');
    }
  };

  const handleOAuthSubmit = async (input: OAuthSignupInput) => {
    setGlobalError(null);
    try {
      await oauthSignupMutation.mutateAsync(input);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth.pendingOAuth');
      }
      router.replace(pending?.next || '/discover');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'PENDING_TOKEN_EXPIRED' || err.code === 'PENDING_TOKEN_INVALID') {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth.pendingOAuth');
          }
          setGlobalError('세션이 만료됐어요. 다시 로그인해주세요.');
          router.replace('/login');
          return;
        }
        if (err.code === 'OAUTH_ALREADY_LINKED') {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth.pendingOAuth');
          }
          setGlobalError('이미 연결된 계정입니다.');
          router.replace('/login');
          return;
        }
        if (err.code === 'EMAIL_ALREADY_EXISTS') {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth.pendingOAuth');
          }
          setGlobalError('이미 이메일로 가입된 계정입니다. 이메일 로그인을 사용해주세요.');
          router.replace('/login');
          return;
        }
        if (err.code === 'CONSENT_REQUIRED') {
          oauthForm.setError('consents', {
            message: '필수 항목에 동의해야 가입할 수 있어요.',
          });
          return;
        }
      }
      setGlobalError('일시적인 오류가 발생했어요.');
    }
  };

  const renderHeader = () => (
    <>
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
        Create account · {isOAuth && pending ? `via ${pending.provider}` : 'email'}
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 400,
          letterSpacing: -0.8,
          lineHeight: 1.05,
          margin: '0 0 12px',
        }}
      >
        몇 가지만 확인할게요.
      </h2>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(17,17,17,0.6)',
          letterSpacing: -0.1,
          marginBottom: 28,
        }}
      >
        이후엔 취향을 이어서 채워갑니다.
      </div>
    </>
  );

  const renderFooter = () => (
    <div
      style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid rgba(17,17,17,0.1)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: 'rgba(17,17,17,0.55)',
      }}
    >
      이미 계정이 있으신가요?{' '}
      <button
        type="button"
        onClick={onGoLogin}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          letterSpacing: 'inherit',
          color: '#111',
          textTransform: 'inherit',
          borderBottom: '1px solid #111',
          paddingBottom: 1,
        }}
      >
        로그인 ↗
      </button>
    </div>
  );

  const renderGlobalError = () =>
    globalError && (
      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(17,17,17,0.75)',
          textTransform: 'uppercase',
        }}
      >
        ! {globalError}
      </div>
    );

  if (isOAuth) {
    if (!pending) {
      // Defensive — parent should redirect before this renders.
      return (
        <>
          {renderHeader()}
          <div style={{ fontSize: 13, color: 'rgba(17,17,17,0.7)' }}>
            OAuth 정보를 찾을 수 없어요. 로그인을 다시 시도해주세요.
          </div>
        </>
      );
    }

    const consentError = oauthForm.formState.errors.consents?.message as string | undefined;

    return (
      <>
        {renderHeader()}
        <SignupFormOAuthBanner provider={pending.provider} providerEmail={pending.provider_email} />
        <form onSubmit={oauthForm.handleSubmit(handleOAuthSubmit)} noValidate>
          <AuthInput
            label="Display name · 표시 이름"
            placeholder="다른 유저에게 보이는 이름"
            autoFocus
            errorMessage={oauthForm.formState.errors.display_name?.message}
            {...oauthForm.register('display_name')}
          />

          <Controller
            control={oauthForm.control}
            name="consents"
            render={({ field }) => (
              <ConsentChecklist
                value={field.value}
                onChange={field.onChange}
                errorMessage={consentError}
              />
            )}
          />

          {renderGlobalError()}

          <div style={{ marginTop: 20 }}>
            <AuthSubmit type="submit" disabled={oauthForm.formState.isSubmitting}>
              {oauthForm.formState.isSubmitting ? 'Creating…' : 'Create account'}
            </AuthSubmit>
          </div>
        </form>
        {renderFooter()}
      </>
    );
  }

  const consentError = emailForm.formState.errors.consents?.message as string | undefined;

  return (
    <>
      {renderHeader()}
      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} noValidate>
        <SignupFormEmailFields
          register={emailForm.register}
          errors={emailForm.formState.errors}
        />

        <AuthInput
          label="Display name · 표시 이름"
          placeholder="다른 유저에게 보이는 이름"
          errorMessage={emailForm.formState.errors.display_name?.message}
          {...emailForm.register('display_name')}
        />

        <Controller
          control={emailForm.control}
          name="consents"
          render={({ field }) => (
            <ConsentChecklist
              value={field.value}
              onChange={field.onChange}
              errorMessage={consentError}
            />
          )}
        />

        {renderGlobalError()}

        <div style={{ marginTop: 20 }}>
          <AuthSubmit type="submit" disabled={emailForm.formState.isSubmitting}>
            {emailForm.formState.isSubmitting ? 'Creating…' : 'Create account'}
          </AuthSubmit>
        </div>
      </form>
      {renderFooter()}
    </>
  );
};

export default SignupForm;
