# QueryClientProvider 학습 정리

## 개요

**QueryClientProvider**는 TanStack Query(React Query)의 핵심 컴포넌트로, React 애플리케이션에서 서버 상태 관리를 위한 전역 환경을 제공합니다.

## 기본 구조

### 1. 설정 방법

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 모든 하위 컴포넌트에서 useQuery 사용 가능 */}
      <YourComponents />
    </QueryClientProvider>
  );
}
```

### 2. 역할 분담

**QueryClientProvider (외부 래퍼)**
- **역할**: useQuery가 동작할 수 있는 환경 제공
- **제공하는 것**: 캐시 저장소, 쿼리 관리 시스템, 전역 설정

**useQuery (각 컴포넌트)**
- **역할**: 구체적인 캐싱 대상과 방법 정의
- **정의하는 것**: 어떤 데이터를 캐싱할지, 언제 새로 요청할지, 에러 처리 방법

## 주요 기능

### 1. 서버 상태 관리의 복잡성 해결

**기존 방식의 문제점:**
```typescript
// 전통적인 방식 - 매번 반복되는 보일러플레이트
function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // 재시도, 캐싱, 백그라운드 업데이트 등 모두 수동 구현 필요
}
```

**TanStack Query 방식:**
```typescript
// 간단하고 강력한 서버 상태 관리
function Component() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  // 캐싱, 재시도, 백그라운드 업데이트, 중복 요청 제거 등 자동 처리
}
```

### 2. 자동 제공되는 기능들

- **자동 캐싱**: 한 번 요청한 데이터는 메모리에 캐시
- **백그라운드 업데이트**: 설정된 시간 후 자동 재요청
- **중복 제거**: 동일한 queryKey 요청 시 한 번만 실행
- **상태 동기화**: API 데이터 변경 시 모든 관련 컴포넌트 자동 업데이트
- **낙관적 업데이트**: UI 먼저 업데이트, 실패 시 롤백
- **로딩/에러 상태 자동 관리**: 반복적인 상태 관리 코드 제거

## 설정 방식

### 1. 기본 설정 (현재 프로젝트)

```typescript
const queryClient = new QueryClient(); // 모든 기본값 사용
```

**기본값:**
- **staleTime**: 0ms (즉시 stale 상태)
- **cacheTime**: 5분 (가비지 컬렉션 시간)
- **retry**: 3회 재시도
- **refetchOnWindowFocus**: true (창 포커스 시 재요청)

### 2. 전역 커스텀 설정

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,           // 30초간 신선
      cacheTime: 1000 * 60 * 10,      // 10분간 메모리 유지
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,     // 창 포커스 시 재요청 비활성화
      refetchOnMount: false,           // 컴포넌트 마운트 시 재요청 비활성화
      refetchOnReconnect: true,        // 네트워크 재연결 시 재요청
    },
    mutations: {
      retry: false,                    // mutation 재시도 없음
    },
  },
});
```

### 3. 개별 쿼리 설정 (현재 프로젝트 방식)

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['caching-data', simulateError],
  queryFn: fetchData,
  
  // 개별 쿼리별 커스텀 설정
  staleTime: 30 * 1000,              // 30초간 신선
  retry: simulateError ? 2 : 1,       // 조건부 재시도
  refetchOnWindowFocus: false,        // 창 포커스 재요청 비활성화
});
```

## 캐시 공유 메커니즘

### 1. QueryKey를 통한 캐시 공유

```typescript
// PageA.tsx
function PageA() {
  const { data } = useQuery({
    queryKey: ['users'],          // 🔑 키: 'users'
    queryFn: fetchUsers,
  });
  // 첫 방문 시 API 호출 + 캐시 저장
}

// PageB.tsx  
function PageB() {
  const { data } = useQuery({
    queryKey: ['users'],          // 🔑 같은 키: 'users'
    queryFn: fetchUsers,
  });
  // 캐시된 데이터 즉시 사용! (API 호출 안함)
}
```

### 2. 캐시 키의 중요성

```typescript
// 같은 데이터, 다른 키 → 별도 캐시
const query1 = useQuery({
  queryKey: ['users'],           // 🔑 키 1
  queryFn: fetchUsers,
});

const query2 = useQuery({
  queryKey: ['user-list'],       // 🔑 키 2 (다름)
  queryFn: fetchUsers,           // 같은 함수여도 별도 캐시!
});
```

### 3. 전역 캐시 무효화

```typescript
// 한 페이지에서 캐시 무효화
queryClient.invalidateQueries({ queryKey: ['users'] });

// 결과: 같은 queryKey를 사용하는 모든 페이지에서 다시 로딩됨
```

## 실제 동작 흐름

### 1. 첫 번째 요청

```typescript
// 컴포넌트 A에서 첫 호출
const ComponentA = () => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers  // 🌐 실제 API 호출
  });
};
```

### 2. 캐시 활용

```typescript
// 다른 컴포넌트에서 같은 쿼리 호출
const ComponentB = () => {
  const { data } = useQuery({
    queryKey: ['users'],    // 같은 키!
    queryFn: fetchUsers     // 🚫 API 호출 안함, 캐시 사용
  });
};
```

### 3. 백그라운드 업데이트

```typescript
// 30초 후 (staleTime 만료)
// - 캐시된 데이터는 즉시 반환
// - 백그라운드에서 자동으로 새 데이터 요청
// - 새 데이터 도착 시 모든 관련 컴포넌트 자동 업데이트
```

## 실제 사용 사례

### 1. 목록 + 상세 페이지 패턴

```typescript
// 사용자 목록 페이지
const UsersPage = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

// 사용자 상세 페이지  
const UserDetailPage = ({ userId }) => {
  const { data: users } = useQuery({
    queryKey: ['users'],        // 같은 키 → 캐시 공유
    queryFn: fetchUsers,
  });
  
  const user = users?.find(u => u.id === userId); // 캐시된 목록에서 찾기
};
```

### 2. 조건부 캐싱

```typescript
// 현재 프로젝트 예시
const { data } = useQuery({
  queryKey: ['caching-data', simulateError], // 에러 상태도 키에 포함
  queryFn: async () => {
    return simulateError ? fetchDataWithError() : fetchData();
  },
  staleTime: 30 * 1000,
  retry: simulateError ? 2 : 1,
});
```

## 비유로 이해하기

**QueryClientProvider = 은행 시스템**
- 계좌 관리 시스템 제공
- 입출금 인프라 구축  
- 보안 및 규칙 설정

**useQuery = 개별 계좌 개설**
- "savings-account"라는 이름으로 계좌 개설
- 매월 자동 입금 설정
- 잔액 부족 시 알림 설정

## 핵심 포인트

1. **Provider는 환경 제공, useQuery는 구체적 사용**
   - QueryClientProvider: 캐싱 시스템 켜기
   - useQuery: 구체적인 캐싱 규칙 정하기

2. **자동 기능 활성화**
   - Provider 설정만으로 모든 TanStack Query 기능 활성화
   - 실제 동작은 useQuery 사용 시 시작

3. **전역 캐시 공유**
   - 동일한 queryKey 사용 시 모든 컴포넌트에서 캐시 공유
   - 페이지 간 이동 시에도 캐시 유지

4. **선언적 서버 상태 관리**
   - 복잡한 상태 관리 로직을 선언적으로 처리
   - 보일러플레이트 코드 대폭 감소

## 결론

QueryClientProvider는 단순히 "캐싱만을 위한" 도구가 아니라, **현대적인 서버 상태 관리를 위한 종합 솔루션**입니다. 캐싱, 로딩/에러 상태 관리, 중복 요청 방지, 백그라운드 데이터 동기화, 낙관적 업데이트 등 복잡한 서버 상태 관리 문제들을 종합적으로 해결합니다.

**핵심 공식:**
- **QueryClientProvider** = useQuery를 사용할 수 있는 환경 조성
- **useQuery** = 구체적인 데이터 요청 및 캐싱 규칙 정의
- **queryKey** = 캐시의 주소 역할, 동일한 키는 캐시 공유