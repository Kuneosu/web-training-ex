# MockApiPage 컴포넌트 문서

## 개요

`MockApiPage`는 두 가지 Mock API 접근 방식을 제공하는 React 컴포넌트입니다:

1. **실제 Mock API (MSW)**: Mock Service Worker를 사용하여 실제 HTTP 엔드포인트를 제공하는 진정한 Mock API
2. **비동기 시뮬레이터**: JavaScript의 Promise와 setTimeout을 활용한 간단한 비동기 동작 시뮬레이션

서버 API가 준비되지 않은 개발 초기 단계에서 프론트엔드 개발을 병행할 수 있도록 하며, 다양한 네트워크 상황(성공/실패/지연)을 시뮬레이션하여 예외 처리 로직을 테스트할 수 있는 교육용 페이지입니다.

## 주요 기능

### 1. 실제 Mock API (MSW 기반)
- **Service Worker 활용**: 브라우저에서 네트워크 요청을 가로채어 응답
- **실제 HTTP 엔드포인트**: GET, POST, DELETE 등 RESTful API 메서드 지원
- **네트워크 탭 통합**: 개발자 도구에서 실제 HTTP 요청/응답 확인 가능
- **다양한 엔드포인트**: 사용자 CRUD, 에러 시뮬레이션 등 다양한 API 제공
- **커스텀 지연 시간**: 실제 네트워크 지연을 시뮬레이션

### 2. 비동기 시뮬레이터
- **Promise 기반**: JavaScript Promise를 활용한 비동기 작업 처리
- **지연 시뮬레이션**: setTimeout으로 1.5초 네트워크 지연 구현
- **시나리오 제어**: 성공/실패 시나리오를 선택적으로 테스트
- **실제 API와 동일한 패턴**: async/await 패턴으로 실제 API 호출과 동일한 사용법

### 3. 상태 관리 시스템
- **솔루션별 독립 상태**: Mock API와 시뮬레이터 각각의 상태 관리
- **로딩 상태**: 요청 진행 중 시각적 피드백 제공
- **성공 상태**: API 응답 데이터 표시 및 포맷팅
- **에러 상태**: 예외 상황 처리 및 에러 메시지 표시
- **초기 상태**: 테스트 준비 상태 안내

### 4. 사용자 인터페이스
- **솔루션 선택 탭**: 두 가지 접근 방식을 쉽게 전환
- **직관적인 버튼**: 각 솔루션별 테스트 버튼
- **실시간 피드백**: 로딩 스피너와 상태별 색상 코딩
- **데이터 시각화**: JSON 응답 데이터의 가독성 있는 표시
- **타임스탬프 포맷팅**: 한국어 날짜/시간 형식으로 응답 시간 표시

## 기술적 구현

### 1. MSW (Mock Service Worker) 설정

#### MSW 핸들러 정의
```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // GET /api/users - 사용자 목록 조회
  http.get('/api/users', async () => {
    await delay(1000); // 네트워크 지연 시뮬레이션
    
    return HttpResponse.json({
      success: true,
      data: mockUsers,
      message: '사용자 목록을 성공적으로 조회했습니다.',
      timestamp: new Date().toISOString(),
    });
  }),

  // GET /api/users/:id - 특정 사용자 조회
  http.get('/api/users/:id', async ({ params }) => {
    await delay(800);
    const userId = Number(params.id);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return HttpResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ success: true, data: user });
  }),
];
```

#### Service Worker 초기화
```typescript
// src/main.tsx
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
```

### 2. 컴포넌트 상태 관리

```typescript
// 솔루션 선택 상태
const [selectedSolution, setSelectedSolution] = useState<'real-mock' | 'simulator'>('real-mock');

// 비동기 시뮬레이터 상태
const [loading, setLoading] = useState(false);
const [data, setData] = useState<MockApiResponse | null>(null);
const [error, setError] = useState<string | null>(null);

// MSW API 상태
const [mswData, setMswData] = useState<any>(null);
const [mswLoading, setMswLoading] = useState(false);
const [mswError, setMswError] = useState<string | null>(null);
```

### 3. API 요청 핸들러

#### MSW API 요청 핸들러
```typescript
const handleMswRequest = async (endpoint: string) => {
  setMswLoading(true);
  setMswData(null);
  setMswError(null);

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    
    setMswData(result);
  } catch (err) {
    setMswError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
  } finally {
    setMswLoading(false);
  }
};
```

#### 비동기 시뮬레이터 요청 핸들러
```typescript
const handleRequest = async (scenario: 'success' | 'error') => {
  setLoading(true);
  setData(null);
  setError(null);

  try {
    const response = await mockFetch(scenario);
    setData(response);
  } catch (err) {
    setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};
```

### 타임스탬프 포맷팅
```typescript
const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
```

## Mock API 시스템 원리

### 1. MSW (Mock Service Worker) 동작 원리
```typescript
// Service Worker가 네트워크 요청을 가로채는 방식
1. 브라우저에서 fetch('/api/users') 요청 발생
2. Service Worker가 요청을 가로채기
3. MSW 핸들러에서 요청 URL과 메서드 매칭
4. 지연 시간 적용 (delay 함수)
5. 정의된 응답 데이터 반환
6. 브라우저는 실제 서버 응답으로 인식
```

#### MSW의 주요 장점
- **실제 HTTP 요청**: fetch, axios 등 모든 HTTP 클라이언트와 호환
- **네트워크 탭 표시**: 개발자 도구에서 실제 네트워크 요청으로 확인 가능
- **RESTful 지원**: GET, POST, PUT, DELETE 등 모든 HTTP 메서드 지원
- **별도 서버 불필요**: 브라우저 내에서 완전히 동작

### 2. Promise + setTimeout 시뮬레이션
```javascript
// ../api/mockAPI.js의 구현 예시
export const mockFetch = (scenario) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (scenario === 'success') {
        resolve({
          message: 'API 요청이 성공했습니다',
          timestamp: new Date().toISOString(),
          data: { /* 응답 데이터 */ }
        });
      } else {
        reject(new Error('네트워크 오류가 발생했습니다'));
      }
    }, 1500); // 1.5초 지연
  });
};
```

### 3. 두 방식의 비교

| 특징 | MSW (실제 Mock API) | Promise 시뮬레이터 |
|------|---------------------|-------------------|
| HTTP 프로토콜 | ✅ 실제 HTTP 요청/응답 | ❌ 함수 호출 |
| 네트워크 탭 표시 | ✅ 개발자 도구에서 확인 가능 | ❌ 표시되지 않음 |
| RESTful API | ✅ 완전 지원 | ❌ 시뮬레이션만 |
| 구현 복잡도 | 중간 (MSW 설정 필요) | 낮음 (간단한 Promise) |
| 학습 목적 | 실제 개발 환경과 동일 | 비동기 개념 학습 |

## 컴포넌트 구조

### 1. 페이지 헤더
- 그라데이션 아이콘과 제목
- Mock API 시스템의 학습 목적 설명

### 2. 과제 분석 섹션
- **문제 상황**: 서버 API 미준비 시 프론트엔드 개발 지연
- **개발 필요성**: Mock API를 통한 병렬 개발의 생산성 향상
- **테스트 포인트**: 다양한 네트워크 상황 시뮬레이션 검증

### 3. 해결 방법 섹션
- **솔루션 선택 탭**: 두 가지 Mock API 접근 방식 선택
- **방안 1 - 실제 Mock API**: MSW를 사용한 실제 HTTP 엔드포인트 구현
- **방안 2 - 비동기 시뮬레이터**: Promise + setTimeout 기반 간단한 시뮬레이션

### 4. 구현 결과 섹션
- **MSW API 테스트**: 다양한 HTTP 엔드포인트 버튼 (GET /api/users, GET /api/users/1, 404, 500 에러)
- **시뮬레이터 테스트**: 성공/실패 시나리오 테스트 버튼
- **상태별 UI**: 각 솔루션별 로딩/성공/에러/초기 상태 인터페이스

## 상태별 사용자 인터페이스

### 로딩 상태
```typescript
{loading && (
  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
    <div className="flex items-center justify-center space-x-3">
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      <div className="text-center">
        <h3 className="font-bold text-blue-800 text-lg">Mock API 요청 중...</h3>
        <p className="text-blue-600 text-sm mt-1">
          네트워크 지연 시뮬레이션 중 (1.5초 대기)
        </p>
      </div>
    </div>
  </div>
)}
```

### 성공 상태
- **응답 메시지**: Mock API에서 반환된 성공 메시지
- **응답 시간**: 포맷팅된 타임스탬프 표시
- **응답 데이터**: JSON 형태의 데이터를 읽기 쉽게 포맷팅

### 에러 상태
- **에러 메시지**: catch 블록에서 처리된 에러 메시지
- **시각적 구분**: 빨간색 테마로 에러 상황 명확히 표시
- **사용자 친화적**: 기술적 에러를 사용자가 이해하기 쉬운 메시지로 변환

### 초기 상태
- **테스트 안내**: 버튼 클릭을 유도하는 안내 메시지
- **준비 상태**: Mock API 테스트 준비 완료 표시

## 실무 적용 사례

### 개발 단계별 활용
1. **초기 개발**: 서버 API 설계 단계에서 프론트엔드 개발 시작
2. **프로토타이핑**: UI/UX 검증을 위한 빠른 프로토타입 구현
3. **병렬 개발**: 백엔드와 프론트엔드 동시 개발로 개발 기간 단축
4. **테스트**: 다양한 네트워크 상황에 대한 예외 처리 검증

### 시나리오별 테스트
```typescript
// 성공 시나리오 테스트
const testSuccessScenario = async () => {
  // 정상적인 데이터 응답 처리 확인
  // UI 상태 변화 검증
  // 사용자 경험 개선점 파악
};

// 실패 시나리오 테스트
const testErrorScenario = async () => {
  // 에러 처리 로직 검증
  // 사용자 친화적 에러 메시지 확인
  // 복구 가능한 에러 처리 방안 검토
};
```

### 네트워크 상황 시뮬레이션
- **지연 테스트**: 느린 네트워크 환경에서의 사용자 경험
- **타임아웃**: 요청 시간 초과 상황 처리
- **간헐적 실패**: 불안정한 네트워크 환경 시뮬레이션
- **대용량 응답**: 큰 데이터 응답 시 성능 영향 분석

## Mock API의 장점

### 개발 생산성 향상
1. **독립적 개발**: 서버 API 완성도와 무관하게 프론트엔드 개발 진행
2. **빠른 피드백**: 즉시 테스트 가능한 환경으로 개발 속도 향상
3. **다양한 시나리오**: 실제 서버에서는 재현하기 어려운 상황 테스트
4. **일관된 테스트**: 동일한 조건에서 반복 테스트 가능

### 품질 향상
- **예외 처리**: 다양한 에러 상황에 대한 견고한 처리 로직 구현
- **사용자 경험**: 네트워크 지연이나 에러 상황에서의 UX 최적화
- **안정성**: 실제 배포 전 다양한 상황에 대한 충분한 테스트

## 확장 가능성

### 고급 Mock API 기능
```typescript
// 다양한 응답 시간 시뮬레이션
const mockFetchWithVariableDelay = (scenario, delay = 1500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 시나리오별 처리
    }, delay);
  });
};

// HTTP 상태 코드 시뮬레이션
const mockFetchWithStatusCode = (statusCode) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (statusCode >= 200 && statusCode < 300) {
        resolve({ status: statusCode, data: {} });
      } else {
        reject(new Error(`HTTP ${statusCode} Error`));
      }
    }, 1500);
  });
};
```

### 데이터 시뮬레이션
```typescript
// 동적 데이터 생성
const generateMockData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    timestamp: new Date().toISOString()
  }));
};

// 페이지네이션 시뮬레이션
const mockFetchWithPagination = (page, limit) => {
  const totalItems = 100;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  
  return Promise.resolve({
    data: generateMockData(endIndex - startIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    }
  });
};
```

### MSW 엔드포인트 확장
```typescript
// 추가 엔드포인트 구현 예시
export const handlers = [
  // POST /api/users - 새 사용자 생성
  http.post('/api/users', async ({ request }) => {
    await delay(1200);
    const body = await request.json() as { name: string; email: string; role: string };
    
    if (!body.name || !body.email) {
      return HttpResponse.json(
        { success: false, error: '이름과 이메일은 필수 항목입니다.' },
        { status: 400 }
      );
    }
    
    const newUser = { id: Date.now(), ...body };
    return HttpResponse.json(
      { success: true, data: newUser, message: '사용자가 생성되었습니다.' },
      { status: 201 }
    );
  }),

  // DELETE /api/users/:id - 사용자 삭제
  http.delete('/api/users/:id', async ({ params }) => {
    await delay(1000);
    const userId = Number(params.id);
    
    return HttpResponse.json({
      success: true,
      message: `사용자 ${userId}가 삭제되었습니다.`,
      timestamp: new Date().toISOString(),
    });
  }),
];
```

## 성능 고려사항

### 메모리 관리
- **상태 초기화**: 새 요청 시 이전 상태 적절히 초기화
- **메모리 누수 방지**: 컴포넌트 언마운트 시 타이머 정리
- **대용량 데이터**: Mock 데이터 크기 제한으로 성능 영향 최소화

### 최적화 기법
```typescript
// 컴포넌트 언마운트 시 정리
useEffect(() => {
  return () => {
    // 진행 중인 타이머나 요청 정리
    // 메모리 누수 방지
  };
}, []);

// 중복 요청 방지
const handleRequest = useCallback(async (scenario) => {
  if (loading) return; // 이미 진행 중인 요청이 있으면 무시
  
  // 요청 로직...
}, [loading]);
```

## 테스트 시나리오

### MSW 실제 Mock API 테스트
1. **GET /api/users**: 사용자 목록 조회 (1초 지연)
2. **GET /api/users/1**: 특정 사용자 조회 성공 (0.8초 지연)
3. **GET /api/users/999**: 존재하지 않는 사용자 (404 에러)
4. **GET /api/error**: 서버 에러 시뮬레이션 (500 에러)
5. **개발자 도구**: Network 탭에서 실제 HTTP 요청 확인

### 비동기 시뮬레이터 테스트
1. **성공 버튼 클릭**: 1.5초 후 성공 응답 확인
2. **실패 버튼 클릭**: 1.5초 후 에러 응답 확인
3. **로딩 상태**: 요청 중 스피너 및 버튼 비활성화 확인
4. **상태 전환**: 로딩→성공/실패 상태 자연스러운 전환

### 사용자 경험 테스트
1. **연속 클릭**: 로딩 중 버튼 중복 클릭 방지 확인
2. **상태 초기화**: 새 요청 시 이전 결과 적절히 초기화
3. **에러 복구**: 에러 후 성공 요청으로 정상 복구 가능
4. **타임스탬프**: 각 요청마다 다른 응답 시간 표시

### 예외 상황 테스트
1. **빠른 연속 요청**: 첫 번째 요청 완료 전 두 번째 요청 시도
2. **컴포넌트 언마운트**: 요청 진행 중 페이지 이동
3. **네트워크 변경**: 시나리오 변경 후 다른 결과 확인

## 교육적 가치

### 학습 목표
1. **Mock API 이해**: 실제 Mock API와 시뮬레이션의 차이점 학습
2. **MSW 활용**: Service Worker 기반 Mock API 구현 방법
3. **비동기 프로그래밍**: Promise, async/await 패턴 이해
4. **상태 관리**: React에서 비동기 작업과 상태 연동
5. **에러 처리**: HTTP 상태 코드별 예외 처리
6. **사용자 경험**: 로딩 상태와 피드백의 중요성

### 실습 포인트

#### 실제 Mock API (MSW)
- 다양한 HTTP 엔드포인트 테스트 (GET, POST, DELETE)
- 개발자 도구 Network 탭에서 실제 요청 확인
- HTTP 상태 코드별 응답 처리 (200, 404, 500)
- RESTful API 패턴 학습

#### 비동기 시뮬레이터
- 성공/실패 버튼으로 다양한 시나리오 체험
- 1.5초 지연을 통한 실제 네트워크 환경 시뮬레이션
- JSON 응답 구조와 타임스탬프 포맷팅 학습
- 상태별 UI 변화 관찰

### 실무 연결점
- **개발 효율성**: 백엔드 API 완성 전 프론트엔드 개발 진행
- **테스트 환경**: 다양한 네트워크 상황과 에러 케이스 테스트
- **협업 개선**: 백엔드와 프론트엔드 병렬 개발로 개발 기간 단축
- **품질 향상**: 실제 배포 전 충분한 예외 처리 검증
- **MSW 실무 활용**: 현대 웹 개발에서 널리 사용되는 Mock API 도구 경험

## 코드 품질

### 타입 안전성
```typescript
// TypeScript 인터페이스 정의
interface MockApiResponse {
  message: string;
  timestamp: string;
  data?: any;
}

// 에러 타입 가드
catch (err) {
  setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
}
```

### 접근성
- **시각적 피드백**: 색상과 함께 아이콘으로 상태 구분
- **명확한 레이블**: 버튼과 상태 메시지의 명확한 텍스트
- **키보드 접근**: 모든 인터랙션 요소의 키보드 접근성 보장

### 유지보수성
- **관심사 분리**: Mock API 로직과 UI 컴포넌트 분리
- **재사용 가능**: 다른 컴포넌트에서도 활용 가능한 구조
- **확장성**: 새로운 시나리오나 기능 추가 용이

## 구현된 파일 구조

```
src/
├── mocks/
│   ├── handlers.ts          # MSW API 핸들러 정의
│   └── browser.ts           # MSW Service Worker 설정
├── pages/
│   └── MockApiPage.tsx      # 메인 컴포넌트
├── api/
│   └── mockAPI.ts           # Promise 기반 시뮬레이터
└── main.tsx                 # MSW 초기화 코드
```

## 주요 기술 스택

- **MSW (Mock Service Worker)**: 실제 HTTP Mock API 구현
- **React 18**: 컴포넌트 기반 UI 구현
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 반응형 UI 스타일링
- **Lucide React**: 아이콘 컴포넌트

## 배포 및 사용

이 컴포넌트는 개발 환경에서만 MSW가 활성화되도록 설정되어 있으며, 프로덕션 빌드 시에는 자동으로 비활성화됩니다. 두 가지 Mock API 접근 방식을 통해 개발자가 상황에 맞는 최적의 방법을 선택하여 사용할 수 있습니다.

이 컴포넌트는 현대 웹 개발에서 필수적인 Mock API 시스템을 이해하고 구현할 수 있는 실용적인 교육 자료로, 실제 개발 환경에서 바로 활용할 수 있는 패턴과 기법을 제공합니다.