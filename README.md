# Web Training Examples

현대적인 웹 개발 기술을 학습하고 실습할 수 있는 예제 모음입니다.

<img width="1624" height="1060" alt="스크린샷 2025-07-31 오후 2 44 56" src="https://github.com/user-attachments/assets/fc5d0245-e42e-43e7-b054-df0d5d9b3b7d" />

## 📋 프로젝트 소개

이 프로젝트는 React와 TypeScript를 사용하여 실무에서 자주 사용되는 웹 개발 패턴과 기술들을 구현한 예제 모음입니다. 각 예제는 독립적으로 작동하며, 실제 프로젝트에 적용할 수 있는 실용적인 코드를 제공합니다.

### 주요 특징
- **React 19** + **TypeScript** 기반
- **TailwindCSS**를 활용한 반응형 디자인
- **TanStack Query**를 이용한 데이터 페칭과 캐싱
- **MSW(Mock Service Worker)**를 통한 API 모킹
- 모바일 친화적인 반응형 UI

## 🚀 시작하기

### 필요 사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📚 예제 목록

### 1. Infinite Scroll (무한 스크롤)
- **경로**: `/infinite-scroll`
- **기술**: TanStack Query, Intersection Observer API
- **특징**: 
  - 스크롤 기반 자동 데이터 로딩
  - 로딩 상태 표시
  - 에러 처리 및 재시도 기능

### 2. Drag & Drop (드래그 앤 드롭)
- **경로**: `/dnd`
- **기술**: @dnd-kit, 상태 관리
- **특징**:
  - 아이템 재정렬
  - 부드러운 애니메이션
  - 모바일 터치 지원

### 3. Caching & Skeleton (캐싱과 스켈레톤 UI)
- **경로**: `/caching-skeleton`
- **기술**: TanStack Query, 스켈레톤 컴포넌트
- **특징**:
  - 데이터 캐싱 전략
  - 스켈레톤 UI로 사용자 경험 개선
  - 캐시 무효화 및 갱신

### 4. Page Caching (페이지 레벨 캐싱)
- **경로**: `/page-caching`
- **기술**: React Router, Context API
- **특징**:
  - 페이지 전환 시 상태 유지
  - 폼 데이터 보존
  - 스크롤 위치 복원

### 5. Mock API (비동기 Mock API 시뮬레이션)
- **경로**: `/mock-api`
- **기술**: MSW, Promise 기반 비동기 처리
- **특징**:
  - 실제 API와 동일한 동작
  - 네트워크 지연 시뮬레이션
  - 에러 상황 재현

## 🛠 기술 스택

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query, Context API
- **Routing**: React Router v7
- **Build Tool**: Vite
- **API Mocking**: MSW (Mock Service Worker)
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
web-training-ex/
├── src/
│   ├── api/          # API 관련 로직
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── contexts/     # React Context 정의
│   ├── mocks/        # MSW 핸들러 및 설정
│   ├── pages/        # 각 예제 페이지 컴포넌트
│   └── App.tsx       # 메인 애플리케이션 컴포넌트
├── docs/             # 각 예제별 상세 문서
├── learning/         # 학습 자료 및 참고 문서
└── public/           # 정적 파일
```

## 🔗 관련 링크

- [GitHub Repository](https://github.com/Kuneosu/web-training-ex)
- [Notion 페이지](https://kimkwonsu.notion.site/Web-Training-Examples-2400d6fd2448801aae49e7635b14550e)
- [라이브 데모](https://web-training-ex.vercel.app)

