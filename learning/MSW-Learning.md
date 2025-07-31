# MSW (Mock Service Worker) 완전 학습 가이드

## 목차
1. [MSW가 뭔가요?](#1-msw가-뭔가요)
2. [어떻게 동작하나요?](#2-어떻게-동작하나요)
3. [기본 사용법](#3-기본-사용법)
4. [프로젝트에서 어떻게 사용되고 있나요?](#4-프로젝트에서-어떻게-사용되고-있나요)
5. [실무 활용 팁](#5-실무-활용-팁)
6. [자주 묻는 질문들](#6-자주-묻는-질문들)

---

## 1. MSW가 뭔가요?

### 🤔 MSW를 한 문장으로 설명한다면?

**"브라우저와 Node.js에서 네트워크 요청을 가로채서 가짜 응답을 주는 API 모킹 라이브러리"**

### 🎯 왜 MSW를 사용할까?

#### 전통적인 Mock 방식의 문제점
```javascript
// ❌ 기존 방식: fetch를 직접 모킹
window.fetch = jest.fn(() => 
  Promise.resolve({ 
    json: () => Promise.resolve({ data: 'mock' }) 
  })
);

// 문제점:
// 1. 실제 네트워크 동작과 다름
// 2. 개발자 도구에서 확인 불가
// 3. 테스트 코드가 복잡해짐
```

#### MSW의 해결책
```javascript
// ✅ MSW 방식: 실제 네트워크 레벨에서 인터셉트
rest.get('/api/users', (req, res, ctx) => {
  return res(ctx.json({ users: [...] }));
});

// 장점:
// 1. 실제 fetch 사용 (코드 수정 불필요)
// 2. Network 탭에서 확인 가능
// 3. 프론트엔드 코드 그대로 유지
```

### 📊 MSW vs 다른 Mock 방식 비교

| 특징 | MSW | JSON Server | 직접 모킹 |
|------|-----|-------------|-----------|
| **설치 난이도** | 쉬움 | 보통 | 쉬움 |
| **실제 네트워크** | ✅ | ✅ | ❌ |
| **개발자 도구** | ✅ | ✅ | ❌ |
| **코드 수정** | 불필요 | 불필요 | 필요 |
| **동적 응답** | ✅ | 제한적 | ✅ |
| **테스트 통합** | ✅ | ❌ | ✅ |

---

## 2. 어떻게 동작하나요?

### 🏗️ MSW의 핵심 구조

```
사용자 코드 → fetch('/api/users')
                ↓
         Service Worker
         (요청 가로채기)
                ↓
         MSW 핸들러 확인
                ↓
    일치하는 핸들러 있음?
      ↙️ Yes        ↘️ No
모의 응답 반환    실제 서버로 전달
```

### 🎨 핵심 개념 3가지

#### 1. Service Worker (브라우저)
- 브라우저와 네트워크 사이의 프록시 역할
- 모든 네트워크 요청을 가로챌 수 있음
- MSW는 이를 활용해 API 모킹 구현

#### 2. Request Handlers (요청 핸들러)
- 어떤 요청을 어떻게 처리할지 정의
- REST API, GraphQL 모두 지원
- 동적 응답 생성 가능

#### 3. Response Resolver (응답 생성기)
- 요청에 대한 응답을 만드는 함수
- 상태 코드, 헤더, 바디 모두 제어 가능
- 실제 서버처럼 동작

### 🔄 실제 동작 과정

```javascript
// 1. 프론트엔드 코드 (변경 없음!)
const response = await fetch('/api/users');
const users = await response.json();

// 2. MSW가 요청을 가로챔
// 3. 핸들러에서 정의한 응답 반환
// 4. 프론트엔드는 실제 API인 것처럼 사용
```

---

## 3. 기본 사용법

### 📦 설치 및 초기 설정

```bash
# 1. MSW 설치
npm install msw --save-dev

# 2. Service Worker 생성
npx msw init public/ --save
```

### 🔧 기본 설정 코드

#### 1. 핸들러 정의 (src/mocks/handlers.js)
```javascript
import { rest } from 'msw';

export const handlers = [
  // GET 요청 모킹
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: '김철수', email: 'kim@example.com' },
        { id: 2, name: '이영희', email: 'lee@example.com' }
      ])
    );
  }),

  // POST 요청 모킹
  rest.post('/api/users', async (req, res, ctx) => {
    const newUser = await req.json();
    
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now(),
        ...newUser,
        createdAt: new Date().toISOString()
      })
    );
  }),

  // 에러 응답 모킹
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    if (id === '999') {
      return res(
        ctx.status(404),
        ctx.json({ error: '사용자를 찾을 수 없습니다' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({ id, name: '홍길동', email: 'hong@example.com' })
    );
  })
];
```

#### 2. Worker 설정 (src/mocks/browser.js)
```javascript
import { setupWorker } from 'msw';
import { handlers } from './handlers';

// Worker 인스턴스 생성
export const worker = setupWorker(...handlers);
```

#### 3. 앱에서 시작하기 (src/main.js)
```javascript
// 개발 환경에서만 MSW 시작
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass', // 핸들러 없는 요청은 그대로 통과
  });
}
```

### 💡 주요 응답 메서드

```javascript
// 상태 코드 설정
ctx.status(200)           // 성공
ctx.status(404)           // Not Found
ctx.status(500)           // 서버 에러

// 응답 본문 설정
ctx.json({ data: '...' })      // JSON 응답
ctx.text('Hello')              // 텍스트 응답
ctx.xml('<root>...</root>')    // XML 응답

// 헤더 설정
ctx.set('Content-Type', 'application/json')
ctx.set('X-Custom-Header', 'value')

// 지연 시간 설정
ctx.delay(1000)          // 1초 지연
ctx.delay('real')        // 실제 네트워크같은 지연
```

### 🎯 동적 응답 처리

```javascript
rest.get('/api/search', (req, res, ctx) => {
  // URL 파라미터 읽기
  const query = req.url.searchParams.get('q');
  
  // 조건부 응답
  if (!query) {
    return res(
      ctx.status(400),
      ctx.json({ error: '검색어를 입력하세요' })
    );
  }
  
  // 동적 데이터 생성
  const results = generateSearchResults(query);
  
  return res(
    ctx.status(200),
    ctx.json({ query, results, total: results.length })
  );
});
```

---

## 4. 프로젝트에서 어떻게 사용되고 있나요?

### 📍 실제 구현 분석

#### MSW 핸들러 설정 (src/mocks/handlers.ts)
```typescript
import { rest } from 'msw';

export const handlers = [
  // 사용자 목록 조회
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        users: [
          { id: 1, name: 'John Doe', role: 'admin' },
          { id: 2, name: 'Jane Smith', role: 'user' }
        ],
        total: 2
      })
    );
  }),

  // 404 에러 시뮬레이션
  rest.get('/api/users/999', (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({ error: 'User not found' })
    );
  }),

  // 서버 에러 시뮬레이션
  rest.get('/api/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  })
];
```

#### MockApiPage에서의 활용
```typescript
const handleMswRequest = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);
    
    // MSW가 요청을 가로채서 모의 응답 반환
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error);
    }
    
    setMswData(result);
  } catch (err) {
    setMswError(err.message);
  }
};
```

### 🔍 프로젝트의 MSW 활용 포인트

1. **실제 HTTP 요청 유지**: fetch API를 그대로 사용
2. **에러 시나리오 테스트**: 404, 500 에러 시뮬레이션
3. **개발자 도구 통합**: Network 탭에서 요청/응답 확인 가능
4. **조건부 활성화**: 개발 환경에서만 동작

---

## 5. 실무 활용 팁

### 🏢 실무 시나리오별 활용

#### 1. 인증 토큰 처리
```javascript
rest.post('/api/login', async (req, res, ctx) => {
  const { email, password } = await req.json();
  
  // 간단한 검증
  if (email === 'test@example.com' && password === 'password') {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: { id: 1, email, name: 'Test User' }
      })
    );
  }
  
  return res(
    ctx.status(401),
    ctx.json({ error: '잘못된 인증 정보입니다' })
  );
});
```

#### 2. 페이지네이션 구현
```javascript
rest.get('/api/posts', (req, res, ctx) => {
  const page = Number(req.url.searchParams.get('page')) || 1;
  const limit = Number(req.url.searchParams.get('limit')) || 10;
  
  const allPosts = generateMockPosts(100); // 100개 더미 데이터
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return res(
    ctx.status(200),
    ctx.json({
      data: allPosts.slice(start, end),
      pagination: {
        page,
        limit,
        total: allPosts.length,
        totalPages: Math.ceil(allPosts.length / limit)
      }
    })
  );
});
```

#### 3. 파일 업로드 모킹
```javascript
rest.post('/api/upload', async (req, res, ctx) => {
  // 실제 파일은 받지 않고 성공 응답만
  return res(
    ctx.status(200),
    ctx.json({
      url: 'https://example.com/mock-file.jpg',
      filename: 'mock-file.jpg',
      size: 1024000
    })
  );
});
```

### 💡 개발 효율 높이는 팁

#### 1. 시나리오별 핸들러 분리
```javascript
// handlers/users.js
export const userHandlers = [
  rest.get('/api/users', ...),
  rest.post('/api/users', ...)
];

// handlers/posts.js
export const postHandlers = [
  rest.get('/api/posts', ...),
  rest.post('/api/posts', ...)
];

// handlers/index.js
export const handlers = [
  ...userHandlers,
  ...postHandlers
];
```

#### 2. 환경별 설정
```javascript
// 지연 시간 환경별 설정
const delay = process.env.MOCK_DELAY || 1000;

rest.get('/api/data', (req, res, ctx) => {
  return res(
    ctx.delay(delay), // 환경별로 다른 지연 시간
    ctx.json({ ... })
  );
});
```

---

## 6. 자주 묻는 질문들

### ❓ Q1: MSW는 프로덕션에서도 사용 가능한가요?
**A:** 가능하지만 권장하지 않습니다. 개발/테스트 환경에서만 사용하는 것이 좋습니다. 프로덕션에서는 번들 크기와 성능에 영향을 줄 수 있습니다.

### ❓ Q2: 실제 API와 MSW를 어떻게 전환하나요?
**A:** 코드 수정 없이 MSW를 비활성화하면 됩니다:
```javascript
// MSW 비활성화
worker.stop();

// 또는 처음부터 조건부 실행
if (USE_MOCK_API) {
  worker.start();
}
```

### ❓ Q3: GraphQL도 모킹할 수 있나요?
**A:** 네! GraphQL 전용 핸들러를 제공합니다:
```javascript
import { graphql } from 'msw';

graphql.query('GetUsers', (req, res, ctx) => {
  return res(
    ctx.data({
      users: [...]
    })
  );
});
```

### ❓ Q4: 동일한 엔드포인트에 다른 응답을 주려면?
**A:** 요청 횟수나 조건에 따라 다른 응답 가능합니다:
```javascript
let callCount = 0;

rest.get('/api/data', (req, res, ctx) => {
  callCount++;
  
  if (callCount === 1) {
    return res(ctx.status(500)); // 첫 번째는 실패
  }
  
  return res(ctx.json({ data: 'success' })); // 이후는 성공
});
```

### ❓ Q5: 테스트에서는 어떻게 사용하나요?
**A:** Node.js 환경용 설정을 사용합니다:
```javascript
import { setupServer } from 'msw/node';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🎯 핵심 요약

### MSW의 3가지 강점
1. **실제같은 모킹**: 네트워크 레벨에서 동작해 실제 API와 동일한 경험
2. **개발 생산성**: 백엔드 의존성 없이 프론트엔드 개발 가능
3. **테스트 용이성**: 다양한 시나리오를 쉽게 재현 가능

### 핵심 개념 정리
- **Service Worker**: 네트워크 요청을 가로채는 브라우저 기술
- **Request Handler**: 어떤 요청을 어떻게 처리할지 정의
- **Response Resolver**: 모의 응답을 생성하는 함수

### 기본 사용 패턴
```javascript
// 1. 핸들러 정의
rest.get('/api/resource', (req, res, ctx) => {
  return res(ctx.json({ data: 'mock' }));
});

// 2. Worker 시작
worker.start();

// 3. 일반 fetch 사용 (코드 수정 없음!)
fetch('/api/resource').then(res => res.json());
```

**MSW는 실제 API처럼 동작하는 가짜 API를 만들어주는 강력한 도구입니다!** 🚀