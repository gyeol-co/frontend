# gyeol-frontend

결의 Next.js 15 App Router · React 19 · TypeScript 웹 애플리케이션이다.
Next.js 서버가 화면과 정적 파일을 응답하며, API 데이터는 브라우저에서 가져온다.
TanStack Query가 서버 데이터를, React Hook Form과 Zod가 입력을 관리한다.

## 개발

Node 버전은 `.nvmrc`, pnpm 버전은 `package.json`의 `packageManager`에 고정한다.

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

개발 서버는 `http://localhost:3000`, 기본 backend 주소는 `http://localhost:8000`이다.
브라우저의 backend 주소는 `.env.local`의 `NEXT_PUBLIC_API_URL`로 지정한다.
이 값은 빌드 시 번들에 포함되므로 비밀 값을 넣지 않는다.
backend는 프론트 origin의 CORS와 쿠키 기반 인증을 허용해야 한다.

## 구조

```text
src/
├── app/                  # App Router 페이지·레이아웃·provider·전역 스타일
├── components/           # 기능별 UI
├── hooks/                # API query options·mutation·URL 상태
├── lib/                  # API 클라이언트
├── schemas/              # 입력 검증
└── types/                # API 타입
```

`/`는 `/discover`로 이동한다. 상품·브랜드 상세, 검색, 저장 목록,
로그인·가입·OAuth 콜백 페이지를 제공한다.
API 요청에는 세션 쿠키를 포함한다.

## 검증

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 이미지와 배포

이 저장소를 빌드 컨텍스트로 사용한다.

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.gyeol.co -t gyeol-frontend:bootstrap .
docker run --rm -p 3000:3000 gyeol-frontend:bootstrap
```

런타임은 Node의 `server.js`로 실행하는 Next.js standalone 출력이며 3000 포트를 사용한다.
`NEXT_PUBLIC_API_URL`을 변경하면 이미지를 다시 빌드한다.
이미지 CI는 PR에서 검증·빌드를, main과 수동 실행에서 GHCR 게시를 수행한다.
게시된 digest는 deploy 저장소의 `helm/frontend/values.yaml`에 기록한다.
Argo CD의 `gyeol-frontend` Application이 Git의 설정을 K3s에 동기화하고,
Traefik이 `gyeol.co`·`www.gyeol.co` 요청을 frontend Service로 전달한다.
