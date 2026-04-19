'use client';

import { useState } from 'react';
import type React from 'react';

import ConsentRow from 'src/components/(auth)/consent-checklist/ConsentRow';
import { CONSENT_KEYS, POLICY_TEXTS } from 'src/constants/auth-policies';

import type { ConsentBools } from 'src/schemas/auth-schemas';
import type { ConsentKey } from 'src/types/auth-types';

export interface ConsentChecklistProps {
  value: ConsentBools;
  onChange: (next: ConsentBools) => void;
  /** Inline error message from zod / server (e.g. CONSENT_REQUIRED). */
  errorMessage?: string;
}

/**
 * "전체 동의" toggle + 4 ConsentRow with expandable policy bodies.
 * Design: lines 1185-1232.
 */
const ConsentChecklist: React.FC<ConsentChecklistProps> = ({ value, onChange, errorMessage }) => {
  const [expanded, setExpanded] = useState<ConsentKey | null>(null);

  const allAccepted = CONSENT_KEYS.every((k) => value[k]);

  const toggleOne = (key: ConsentKey) => {
    onChange({ ...value, [key]: !value[key] });
  };

  const toggleAll = () => {
    const next = !allAccepted;
    onChange({
      terms: next,
      privacy: next,
      age_14_plus: next,
      marketing: next,
    } as ConsentBools);
  };

  const toggleExpanded = (key: ConsentKey) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        border: '1px solid rgba(17,17,17,0.12)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: 1.4,
          color: 'rgba(17,17,17,0.5)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Consent · 필수 항목에 동의해야 가입할 수 있어요
      </div>

      <ConsentRow checked={allAccepted} onToggle={toggleAll} label="전체 동의" emphasis />
      <div style={{ height: 1, background: 'rgba(17,17,17,0.08)', margin: '8px 0' }} />

      {CONSENT_KEYS.map((k) => {
        const policy = POLICY_TEXTS[k];
        return (
          <div key={k}>
            <ConsentRow
              checked={value[k]}
              onToggle={() => toggleOne(k)}
              label={policy.label}
              required={policy.required}
              onViewDetail={() => toggleExpanded(k)}
              expanded={expanded === k}
            />
            {expanded === k && (
              <div
                style={{
                  margin: '6px 0 12px 30px',
                  padding: '12px 14px',
                  background: '#f0eee9',
                  border: '1px solid rgba(17,17,17,0.08)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: 'rgba(17,17,17,0.5)',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {policy.version}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: 'rgba(17,17,17,0.82)',
                    letterSpacing: -0.1,
                  }}
                >
                  {policy.body}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {errorMessage && (
        <div
          style={{
            marginTop: 10,
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
    </div>
  );
};

export default ConsentChecklist;
