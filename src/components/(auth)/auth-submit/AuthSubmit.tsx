import type React from 'react';

export interface AuthSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  /** `submit` wires to enclosing `<form>`. Default keeps parity with design. */
  type?: 'submit' | 'button';
}

/**
 * Full-width black CTA used across login/signup. Design: lines 910-924.
 */
const AuthSubmit: React.FC<AuthSubmitProps> = ({
  children,
  disabled = false,
  onClick,
  type = 'submit',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px 16px',
        marginTop: 8,
        background: disabled ? 'rgba(17,17,17,0.25)' : '#111',
        color: '#fafaf8',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: 1.8,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </button>
  );
};

export default AuthSubmit;
