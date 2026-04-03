# 🃏 CardScope — 포켓몬 TCG 시세 분석 & 3D 뷰어

[![배포](https://img.shields.io/badge/배포-Vercel-black?logo=vercel)](https://pokemon-tcg-dun-two.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

**🔗 라이브 데모: [pokemon-tcg-dun-two.vercel.app](https://pokemon-tcg-dun-two.vercel.app)**

포켓몬 TCG 카드 18,000장+의 실시간 시세를 분석하고,
Three.js 기반 3D 인터랙티브 뷰어로 카드를 감상할 수 있는 웹 애플리케이션입니다.

---

## 주요 기능

**📊 실시간 시세 대시보드**

- Pokemon TCG API 연동으로 실제 TCGPlayer 시세 표시
- 고가 카드 TOP 10, 최신 카드 목록
- 레어리티별 평균 시세 비교 차트 (Recharts)

**🔍 카드 검색**

- 20,237장 전체 카드 검색 (디바운스 적용)
- 레어리티별 테두리 컬러 코딩
- Next.js App Router searchParams 기반 URL 상태 관리

**🌟 3D 카드 뷰어**

- Three.js ShaderMaterial로 구현한 홀로그램 효과
- 마우스 위치에 반응하는 무지개 빛 반사
- 레어리티별 홀로그램 강도 차등 적용
- 클릭 시 앞/뒤 플립 애니메이션

**❤️ 내 컬렉션**

- Zustand persist로 즐겨찾기 로컬 저장
- 컬렉션 총 시세 자동 계산

---

## 기술 스택 & 선택 이유

| 기술                      | 선택 이유                                                                     |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Next.js 14 App Router** | Server Components로 API 호출을 서버에서 처리 → JS 번들 감소, 초기 로딩 최적화 |
| **TypeScript**            | Pokemon TCG API 응답 타입 정의로 런타임 에러 방지                             |
| **Three.js**              | Canvas 기반 GPU 가속 렌더링으로 부드러운 3D 인터랙션 구현                     |
| **Recharts**              | 선언형 API로 빠른 차트 구현, 커스텀 툴팁 적용                                 |
| **Zustand**               | 보일러플레이트 없이 persist 미들웨어로 로컬 저장소 연동                       |
| **Tailwind CSS**          | 유틸리티 클래스 기반으로 일관된 디자인 시스템 유지                            |
| **shadcn/ui**             | 코드 소유권을 가지는 컴포넌트 라이브러리, 커스터마이징 자유도 높음            |

---

## 아키텍처

```
app/
├── page.tsx              # 메인 대시보드 (Server Component)
├── cards/
│   ├── page.tsx          # 카드 검색 (Server Component + searchParams)
│   └── [id]/page.tsx     # 카드 상세 (3D 뷰어 + 시세 차트)
├── market/page.tsx       # 시장 분석
└── collection/page.tsx   # 내 컬렉션 (Client Component)

components/
├── cards/
│   ├── card-item.tsx      # 카드 그리드 아이템
│   ├── card-3d-viewer.tsx # Three.js 3D 뷰어
│   ├── search-bar.tsx     # 디바운스 검색
│   └── favorite-button.tsx
├── charts/
│   ├── price-chart.tsx    # 시세 추이 차트 (Recharts AreaChart)
│   └── market-chart.tsx   # 레어리티별 비교 차트 (Recharts BarChart)
└── layout/sidebar.tsx

network/api.ts            # Pokemon TCG API 클라이언트
store/collection.ts       # Zustand 컬렉션 스토어
types/                    # TypeScript 타입 정의
```

**Server / Client Component 경계 설계**

```
페이지 (Server)
└── 데이터 페칭 (fetch + Next.js 캐싱)
    ├── CardGrid (Server) — 카드 목록 렌더링
    │   └── CardItem (Server) — 개별 카드
    │       └── FavoriteButton (Client) — 인터랙션
    └── Card3DViewer (Client) — Three.js WebGL
```

---

## 3D 홀로그램 구현 방식

실제 포켓몬 카드의 홀로그램 효과를 Three.js ShaderMaterial로 구현했습니다.

```glsl
// Fragment Shader — 마우스 위치 기반 무지개 반사
vec3 holo(vec2 uv, vec2 mouse) {
  vec2 offset = uv - mouse;
  float angle = atan(offset.y, offset.x);
  float hue = angle / (2.0 * PI) + time * 0.1;
  // HSL → RGB 변환으로 무지개 색상 생성
  float r = 0.5 + 0.5 * sin(hue * 6.28);
  float g = 0.5 + 0.5 * sin(hue * 6.28 + 2.09);
  float b = 0.5 + 0.5 * sin(hue * 6.28 + 4.18);
  return vec3(r, g, b) * smoothstep(0.6, 0.0, length(offset));
}
```

레어리티별로 `uIntensity` 유니폼 값을 다르게 적용해 Rare Secret은 강하게, Common은 약하게 표현했습니다.

---

## 시작하기

```bash
git clone https://github.com/[깃헙아이디]/poketmon-card-scope.git
cd poketmon-card-scope
pnpm install

# .env.local 생성
echo "POKEMON_TCG_API_KEY=your_api_key" > .env.local
# API 키 발급: https://dev.pokemontcg.io

pnpm dev
```

---

## 향후 계획

- [ ] 카카오맵 API 연동 — 국내 포켓몬 카드 판매점 위치 표시
- [ ] 가격 알림 기능 — 목표 시세 도달 시 알림
- [ ] 덱 빌더 — 컬렉션 기반 덱 구성 기능

---

> **Pokemon TCG API** 데이터 기반 | 포켓몬 컴퍼니와 무관한 개인 프로젝트
