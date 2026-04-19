'use client';

import { useState } from 'react';
import type React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { AuthInput } from 'src/components/(auth)/auth-input';
import { AuthSubmit } from 'src/components/(auth)/auth-submit';
import { OAuthButtonGroup } from 'src/components/(auth)/oauth-button-group';
import { useEmailLoginMutation } from 'src/hooks/(auth)';
import { ApiError } from 'src/lib/api-client';
import { emailLoginSchema } from 'src/schemas/auth-schemas';

import type { EmailLoginInput } from 'src/schemas/auth-schemas';

export interface LoginFormProps {
  /** Redirect target after success. Defaults to `/discover`. */
  next?: string;
  /** Clicking "회원가입 ↗" should navigate to signup. */
  onGoSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ next = '/discover', onGoSignup }) => {
  const router = useRouter();
  const loginMutation = useEmailLoginMutation();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<EmailLoginInput>({
    resolver: zodResolver(emailLoginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (input: EmailLoginInput) => {
    setGlobalError(null);
    try {
      await loginMutation.mutateAsync(input);
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError) {
        // Inline + global error-code mapping per api-mapping.md §E.
        if (err.code === 'INVALID_CREDENTIALS') {
          setError('password', { message: '이메일 또는 비밀번호가 올바르지 않아요.' });
          return;
        }
        if (err.code === 'ACCOUNT_DEACTIVATED') {
          setGlobalError('비활성화된 계정입니다.');
          return;
        }
        if (err.code === 'VALIDATION_ERROR') {
          setGlobalError('입력값을 다시 확인해주세요.');
          return;
        }
        if (err.code === 'RATE_LIMITED') {
          setGlobalError('요청이 많아요. 잠시 후 다시 시도해주세요.');
          return;
        }
      }
      setGlobalError('일시적인 오류가 발생했어요.');
    }
  };

  // Disable submit while idle-empty and while the mutation is in flight.
  const disableSubmit = !email || !password || isSubmitting || !isValid;

  return (
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
        Sign in
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
        다시 오신 걸 환영합니다.
      </h2>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(17,17,17,0.6)',
          letterSpacing: -0.1,
          marginBottom: 32,
        }}
      >
        취향은 저장되어 있어요. 로그인 후 바로 이어집니다.
      </div>

      <OAuthButtonGroup next={next} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '24px 0 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.4)',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'rgba(17,17,17,0.1)' }} />
        <span>or email</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(17,17,17,0.1)' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />

        {globalError && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.75)',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            ! {globalError}
          </div>
        )}

        <AuthSubmit type="submit" disabled={disableSubmit}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </AuthSubmit>
      </form>

      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid rgba(17,17,17,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: 'rgba(17,17,17,0.55)',
        }}
      >
        <button
          type="button"
          onClick={onGoSignup}
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
          회원가입 ↗
        </button>
        <span style={{ opacity: 0.4 }}>비밀번호 찾기</span>
      </div>
    </>
  );
};

export default LoginForm;
