import type React from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { AuthInput } from 'src/components/(auth)/auth-input';

import type { EmailSignupInput } from 'src/schemas/auth-schemas';

export interface SignupFormEmailFieldsProps {
  register: UseFormRegister<EmailSignupInput>;
  errors: FieldErrors<EmailSignupInput>;
}

const SignupFormEmailFields: React.FC<SignupFormEmailFieldsProps> = ({ register, errors }) => {
  return (
    <>
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
        placeholder="8자 이상"
        autoComplete="new-password"
        errorMessage={errors.password?.message}
        {...register('password')}
      />
      <AuthInput
        label="Password confirm"
        type="password"
        autoComplete="new-password"
        errorMessage={errors.password_confirm?.message}
        {...register('password_confirm')}
      />
    </>
  );
};

export default SignupFormEmailFields;
