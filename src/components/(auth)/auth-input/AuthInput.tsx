import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Design-system input: uppercase label + underline. Wraps a native input so
 * RHF can `register` directly via `ref`. Design: lines 886-908.
 */
export interface AuthInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label: string;
  /** Inline error, rendered as small mono caps below the input. */
  errorMessage?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, errorMessage, ...rest }, ref) => {
    return (
      <label style={{ display: 'block', marginBottom: 16 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.4,
            color: 'rgba(17,17,17,0.55)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <input
          ref={ref}
          {...rest}
          style={{
            width: '100%',
            padding: '10px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${errorMessage ? 'rgba(17,17,17,0.6)' : 'rgba(17,17,17,0.2)'}`,
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
            color: '#111',
            outline: 'none',
          }}
        />
        {errorMessage && (
          <div
            style={{
              marginTop: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.2,
              color: 'rgba(17,17,17,0.75)',
              textTransform: 'uppercase',
            }}
          >
            ! {errorMessage}
          </div>
        )}
      </label>
    );
  },
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
