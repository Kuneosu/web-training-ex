# useQuery와 React Query 캐싱 쉽게 이해하기

## 목차
1. [useQuery가 뭔가요?](#1-usequery가-뭔가요)
2. [캐싱이 어떻게 동작하나요?](#2-캐싱이-어떻게-동작하나요)
3. [프로젝트에서 어떻게 사용되고 있나요?](#3-프로젝트에서-어떻게-사용되고-있나요)
4. [실무에서 어떻게 활용하나요?](#4-실무에서-어떻게-활용하나요)
5. [자주 묻는 질문들](#5-자주-묻는-질문들)

---

## 1. useQuery가 뭔가요?

### 🤔 useQuery를 한 문장으로 설명한다면?

**"서버에서 데이터를 가져올 때 로딩, 에러, 캐싱을 자동으로 처리해주는 마법같은 도구"**

### 🏗️ 핵심 기술 구조

**React Query (TanStack Query)**는 서버 상태 관리 라이브러리로, 3가지 핵심 개념으로 구성됩니다:

1. **Query**: 서버에서 데이터를 가져오는 작업
2. **Cache**: 한 번 가져온 데이터를 메모리에 저장
3. **Synchronization**: 캐시와 서버 데이터를 동기화

### 🔧 기본 사용법

```tsx
import { useQuery } from '@tanstack/react-query';

// 1. 기본 구조
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],           // 캐시 키 (고유 식별자)
  queryFn: () => fetchUsers(),   // 데이터 가져오는 함수
});

// 2. 실제 사용 예시
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      return response.json();
    }
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생!</div>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### 📝 전통적인 방식 vs useQuery

**전통적인 방식 (복잡함):**
- useState로 로딩 상태 관리
- useState로 에러 상태 관리  
- useState로 데이터 상태 관리
- useEffect에서 API 호출
- 중복 요청 수동으로 방지
- 캐싱 직접 구현

**useQuery 방식 (간단함):**
- useQuery 한 줄 → 모든 것이 자동!

### 🎯 useQuery의 핵심 가치

| 기능 | 설명 | 실생활 비유 |
|------|------|-------------|
| **자동 로딩 관리** | isLoading 상태 자동 제공 | 엘리베이터 층수 표시 |
| **자동 에러 처리** | error 상태와 재시도 자동 | 전화 연결 실패 시 자동 재다이얼 |
| **똑똑한 캐싱** | 같은 데이터 재요청 시 캐시 사용 | 책을 한 번 읽으면 기억해두기 |
| **백그라운드 업데이트** | 화면 뒤에서 몰래 데이터 갱신 | 뉴스앱이 백그라운드에서 기사 업데이트 |

---

## 2. 캐싱이 어떻게 동작하나요?

### 🧠 캐싱을 쉽게 이해해보자

**캐싱은 도서관과 같습니다:**

1. **첫 방문**: 원하는 책을 찾으러 서가에 가서 가져옴 (서버 요청)
2. **재방문**: 책상에 놓아둔 책을 바로 봄 (캐시 사용)
3. **시간 경과**: 책이 오래되면 서가에서 새 책을 가져옴 (자동 업데이트)

### ⏰ 두 가지 중요한 시간 설정

#### staleTime (신선함 유지 시간)
- **의미**: "이 시간 동안은 데이터가 신선하니까 서버에 요청하지 마!"
- **예시**: 30초로 설정하면 30초 동안은 서버 요청 없이 캐시만 사용
- **비유**: 우유 유통기한 - 기한 내에는 그냥 마시기

#### gcTime (캐시 보관 시간)
- **의미**: "이 시간 동안은 캐시를 메모리에 보관해둬!"
- **예시**: 10분으로 설정하면 10분 동안 캐시를 보관
- **비유**: 냉장고 보관 - 당장 안 먹어도 버리지 않고 보관

### 📊 실제 동작 시나리오

```
⏰ 0초:   첫 로드 → 서버 요청 (2초 소요)
⏰ 15초:  다시 호출 → 캐시 사용 (0초, 즉시!)
⏰ 45초:  다시 호출 → 기존 데이터 즉시 표시 + 백그라운드에서 새 데이터 가져오기
⏰ 11분:  다시 호출 → 캐시 없음, 처음부터 로드
```

### 🎨 캐시 상태 이해하기

| 상태 | 설명 | 사용자가 보는 것 |
|------|------|------------------|
| **Fresh** | 신선한 데이터 | 즉시 표시, 서버 요청 없음 |
| **Stale** | 오래된 데이터 | 기존 데이터 표시 → 백그라운드 업데이트 |
| **Inactive** | 사용하지 않는 데이터 | 메모리에 보관 중 |
| **Garbage Collected** | 삭제된 데이터 | 메모리에서 완전 제거 |

---

## 3. 프로젝트에서 어떻게 사용되고 있나요?

### 📍 CachingPage.tsx에서 useQuery 사용법

**기본 구조:**
```tsx
useQuery({
  queryKey: ['caching-data'],     // 데이터를 구분하는 고유한 이름
  queryFn: fetchData,             // 실제 데이터를 가져오는 함수
  staleTime: 30 * 1000,           // 30초간 신선한 상태 유지
  gcTime: 10 * 60 * 1000,         // 10분간 캐시 보관
})
```

### 🔧 프로젝트 실제 코드 분석

```tsx
// CachingPage.tsx의 실제 구현
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['caching-data'],
  queryFn: async () => {
    const response = await fetch('/api/data?delay=2000&error=false');
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  },
  staleTime: 30 * 1000,          // 30초 동안 fresh 상태
  gcTime: 10 * 60 * 1000,        // 10분 동안 캐시 보관
  retry: 3,                       // 실패 시 3번 재시도
  retryDelay: 1000,              // 1초 간격으로 재시도
});

// 사용 방법
if (isLoading) return <div>데이터 로딩 중...</div>;
if (error) return <div>에러: {error.message}</div>;
return <div>데이터: {JSON.stringify(data)}</div>;
```

### 🎯 프로젝트의 캐시 테스트 방식

**1. 캐시 테스트 버튼:**
- 컴포넌트를 새로 만들어서 캐시 효과 확인
- 캐시가 있으면 → 0ms로 즉시 표시
- 캐시가 없으면 → 서버에서 데이터 가져오기

**2. 강제 새로고침 버튼:**
- 캐시를 무시하고 무조건 서버에서 새 데이터 가져오기
- refetch() 함수 사용

**3. 에러 시뮬레이션:**
- 일부러 에러를 발생시켜서 에러 처리 확인
- 자동 재시도 동작 확인

### 📊 성능 지표 측정

**프로젝트에서 보여주는 3가지 지표:**

1. **로드 시간**: 
   - 캐시 사용 시 → 0ms
   - 서버 요청 시 → 실제 소요 시간

2. **서버 요청 횟수**: 
   - 캐시 사용 시 → 증가하지 않음
   - 서버 요청 시 → 1씩 증가

3. **마지막 서버 요청 시각**: 
   - 실제로 서버에서 데이터를 가져온 시각

---

## 4. 실무에서 어떻게 활용하나요?

### 🏢 실무 활용 사례

#### 1. 사용자 정보 캐싱
```tsx
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,      // 5분
  gcTime: 30 * 60 * 1000,        // 30분
});
```

#### 2. 실시간 데이터 (주식, 뉴스)
```tsx
const { data: stock } = useQuery({
  queryKey: ['stock', symbol],
  queryFn: () => fetchStockPrice(symbol),
  staleTime: 0,                   // 항상 최신 데이터 필요
  refetchInterval: 30 * 1000,     // 30초마다 자동 갱신
});
```

#### 3. 검색 결과
```tsx
const { data: results } = useQuery({
  queryKey: ['search', query],
  queryFn: () => searchAPI(query),
  staleTime: 2 * 60 * 1000,      // 2분
  gcTime: 10 * 60 * 1000,        // 10분
  enabled: !!query,               // query가 있을 때만 실행
});
```

#### 4. 설정 정보
```tsx
const { data: settings } = useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: 60 * 60 * 1000,     // 1시간
  gcTime: 24 * 60 * 60 * 1000,   // 24시간
});
```

### 🔧 고급 기능 사용법

#### 조건부 실행
```tsx
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId,              // userId가 있을 때만 실행
});
```

#### 캐시 무효화
```tsx
const queryClient = useQueryClient();

// 특정 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['users'] });

// 여러 쿼리 무효화
queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
```

#### 프리페칭 (미리 로드)
```tsx
const queryClient = useQueryClient();

// 다음 페이지 미리 로드
queryClient.prefetchQuery({
  queryKey: ['posts', nextPage],
  queryFn: () => fetchPosts(nextPage),
  staleTime: 10 * 1000,
});
```

### 💡 실무 팁

#### 언제 캐시를 사용할까?
- ✅ **사용하기 좋은 경우**: 사용자 프로필, 설정, 카테고리 목록
- ❌ **사용하지 않는 경우**: 결제 정보, 보안 관련 데이터, 일회성 데이터

#### 캐시 시간 설정 가이드
- **자주 변경되는 데이터**: staleTime 짧게 (0~2분)
- **가끔 변경되는 데이터**: staleTime 중간 (5~30분)
- **거의 변경되지 않는 데이터**: staleTime 길게 (1시간 이상)

---

## 5. 자주 묻는 질문들

### ❓ Q1: 브라우저 새로고침하면 캐시가 사라지나요?
**A:** 네, 사라집니다! React Query는 메모리 기반 캐시라서 페이지를 새로고침하면 모든 캐시가 초기화됩니다.

### ❓ Q2: 같은 데이터를 여러 컴포넌트에서 사용하면 어떻게 되나요?
**A:** 똑똑하게 처리됩니다! 같은 queryKey를 사용하면 하나의 요청만 보내고, 모든 컴포넌트가 같은 캐시를 공유합니다.

### ❓ Q3: 캐시된 데이터가 실제로는 변경되었을 수도 있지 않나요?
**A:** 맞습니다! 그래서 staleTime이 지나면 백그라운드에서 자동으로 새 데이터를 가져와서 업데이트합니다.

### ❓ Q4: 캐시를 수동으로 삭제할 수 있나요?
**A:** 네! queryClient.invalidateQueries()나 queryClient.removeQueries()를 사용하면 됩니다.

### ❓ Q5: 에러가 발생하면 어떻게 되나요?
**A:** 자동으로 재시도합니다! retry 옵션으로 재시도 횟수를 설정할 수 있고, 지수 백오프 방식으로 점점 더 긴 간격으로 재시도합니다.

### ❓ Q6: 모바일에서도 잘 동작하나요?
**A:** 네! 네트워크가 불안정한 모바일 환경에서 특히 효과적입니다. 오프라인에서 온라인으로 돌아올 때 자동으로 데이터를 갱신합니다.

### ❓ Q7: 캐시 크기가 너무 커지면 어떻게 되나요?
**A:** gcTime이 지나면 자동으로 정리됩니다. 또한 메모리 부족 시 브라우저가 자동으로 가비지 컬렉션을 수행합니다.

---

## 🎯 핵심 요약

### useQuery의 3가지 마법
1. **자동 상태 관리**: 로딩, 에러, 성공 상태를 알아서 처리
2. **똑똑한 캐싱**: 한 번 가져온 데이터는 기억해두고 재사용
3. **백그라운드 업데이트**: 사용자 모르게 최신 데이터로 업데이트

### 필수 기술 개념
- **queryKey**: 캐시를 구분하는 고유 식별자 (배열 형태)
- **queryFn**: 실제 데이터를 가져오는 비동기 함수
- **staleTime**: 서버 요청을 하지 않는 시간 (신선함 유지)
- **gcTime**: 캐시를 메모리에 보관하는 시간 (가비지 컬렉션)

### 기본 사용 패턴
```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
  staleTime: 5 * 60 * 1000,      // 5분
  gcTime: 10 * 60 * 1000,        // 10분
  retry: 3,                       // 재시도 횟수
  enabled: !!id,                  // 조건부 실행
});
```

### 실무 활용 포인트
- 데이터 변경 빈도에 따라 캐시 시간 조절
- 같은 queryKey 사용으로 중복 요청 방지
- enabled 옵션으로 조건부 실행 제어
- invalidateQueries로 캐시 무효화 관리
- prefetchQuery로 사전 로딩 최적화

**useQuery는 단순히 데이터를 가져오는 도구가 아니라, 사용자 경험을 혁신적으로 개선하는 강력한 무기입니다!** 🚀