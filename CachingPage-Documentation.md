# CachingPage 컴포넌트 문서

## 개요

`CachingPage`는 `@tanstack/react-query`를 활용한 데이터 캐싱과 스켈레톤 UI를 구현한 React 컴포넌트입니다. 서버 요청 최적화, 캐시 전략, 로딩 상태 관리, 에러 처리 등 현대적인 웹 애플리케이션의 핵심 기능들을 시연하고 학습할 수 있는 교육용 페이지입니다.

## 주요 기능

### 1. React Query 기반 데이터 캐싱
- **라이브러리**: `@tanstack/react-query` 사용
- **캐시 전략**: staleTime (30초), gcTime (10분) 설정
- **자동 재시도**: 에러 시 최대 2회 재시도
- **백그라운드 업데이트**: 캐시된 데이터 표시 후 백그라운드에서 새 데이터 페칭

### 2. 스켈레톤 UI 구현
- **로딩 상태 시각화**: 실제 콘텐츠 구조를 모방한 스켈레톤 UI
- **UX 개선**: 빈 화면 대신 예상 레이아웃 표시로 체감 대기 시간 단축
- **레이아웃 시프트 방지**: 콘텐츠 로드 시 레이아웃 변경 최소화

### 3. 성능 모니터링
- **실시간 메트릭**: 로드 시간, 서버 요청 횟수, 마지막 업데이트 시간 추적
- **캐시 히트 감지**: 캐시에서 로드되었는지 서버에서 로드되었는지 구분
- **시각적 피드백**: 데이터 소스별 색상 코딩 및 상태 표시

### 4. 다양한 테스트 기능
- **캐시 테스트**: 컴포넌트 재마운트를 통한 캐시 효과 검증
- **에러 시뮬레이션**: 네트워크 오류 상황 테스트
- **강제 새로고침**: 캐시 무시하고 서버에서 최신 데이터 페칭
- **스켈레톤 미리보기**: 로딩 UI 효과 미리 확인

## 기술적 구현

### React Query 설정
```typescript
const { data, isLoading, isError, error, refetch, isFetching, isRefetching, dataUpdatedAt } = useQuery<DataItem[], Error>({
  queryKey: ['caching-data', simulateError],
  queryFn: async () => {
    const startTime = performance.now();
    const result = await (simulateError ? fetchDataWithError() : fetchData());
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    setLoadTimeMs(loadTime);
    setFetchCount(prev => prev + 1);
    setIsCacheHit(false);
    
    return result;
  },
  staleTime: 30 * 1000,        // 30초간 데이터를 신선하다고 간주
  gcTime: 10 * 60 * 1000,      // 10분간 캐시 유지
  retry: simulateError ? 2 : 1, // 에러 시 재시도 횟수
  refetchOnWindowFocus: false,  // 창 포커스 시 자동 재요청 비활성화
});
```

### 캐시 히트 감지 로직
```typescript
// 컴포넌트 마운트 시 캐시에서 데이터 로드 감지
useEffect(() => {
  if (data && !isLoading && !isFetching) {
    // 캐시에서 로드된 경우 (서버 요청 없이 즉시 데이터 사용 가능)
    if (!loadTimeMs) {
      setLoadTimeMs(0); // 캐시 히트는 0ms로 표시
      setIsCacheHit(true);
      // 캐시 히트 시에는 fetchCount를 증가시키지 않음
    }
  }
}, [data, isLoading, isFetching, loadTimeMs]);
```

### 컴포넌트 재마운트 패턴
```typescript
export default function CachingPage() {
  const [componentKey, setComponentKey] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);

  const handleCacheTest = () => {
    setComponentKey(prev => prev + 1); // key 변경으로 컴포넌트 재마운트
  };

  return (
    <CachingContent 
      key={componentKey} 
      onCacheTest={handleCacheTest}
      fetchCount={fetchCount}
      setFetchCount={setFetchCount}
    />
  );
}
```

## React Query 캐싱 전략

### staleTime vs gcTime 개념

#### staleTime (30초) - "서버 요청 안함 시간"
- **목적**: 데이터를 "신선한(fresh)" 상태로 간주하여 서버 요청을 하지 않는 시간
- **동작**: 이 시간 동안은 서버 요청 없이 캐시에서 즉시 반환
- **효과**: 불필요한 네트워크 요청 방지, 즉각적인 데이터 표시

#### gcTime (10분) - "즉시 표시용 캐시 보관"
- **목적**: stale 상태가 되어도 "즉시 표시용"으로 캐시를 보관하는 시간
- **동작**: 페이지 재방문 시 이 캐시를 먼저 보여주고, 동시에 백그라운드에서 새 데이터 페칭
- **효과**: 빈 화면 없이 즉시 콘텐츠 표시, 사용자 경험 향상

### 실제 캐싱 시나리오

```
🕐 실제 동작 시나리오:
- 0초: 데이터 첫 로드 (서버 요청) ✅
- 15초: 캐시 테스트 → 캐시 사용 (staleTime 이내) ⚡
- 45초: 캐시 테스트 → 기존 데이터 즉시 표시 + 백그라운드 업데이트 🔄
- 11분: 페이지 방문 → 처음부터 로드 (gcTime 만료, 캐시 삭제) 🗑️
```

### gcTime의 진짜 가치
```
상황: 1분 전 방문 → Home 이동 → 다시 CachingPage 방문

gcTime 있을 때: 즉시 기존 데이터 표시 → 백그라운드 업데이트
gcTime 없을 때: 빈 화면 → 로딩 → 데이터 표시

⭐ staleTime 만료 후에도 캐시는 "즉시 표시용"으로 활용됩니다!
```

## 컴포넌트 구조

### 1. 페이지 헤더
- 그라데이션 아이콘과 제목
- 캐싱과 스켈레톤 UI의 교육 목적 설명

### 2. 과제 분석 섹션
- **문제 상황**: 느린 API 응답과 빈 화면 문제
- **개발 필요성**: 캐싱과 스켈레톤 UI의 UX 개선 효과
- **테스트 포인트**: 성능 비교 및 사용자 경험 검증

### 3. 해결 방법 섹션
- **React Query**: 자동 캐싱과 상태 관리 솔루션
- **조건부 렌더링**: 로딩/에러/성공 상태별 UI 최적화

### 4. 구현 결과 섹션
- **캐시 상태 표시**: 실시간 캐시 히트/미스 상태
- **React Query 개념 설명**: 접을 수 있는 상세 설명
- **테스트 컨트롤**: 4가지 테스트 버튼
- **성능 메트릭**: 로드 시간, 서버 요청 횟수, 마지막 업데이트 시간
- **성능 비교**: 캐싱 전후 효과 비교
- **동적 콘텐츠**: 로딩/에러/성공 상태별 UI

## 성능 최적화 기법

### 1. 캐시 전략 최적화
```typescript
// 최적화된 캐시 설정
staleTime: 30 * 1000,        // 30초간 fresh 상태 유지
gcTime: 10 * 60 * 1000,      // 10분간 가비지 컬렉션 연기
refetchOnWindowFocus: false, // 불필요한 자동 재요청 방지
```

### 2. 성능 측정
```typescript
// 정확한 로드 시간 측정
const startTime = performance.now();
const result = await fetchData();
const endTime = performance.now();
const loadTime = endTime - startTime;
```

### 3. 조건부 렌더링 최적화
```typescript
// 상태별 최적화된 렌더링
{(isLoading || showSkeletonPreview) && <SkeletonCardList />}
{isError && <ErrorUI />}
{data && !showSkeletonPreview && <DataGrid />}
```

## 사용된 라이브러리

### 핵심 라이브러리
- `@tanstack/react-query`: 데이터 페칭, 캐싱, 동기화
- `../api/mockAPI`: Mock API 서버 시뮬레이션
- `../components/SkeletonCard`: 커스텀 스켈레톤 UI 컴포넌트
- `lucide-react`: 아이콘 컴포넌트

### React Hooks 활용
- `useState`: 다양한 UI 상태 관리
- `useEffect`: 캐시 히트 감지 및 사이드 이펙트 처리
- `useQuery`: React Query의 핵심 데이터 페칭 훅
- `useQueryClient`: 캐시 무효화 및 쿼리 조작

## 실무 적용 사례

### API 데이터 캐싱
- **상품 목록**: 자주 조회되는 상품 데이터 캐싱
- **사용자 프로필**: 세션 동안 변경 가능성이 낮은 사용자 정보
- **설정 데이터**: 시스템 설정이나 메뉴 구조 정보
- **통계 데이터**: 실시간성이 중요하지 않은 대시보드 데이터

### 스켈레톤 UI 적용
- **소셜 미디어 피드**: 카드 형태의 콘텐츠 로딩
- **상품 그리드**: 이미지와 텍스트가 포함된 상품 목록
- **프로필 페이지**: 아바타, 이름, 설명 등의 사용자 정보
- **댓글 시스템**: 리스트 형태의 댓글 로딩

## 테스트 기능 상세

### 1. 캐시 테스트 버튼
- **동작**: 컴포넌트 재마운트 (`key` prop 변경)
- **목적**: React Query 캐시 효과 체험
- **결과**: 서버 요청 없이 즉시 데이터 표시 (0ms 로드)

### 2. 스켈레톤 UI 버튼
- **동작**: 3초간 스켈레톤 UI 강제 표시
- **목적**: 로딩 상태 UI 미리보기
- **결과**: 실제 콘텐츠 구조를 모방한 애니메이션 표시

### 3. 강제 새로고림 버튼
- **동작**: `refetch()` 함수 호출
- **목적**: 캐시 무시하고 서버에서 최신 데이터 페칭
- **결과**: 항상 서버 요청 발생, 실제 API 응답 시간 측정

### 4. 에러 시뮬레이션 버튼
- **동작**: Mock API에서 강제로 에러 발생
- **목적**: 네트워크 오류 상황 테스트
- **결과**: 에러 UI 표시, 재시도 버튼 제공

## 성능 메트릭 분석

### 로드 시간 측정
- **캐시 히트**: 0ms (메모리에서 즉시 로드)
- **초기 로드**: 1,000-2,000ms (Mock API 지연 시뮬레이션)
- **재페칭**: 서버 응답 시간에 따라 가변

### 서버 요청 횟수
- **캐시 히트 시**: 요청 횟수 증가 없음
- **서버 요청 시**: fetchCount 1씩 증가
- **에러 재시도**: 설정된 재시도 횟수만큼 추가 요청

### 네트워크 사용량 비교
```
캐싱 없이 (매번 서버 요청):
- 평균 로딩 시간: 1,000-2,000ms
- 네트워크 사용량: 매 요청마다 ~50KB
- 사용자 경험: 반복적인 로딩 대기
- 서버 부하: 동일 데이터 반복 요청

React Query 캐싱 적용:
- 캐시 히트 시: 즉시 표시 (메모리에서 로드)
- 네트워크 사용량: 캐시 유효 시 0KB
- 사용자 경험: 즉각적인 데이터 표시
- 서버 부하: 필요 시에만 요청
```

## 스켈레톤 UI 설계 원칙

### UX 개선 효과
```
❌ 스켈레톤 UI 없이:
- 빈 화면으로 불안감 조성
- 로딩 시간이 더 길게 느껴짐
- 콘텐츠 구조 예측 불가

✅ 스켈레톤 UI 적용:
- 로딩 중임을 명확히 표시
- 체감 대기 시간 단축
- 레이아웃 시프트 방지
```

### 설계 고려사항
1. **실제 콘텐츠 구조 반영**: 최종 UI와 유사한 레이아웃
2. **적절한 애니메이션**: 시각적 피드백 제공
3. **성능 최적화**: 가벼운 CSS 애니메이션 사용
4. **접근성 고려**: 스크린 리더 사용자를 위한 적절한 ARIA 레이블

## 에러 처리 전략

### 사용자 친화적 에러 UI
```typescript
{isError && (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">데이터 로딩 실패</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {error?.message || '알 수 없는 오류가 발생했습니다.'}
    </p>
    <button
      onClick={() => refetch()}
      className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
    >
      <RefreshCw className="w-5 h-5" />
      <span>다시 시도</span>
    </button>
  </div>
)}
```

### 자동 재시도 설정
- **일반 상황**: 1회 재시도
- **에러 시뮬레이션**: 2회 재시도
- **지수 백오프**: React Query 기본 재시도 전략 사용

## 교육적 가치

### 학습 목표
1. **현대적 캐싱 전략**: React Query를 통한 효율적인 데이터 관리
2. **성능 최적화**: 캐시 활용으로 네트워크 요청 최소화
3. **사용자 경험 개선**: 스켈레톤 UI와 로딩 상태 최적화
4. **에러 처리**: 네트워크 오류 상황에 대한 graceful한 대응

### 실습 포인트
- 캐시 테스트 버튼으로 즉시 로드 체험
- 성능 메트릭으로 캐싱 효과 수치 확인
- 스켈레톤 UI로 로딩 경험 비교
- 에러 시뮬레이션으로 예외 상황 테스트
- 개발자 도구 Network 탭에서 실제 요청 확인

## 기술적 장점

### React Query의 장점
1. **자동 캐싱**: 별도 구현 없이 intelligent한 캐싱 전략
2. **백그라운드 업데이트**: 사용자 경험을 해치지 않는 데이터 동기화
3. **중복 요청 제거**: 동시 요청 시 자동으로 중복 제거
4. **오프라인 지원**: 네트워크 복구 시 자동 재시도
5. **개발자 도구**: React Query Devtools로 캐시 상태 시각화

### Mock API의 교육적 효과
- **실제 네트워크 지연 시뮬레이션**: setTimeout으로 현실적인 로딩 시간
- **에러 상황 재현**: 100% 실패율로 에러 처리 테스트
- **다양한 데이터**: 카테고리, 상태, 조회수 등 실무와 유사한 데이터 구조

이 컴포넌트는 현대 웹 애플리케이션의 필수 요소인 데이터 캐싱과 로딩 UI 최적화를 종합적으로 학습할 수 있는 완성도 높은 교육 자료입니다.