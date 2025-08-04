# DndPage 컴포넌트 문서

## 개요

`DndPage`는 직관적인 드래그 앤 드롭(Drag & Drop) 인터페이스를 구현한 React 컴포넌트입니다. `@dnd-kit` 라이브러리를 활용하여 접근성을 고려한 현대적인 드래그 앤 드롭 기능을 제공하며, 관리자 메뉴 우선순위 설정과 같은 실무 시나리오를 시연합니다.

## 주요 기능

### 1. 드래그 앤 드롭 정렬
- **라이브러리**: `@dnd-kit/core`, `@dnd-kit/sortable` 사용
- **정렬 전략**: 수직 리스트 정렬 (`verticalListSortingStrategy`)
- **충돌 감지**: `closestCenter` 알고리즘 적용
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

### 2. 시각적 피드백
- **드래그 상태**: 투명도 조절 및 스케일 효과
- **호버 효과**: 그림자 및 트랜지션 애니메이션
- **드래그 핸들**: 직관적인 그립 아이콘으로 드래그 영역 표시
- **우선순위 표시**: 색상별 태그로 중요도 구분

### 3. 실시간 상태 관리
- **순서 추적**: 현재 아이템 순서 실시간 표시
- **우선순위 분류**: 높음/중간/낮음별 아이템 개수 통계
- **메모이제이션**: `memo`와 `useCallback`을 통한 성능 최적화

## 기술적 구현

### Native HTML5 Drag and Drop API 구현

#### 드래그 상태 관리
```typescript
interface DragState {
  draggingId: string | null;
  dragOverId: string | null;
  initialY: number;
  dragOverPosition: 'above' | 'below' | null;
}

const [dragState, setDragState] = useState<DragState>({
  draggingId: null,
  dragOverId: null,
  initialY: 0,
  dragOverPosition: null
});
```

#### Native 드래그 핸들러
```typescript
const handleNativeDragStart = useCallback((e: React.DragEvent, id: string) => {
  setDragState(prev => ({ ...prev, draggingId: id, initialY: e.clientY }));
  e.dataTransfer.effectAllowed = 'move';
}, []);

const handleNativeDragOver = useCallback((e: React.DragEvent, id: string) => {
  if (dragState.draggingId && dragState.draggingId !== id) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? 'above' : 'below';
    
    setDragState(prev => ({ 
      ...prev, 
      dragOverId: id,
      dragOverPosition: position
    }));
  }
}, [dragState.draggingId]);
```

#### 삽입 위치 인디케이터
```typescript
{/* 삽입 위치 인디케이터 */}
{isDragOver && dragOverPosition === 'above' && (
  <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg" />
)}
{isDragOver && dragOverPosition === 'below' && (
  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg" />
)}
```

### 초기 데이터 구조
```typescript
const initialItems = [
  { 
    id: '1', 
    title: '홈페이지 배너', 
    description: '메인 화면 상단 배너 설정', 
    priority: '높음' 
  },
  // ... 총 10개 아이템
];
```

### 드래그 앤 드롭 설정
```typescript
const handleDragEnd = useCallback((event: DragEndEvent) => {
  const { active, over } = event;
  
  if (active.id !== over?.id) {
    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }
}, []);
```

### SortableItem 컴포넌트
```typescript
const SortableItem = memo(function SortableItem({ item }) {
  const {
    attributes,      // 접근성 속성
    listeners,       // 드래그 이벤트 리스너
    setNodeRef,      // DOM 참조 설정
    transform,       // 드래그 중 위치 변환
    transition,      // 애니메이션 트랜지션
    isDragging       // 드래그 상태
  } = useSortable({ id: item.id });
  
  // CSS Transform 적용
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };
  
  // 컴포넌트 렌더링...
});
```

## 핵심 최적화 기법

### 1. 성능 최적화
- **React.memo**: `SortableItem` 컴포넌트 메모이제이션으로 불필요한 리렌더링 방지
- **useCallback**: `handleDragEnd` 함수 메모이제이션으로 참조 안정성 보장
- **조건부 트랜지션**: 드래그 중에만 트랜지션 비활성화하여 부드러운 드래그 경험 제공

### 2. 접근성 향상
- **키보드 네비게이션**: Tab키로 드래그 핸들 포커스, Space키로 드래그 모드 활성화
- **스크린 리더 지원**: `@dnd-kit`의 내장 ARIA 속성 활용
- **터치 지원**: `touchAction: 'none'`으로 모바일 터치 최적화

### 3. 사용자 경험 개선
- **시각적 피드백**: 드래그 중 투명도와 스케일 변경으로 상태 표시
- **직관적 핸들**: `GripVertical` 아이콘으로 드래그 가능 영역 명확히 표시
- **실시간 업데이트**: 드롭 즉시 순서 변경 및 통계 업데이트

## 컴포넌트 구조

### 1. 페이지 헤더
- 그라데이션 아이콘과 제목
- 기능 설명 및 학습 목적 안내

### 2. 과제 분석 섹션
- **문제 상황**: 데이터 순서 조정의 필요성
- **개발 필요성**: 직관적인 UI의 중요성
- **테스트 포인트**: 드래그 앤 드롭 검증 방법

### 3. 해결 방법 섹션
- **@dnd-kit 라이브러리**: 현대적인 드래그 앤 드롭 솔루션
- **구현 원리**: DndContext, SortableContext, useSortable 훅의 역할

### 4. 구현 결과 섹션 (dnd-kit 라이브러리)
- **드래그 앤 드롭 리스트**: 실제 정렬 가능한 아이템 목록
- **현재 순서**: 실시간 순서 정보 표시
- **우선순위 분류**: 카테고리별 아이템 통계

### 5. Native 구현 섹션 (HTML5 Drag and Drop API)
- **라이브러리 없는 구현**: 순수 HTML5 API 활용한 드래그 앤 드롭
- **삽입 위치 인디케이터**: 드롭될 위치를 시각적으로 표시
- **구현 방식 비교**: 라이브러리 vs Native 접근법의 장단점 분석

## 사용된 라이브러리

### 핵심 라이브러리
- `@dnd-kit/core`: 드래그 앤 드롭 코어 기능
- `@dnd-kit/sortable`: 정렬 가능한 아이템 구현
- `@dnd-kit/utilities`: CSS 변환 유틸리티
- `lucide-react`: 아이콘 컴포넌트

### React Hooks 활용
- `useState`: 아이템 배열 상태 관리
- `useCallback`: 드래그 핸들러 메모이제이션
- `memo`: 컴포넌트 리렌더링 최적화
- `useSortable`: dnd-kit의 정렬 기능 훅

## 실무 적용 사례

### 관리자 시스템
- **메뉴 순서 관리**: 네비게이션 메뉴의 표시 순서 조정
- **콘텐츠 우선순위**: 홈페이지 섹션의 노출 순서 설정
- **상품 진열**: 쇼핑몰 상품의 진열 순서 관리
- **카테고리 정렬**: 분류 체계의 계층 구조 조정

### 사용자 인터페이스
- **대시보드 위젯**: 개인화된 위젯 배치
- **플레이리스트**: 음악/비디오 재생 순서 조정
- **태스크 관리**: 할일 목록의 우선순위 변경
- **포트폴리오**: 작품 전시 순서 커스터마이징

## 우선순위 시스템

### 색상 코딩
```typescript
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '높음': return 'bg-red-100 text-red-800';    // 빨간색 - 긴급
    case '중간': return 'bg-yellow-100 text-yellow-800'; // 노란색 - 보통
    case '낮음': return 'bg-green-100 text-green-800';   // 초록색 - 낮음
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

### 비즈니스 로직
- **높음 우선순위**: 홈페이지 배너, 상품 카테고리, 고객 지원 등 핵심 기능
- **중간 우선순위**: 인기 상품, 이벤트 공지, 추천 상품 등 마케팅 요소
- **낮음 우선순위**: 고객 후기, 브랜드 소개, 소셜 피드 등 부가 콘텐츠

## 성능 최적화 포인트

### 렌더링 최적화
```typescript
// 1. 컴포넌트 메모이제이션
const SortableItem = memo(function SortableItem({ item }) { ... });

// 2. 핸들러 메모이제이션
const handleDragEnd = useCallback((event: DragEndEvent) => { ... }, []);

// 3. 조건부 트랜지션
transition: isDragging ? 'none' : transition
```

### 드래그 성능
- **GPU 가속**: CSS Transform 사용으로 하드웨어 가속 활용
- **트랜지션 제어**: 드래그 중 트랜지션 비활성화로 끊김 현상 방지
- **터치 최적화**: `touchAction: 'none'`으로 스크롤 간섭 방지

## 접근성 지원

### 키보드 네비게이션
1. **Tab키**: 드래그 핸들 간 포커스 이동
2. **Space키**: 드래그 모드 활성화/비활성화
3. **화살표키**: 드래그 모드에서 아이템 이동
4. **Enter키**: 드래그 위치 확정

### 스크린 리더 지원
- **ARIA 속성**: `@dnd-kit`이 자동으로 적절한 ARIA 속성 추가
- **상태 안내**: 드래그 시작/종료 시 상태 변화 알림
- **위치 정보**: 현재 아이템의 위치와 이동 가능한 방향 안내

## 교육적 가치

### 학습 목표
1. **현대적인 DnD 구현**: HTML5 Drag API 대신 라이브러리 활용의 장점 이해
2. **접근성 고려사항**: 키보드 사용자와 스크린 리더 사용자를 위한 구현
3. **성능 최적화**: 메모이제이션과 조건부 렌더링을 통한 성능 향상
4. **실무 적용**: 관리자 시스템에서의 실제 활용 사례 체험

### 실습 포인트
- **라이브러리 버전**: 드래그 핸들 클릭 후 드래그하여 순서 변경
- **Native 버전**: 아이템 전체를 드래그하여 순서 변경, 삽입 위치 인디케이터 확인
- 키보드로 Tab → Space → 화살표키 순서로 접근성 테스트 (라이브러리 버전)
- 모바일에서 터치 드래그 동작 확인
- 우선순위별 아이템 분포 실시간 변화 관찰
- 두 구현 방식의 UX 차이점 비교 체험

## 기술적 장점

### @dnd-kit 라이브러리의 장점
1. **접근성**: WCAG 가이드라인 준수로 모든 사용자가 접근 가능
2. **성능**: Virtual DOM과 최적화된 렌더링으로 부드러운 애니메이션
3. **유연성**: 다양한 정렬 전략과 충돌 감지 알고리즘 지원
4. **현대적**: TypeScript 지원과 React Hooks 기반 설계

### Native HTML5 API vs 라이브러리 비교

#### 라이브러리 사용 (dnd-kit) 장점
- ✅ 접근성 기능 내장 (키보드, 스크린리더)
- ✅ 터치 디바이스 완벽 지원
- ✅ 충돌 감지 알고리즘 제공
- ✅ 애니메이션 및 전환 효과 내장
- ⚠️ 번들 크기 증가 (약 30KB)
- ⚠️ 추가 의존성 관리 필요

#### Native API 직접 구현 장점
- ✅ 추가 의존성 없음
- ✅ 번들 크기 최소화
- ✅ 완전한 커스터마이징 가능
- ⚠️ 접근성 기능 직접 구현 필요
- ⚠️ 터치 디바이스 별도 처리 필요
- ⚠️ 크로스 브라우저 이슈 처리 필요

### 선택 가이드

#### 라이브러리 사용이 적합한 경우
- 복잡한 드래그 앤 드롭 인터랙션
- 접근성이 중요한 프로젝트
- 빠른 개발 속도가 필요한 경우
- 터치 디바이스 지원이 필수인 경우

#### Native 구현이 적합한 경우
- 간단한 드래그 앤 드롭 기능
- 번들 크기 최적화가 중요한 경우
- 의존성을 최소화하고 싶은 경우
- 완전한 커스터마이징이 필요한 경우

## Native 구현의 핵심 기술

### HTML5 Drag and Drop 이벤트
```typescript
// 드래그 시작
onDragStart={(e) => onDragStart(e, item.id)}

// 드래그 중 (다른 요소 위로)
onDragOver={(e) => {
  e.preventDefault(); // 드롭 허용
  onDragOver(e, item.id);
}}

// 드롭 완료
onDrop={(e) => {
  e.preventDefault();
  onDrop(e, item.id);
}}
```

### 위치 감지 로직
```typescript
const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
const midpoint = rect.top + rect.height / 2;
const position = e.clientY < midpoint ? 'above' : 'below';
```

### 커서 스타일 최적화
```css
cursor: isDragging ? 'grabbing' : 'grab'
```

이 컴포넌트는 현대 웹 애플리케이션에서 필수적인 드래그 앤 드롭 기능을 두 가지 접근법(라이브러리 vs Native)으로 구현하여, 각각의 장단점을 실습을 통해 체험할 수 있는 완성도 높은 교육 예제입니다.