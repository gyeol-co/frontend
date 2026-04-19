import type React from 'react';

export interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Two-column layout for Login / Signup. Left: black brand copy. Right: form.
 * Pure layout — no logic. Design: `Gyeol Unified.html` lines 817-883.
 */
const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#fafaf8',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        fontFamily: 'var(--font-sans)',
        color: '#111',
      }}
    >
      {/* 좌 — 브랜드 카피 */}
      <div
        style={{
          padding: '64px 56px',
          background: '#111',
          color: '#fafaf8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="28" height="34" viewBox="0 0 120 150" fill="none">
            <g stroke="#fafaf8" strokeWidth="3" strokeLinecap="square">
              <line x1="20" y1="14" x2="100" y2="14" />
              <line x1="100" y1="14" x2="100" y2="42" />
              <line x1="20" y1="60" x2="100" y2="60" />
              <line x1="20" y1="76" x2="100" y2="76" />
              <line x1="60" y1="50" x2="60" y2="92" />
              <line x1="20" y1="106" x2="100" y2="106" />
              <line x1="100" y1="106" x2="100" y2="120" />
              <line x1="20" y1="120" x2="100" y2="120" />
              <line x1="20" y1="120" x2="20" y2="134" />
              <line x1="20" y1="134" x2="112" y2="134" />
            </g>
          </svg>
          <div
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: 4,
            }}
          >
            GYEOL
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 1.8,
              color: 'rgba(250,250,248,0.55)',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            A curated menswear review
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 56,
              fontWeight: 400,
              letterSpacing: -1.4,
              lineHeight: 1.02,
              margin: '0 0 20px',
              textWrap: 'balance',
            }}
          >
            깐깐하게 고르고,
            <br />
            정밀하게 연결한다.
          </h1>
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: 'rgba(250,250,248,0.7)',
              letterSpacing: -0.1,
              maxWidth: 420,
              textWrap: 'pretty',
            }}
          >
            편집숍의 안목과 플랫폼의 기술을 하나의 경험으로. 취향을 읽고, 연결합니다.
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 1.4,
            color: 'rgba(250,250,248,0.45)',
            textTransform: 'uppercase',
          }}
        >
          Issue 001 · 2026.04
        </div>
      </div>

      {/* 우 — 폼 영역 */}
      <div
        style={{
          padding: '48px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'auto',
        }}
      >
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>{children}</div>
      </div>
    </div>
  );
};

export default AuthShell;
