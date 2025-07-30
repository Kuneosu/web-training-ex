# MockApiPage 컴포넌트 문서

## 개요

`MockApiPage`는 JavaScript의 Promise와 setTimeout을 활용하여 실제 네트워크 통신을 시뮬레이션하는 Mock API 시스템을 구현한 React 컴포넌트입니다. 서버 API가 준비되지 않은 개발 초기 단계에서 프론트엔드 개발을 병행할 수 있도록 하며, 다양한 네트워크 상황(성공/실패/지연)을 시뮬레이션하여 예외 처리 로직을 테스트할 수 있는 교육용 페이지입니다.

## 주요 기능

### 1. 비동기 네트워크 통신 시뮬레이션
- **Promise 기반**: JavaScript Promise를 활용한 비동기 작업 처리
- **지연 시뮬레이션**: setTimeout으로 1.5초 네트워크 지연 구현
- **시나리오 제어**: 성공/실패 시나리오를 선택적으로 테스트
- **실제 API와 동일한 패턴**: async/await 패턴으로 실제 API 호출과 동일한 사용법

### 2. 상태 관리 시스템
- **로딩 상태**: 요청 진행 중 시각적 피드백 제공
- **성공 상태**: API 응답 데이터 표시 및 포맷팅
- **에러 상태**: 예외 상황 처리 및 에러 메시지 표시
- **초기 상태**: 테스트 준비 상태 안내

### 3. 사용자 인터페이스
- **직관적인 버튼**: 성공/실패 시나리오별 테스트 버튼
- **실시간 피드백**: 로딩 스피너와 상태별 색상 코딩
- **데이터 시각화**: JSON 응답 데이터의 가독성 있는 표시
- **타임스탬프 포맷팅**: 한국어 날짜/시간 형식으로 응답 시간 표시

## 기술적 구현

### Mock API 호출 함수
```typescript
import { mockFetch } from '../api/mockAPI';
import type { MockApiResponse } from '../api/mockAPI';

const handleRequest = async (scenario: 'success' | 'error') => {
  // 상태 초기화
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

### 상태 관리
```typescript
const [loading, setLoading] = useState(false);           // 로딩 상태
const [data, setData] = useState<MockApiResponse | null>(null);  // 성공 응답 데이터
const [error, setError] = useState<string | null>(null); // 에러 메시지
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

### Promise + setTimeout 조합
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

### 비동기 동작 흐름
1. **요청 시작**: 버튼 클릭 시 즉시 loading 상태를 true로 변경
2. **Promise 생성**: new Promise()로 비동기 작업 객체 생성
3. **지연 시뮬레이션**: setTimeout으로 1.5초 네트워크 지연 구현
4. **조건부 처리**: scenario 파라미터에 따라 resolve(성공) 또는 reject(실패) 실행
5. **상태 업데이트**: 성공 시 data 상태 업데이트, 실패 시 error 상태 업데이트
6. **로딩 완료**: finally 블록에서 loading 상태를 false로 변경

## 컴포넌트 구조

### 1. 페이지 헤더
- 그라데이션 아이콘과 제목
- Mock API 시스템의 학습 목적 설명

### 2. 과제 분석 섹션
- **문제 상황**: 서버 API 미준비 시 프론트엔드 개발 지연
- **개발 필요성**: Mock API를 통한 병렬 개발의 생산성 향상
- **테스트 포인트**: 다양한 네트워크 상황 시뮬레이션 검증

### 3. 해결 방법 섹션
- **Promise + setTimeout**: 비동기 동작 시뮬레이션 핵심 기술
- **상태 관리 연동**: React 상태와 비동기 작업의 통합 흐름

### 4. 구현 결과 섹션
- **테스트 버튼**: 성공/실패 시나리오 테스트
- **상태별 UI**: 로딩/성공/에러/초기 상태별 차별화된 인터페이스

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

### 외부 라이브러리 연동
```typescript
// MSW (Mock Service Worker) 연동
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/data', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.json({
        message: 'MSW Mock API Response',
        data: generateMockData(10)
      })
    );
  })
];

// JSON Server 연동
// db.json 파일 기반 RESTful API 시뮬레이션
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

### 기본 기능 테스트
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
1. **비동기 프로그래밍**: Promise, async/await 패턴 이해
2. **상태 관리**: React에서 비동기 작업과 상태 연동
3. **에러 처리**: try-catch-finally 구문을 통한 예외 처리
4. **사용자 경험**: 로딩 상태와 피드백의 중요성

### 실습 포인트
- 성공/실패 버튼으로 다양한 시나리오 체험
- 1.5초 지연을 통한 실제 네트워크 환경 시뮬레이션
- JSON 응답 구조와 타임스탬프 포맷팅 학습
- 상태별 UI 변화 관찰

### 실무 연결점
- Mock API 구현으로 실제 개발 프로세스 이해
- 네트워크 예외 상황에 대한 견고한 처리 방법
- 사용자 친화적인 에러 메시지 작성 기법
- 비동기 작업의 상태 관리 베스트 프랙티스

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

이 컴포넌트는 현대 웹 개발에서 필수적인 Mock API 시스템을 이해하고 구현할 수 있는 실용적인 교육 자료로, 실제 개발 환경에서 바로 활용할 수 있는 패턴과 기법을 제공합니다.