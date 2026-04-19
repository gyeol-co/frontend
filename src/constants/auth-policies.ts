/**
 * Consent policy texts for signup. Version strings here are the source of
 * `policy_version` sent to `consent_log` (api-mapping.md §C).
 *
 * Copied verbatim from `design/project/Gyeol Unified.html` lines 1057-1083.
 */

import type { ConsentKey } from 'src/types/auth-types';

export interface PolicyText {
  label: string;
  required: boolean;
  version: string;
  body: string;
}

export const POLICY_TEXTS: Record<ConsentKey, PolicyText> = {
  terms: {
    label: '이용약관',
    required: true,
    version: 'v1.0',
    body: '본 약관은 결(Gyeol) 서비스 이용과 관련해 회사와 회원의 권리·의무 및 책임사항을 규정합니다. 회원은 약관에 동의함으로써 서비스 이용계약을 체결합니다. 본 프로토타입에서는 전문을 생략한 샘플 문구입니다.',
  },
  privacy: {
    label: '개인정보 처리방침',
    required: true,
    version: 'v1.0',
    body: '결은 서비스 제공을 위해 이메일, 표시 이름, 취향 태그, 접속 기록을 수집합니다. OAuth 사용 시 해당 제공자로부터 식별자·이메일을 제공받습니다. 수집한 정보는 서비스 제공·개선·추천에 이용되며, 회원 탈퇴 시 지체 없이 파기합니다. (샘플)',
  },
  age_14_plus: {
    label: '만 14세 이상입니다',
    required: true,
    version: 'v1.0',
    body: '결은 만 14세 이상 이용자를 대상으로 서비스를 제공합니다. 14세 미만인 경우 보호자의 사전 동의가 필요합니다. (샘플)',
  },
  marketing: {
    label: '마케팅 정보 수신',
    required: false,
    version: 'v1.0',
    body: '이메일 또는 앱 알림을 통해 결의 새로운 브랜드·에디토리얼·혜택 소식을 받아봅니다. 언제든 설정에서 철회할 수 있습니다. (샘플)',
  },
};

/**
 * Ordered list for iterating consent rows and for the FE→wire flatten
 * (see `structure-plan.md` §4.3). Order here is the on-screen order.
 */
export const CONSENT_KEYS: ConsentKey[] = ['terms', 'privacy', 'age_14_plus', 'marketing'];
