# @dnd-kit 드래그 앤 드롭 쉽게 이해하기

## 목차
1. [dnd-kit이 뭔가요?](#1-dnd-kit이-뭔가요)
2. [어떻게 동작하나요?](#2-어떻게-동작하나요)
3. [프로젝트에서 어떻게 사용되고 있나요?](#3-프로젝트에서-어떻게-사용되고-있나요)
4. [실무에서 어떻게 활용하나요?](#4-실무에서-어떻게-활용하나요)
5. [자주 묻는 질문들](#5-자주-묻는-질문들)

---

## 1. dnd-kit이 뭔가요?

### 🤔 dnd-kit을 한 문장으로 설명한다면?

**"마우스나 터치로 요소를 끌어다 놓을 수 있게 해주는 현대적이고 접근성이 뛰어난 도구"**

### 📱 실생활에서 보는 드래그 앤 드롭

| 예시 | 설명 |
|------|------|
| **스마트폰 앱 정렬** | 홈화면에서 앱 아이콘을 길게 눌러서 위치 바꾸기 |
| **트렐로/노션 칸반** | 할 일 카드를 다른 컬럼으로 옮기기 |
| **유튜브 재생목록** | 동영상 순서를 드래그로 바꾸기 |
| **파일 탐색기** | 폴더 간 파일 이동하기 |

### 🎯 왜 dnd-kit을 선택해야 할까?

#### 다른 드래그 라이브러리와의 차이점

| 구분 | react-beautiful-dnd | react-dnd | **@dnd-kit** |
|------|---------------------|-----------|--------------|
| **학습 난이도** | 중간 | 어려움 | **쉬움** |
| **모바일 지원** | 제한적 | 제한적 | **완벽** |
| **접근성** | 기본적 | 제한적 | **뛰어남** |
| **성능** | 보통 | 보통 | **우수** |
| **유지보수** | 중단됨 | 활발함 | **매우 활발함** |

#### dnd-kit의 특별한 점

- 🎯 **접근성 우선**: 키보드, 스크린 리더 완벽 지원
- 📱 **터치 친화적**: 모바일에서도 자연스러운 드래그
- ⚡ **고성능**: 수천 개 아이템도 부드럽게 처리
- 🔧 **유연함**: 간단한 목록부터 복잡한 칸반까지
- 🛡️ **안정성**: TypeScript 완전 지원, 활발한 업데이트

---

## 2. 어떻게 동작하나요?

### 🧩 dnd-kit의 핵심 구성 요소

**3가지 핵심 개념을 이해하면 됩니다:**

#### 1. DndContext (드래그 영역)
- **역할**: "이 안에서 드래그가 가능해!"라고 선언하는 경계선
- **비유**: 놀이터 울타리 - 울타리 안에서만 놀 수 있음

```jsx
// 가장 바깥쪽에 드래그 영역 설정
<DndContext onDragEnd={handleDragEnd}>
  {/* 이 안에서만 드래그 가능 */}
</DndContext>
```

#### 2. SortableContext (정렬 영역)  
- **역할**: "이 아이템들은 순서를 바꿀 수 있어!"라고 선언
- **비유**: 줄 서기 - 줄 안에서 순서 바꾸기 가능

```jsx
// items 배열의 순서를 바꿀 수 있게 설정
<SortableContext items={items}>
  {items.map(item => <DraggableItem key={item.id} item={item} />)}
</SortableContext>
```

#### 3. useSortable (개별 아이템)
- **역할**: "나는 드래그할 수 있어!"라고 개별 요소가 선언
- **비유**: 번호표 - 각자 고유한 위치를 가짐

```jsx
function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: item.id
  });
  
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform) }}>
      <div {...attributes} {...listeners}>드래그 핸들</div>
      <div>{item.title}</div>
    </div>
  );
}
```

### 🔄 5분만에 만드는 드래그 리스트

**완전한 구현 예시:**

```jsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

// 1. 드래그 가능한 아이템 컴포넌트
function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div ref={setNodeRef} style={style} className="p-4 bg-white border rounded-lg">
      <div {...attributes} {...listeners} className="cursor-grab">
        ⋮⋮ {children}
      </div>
    </div>
  );
}

// 2. 메인 컴포넌트
function MyDragList() {
  const [items, setItems] = useState(['아이템 1', '아이템 2', '아이템 3']);
  
  // 3. 드래그 완료 시 처리
  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map(item => (
            <DraggableItem key={item} id={item}>
              {item}
            </DraggableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

### 🔄 드래그 앤 드롭 동작 과정

```
1. 👆 사용자가 ⋮⋮ 핸들을 클릭/터치
2. 🎯 useSortable이 드래그 시작을 감지
3. 👻 isDragging = true, 아이템이 반투명해짐
4. 📍 다른 아이템 위에 올려놓으면 자리 양보
5. 🎯 놓는 순간 handleDragEnd 함수 실행
6. ✨ arrayMove로 배열 순서 변경 → 화면 업데이트
```

### 🎨 시각적 피드백의 단계

| 단계 | 사용자가 보는 것 | 실제 일어나는 일 |
|------|------------------|------------------|
| **평상시** | 일반적인 목록 | 드래그 대기 중 |
| **드래그 시작** | 요소가 살짝 들어 올려짐 | isDragging = true |
| **드래그 중** | 반투명해지고 다른 요소들이 자리 양보 | 위치 계산 중 |
| **드롭 위치** | 드롭할 위치에 공간이 생김 | 새 위치 미리보기 |
| **드롭 완료** | 부드럽게 새 위치에 정착 | 데이터 실제 변경 |

---

## 3. 프로젝트에서 어떻게 사용되고 있나요?

### 📍 DndPage.tsx 구현 해부하기

#### 🏗️ 전체 구조

**프로젝트의 드래그 앤 드롭은 3단계로 구성됩니다:**

```jsx
// 1. 데이터 준비
const [items, setItems] = useState(initialItems);

// 2. 드래그 완료 핸들러
const handleDragEnd = useCallback((event) => {
  const { active, over } = event;
  if (active.id !== over?.id) {
    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }
}, []);

// 3. UI 렌더링
return (
  <DndContext onDragEnd={handleDragEnd}>
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {items.map((item) => (
        <SortableItem key={item.id} item={item} />
      ))}
    </SortableContext>
  </DndContext>
);
```

#### 📊 실제 데이터 구조

```javascript
const initialItems = [
  { id: '1', title: '홈페이지 배너', description: '메인 화면 상단 배너 설정', priority: '높음' },
  { id: '2', title: '상품 카테고리', description: '상품 분류 메뉴 순서', priority: '높음' },
  { id: '3', title: '인기 상품', description: '인기 상품 노출 순서', priority: '중간' },
  // ... 총 10개
];
```

#### 🎨 SortableItem 컴포넌트 (핵심 부분)

```jsx
const SortableItem = memo(function SortableItem({ item }) {
  const {
    attributes,    // 접근성 속성들
    listeners,     // 드래그 이벤트 리스너들
    setNodeRef,    // DOM 참조 설정
    transform,     // 드래그 시 위치 변환
    isDragging     // 현재 드래그 중인지 여부
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'all 200ms', // 드래그 중에는 애니메이션 비활성화
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white border rounded-lg ${
        isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }} // 모바일에서 스크롤 방지
      >
        ⋮⋮
      </div>
      
      {/* 아이템 내용 */}
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <span className={`priority-${item.priority}`}>{item.priority}</span>
      </div>
    </div>
  );
});
```

#### 🎯 핵심 동작 원리

**1. 드래그 완료 시 처리 (handleDragEnd):**
- **입력**: 어떤 아이템(active)을 어디로(over) 옮겼는지
- **처리**: 배열에서 아이템의 위치를 실제로 변경
- **출력**: 새로운 순서로 정렬된 목록

**2. arrayMove 함수의 마법:**
- 기존 배열을 건드리지 않고 새 배열 생성
- 성능을 위해 최적화된 알고리즘 사용
- React의 불변성 원칙을 지킴

#### 🎨 시각적 효과들

**드래그 핸들 (GripVertical 아이콘):**
- **평상시**: 회색 아이콘, 마우스 올리면 grab 커서
- **드래그 중**: grabbing 커서, 터치 스크롤 비활성화

**드래그 중인 아이템:**
- **투명도**: 50%로 반투명 처리
- **크기**: 105%로 살짝 확대
- **그림자**: 강한 그림자로 떠 있는 느낌

**다른 아이템들:**
- **자리 양보**: 부드러운 애니메이션으로 위치 조정
- **트랜지션**: 200ms 부드러운 이동

### 🔧 프로젝트만의 특별한 기능들

#### 1. 성능 최적화
- **memo**: 불필요한 리렌더링 방지
- **useCallback**: 함수 재생성 방지
- **조건부 트랜지션**: 드래그 중에는 애니메이션 비활성화

#### 2. 접근성 강화
- **키보드 지원**: Tab → Space → 화살표 → Space
- **스크린 리더**: ARIA 속성 자동 적용
- **포커스 관리**: 드래그 후 포커스 복원

#### 3. 모바일 최적화
- **터치 감지**: touchAction: 'none'으로 스크롤 방지
- **적절한 크기**: 터치하기 쉬운 드래그 핸들 크기
- **민감도 조정**: 8px 이상 이동해야 드래그 시작

---

## 4. 실무에서 어떻게 활용하나요?

### 🏢 대표적인 활용 사례

#### 1. 간단한 할 일 목록 만들기

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: '1', text: '아침 운동하기', done: false },
    { id: '2', text: '프로젝트 회의', done: false },
    { id: '3', text: '장보기', done: true }
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTodos((todos) => {
        const oldIndex = todos.findIndex(todo => todo.id === active.id);
        const newIndex = todos.findIndex(todo => todo.id === over.id);
        return arrayMove(todos, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map(todo => todo.id)}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

#### 2. 칸반 보드 기본 구조

```jsx
function KanbanBoard() {
  const [columns, setColumns] = useState({
    'todo': { title: '할 일', items: ['task-1', 'task-2'] },
    'doing': { title: '진행 중', items: ['task-3'] },
    'done': { title: '완료', items: ['task-4'] }
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // 다른 컬럼으로 이동하는 로직
    // (복잡하므로 여기서는 개념만 설명)
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-100 p-4 rounded-lg min-w-64">
            <h3>{column.title}</h3>
            <SortableContext items={column.items}>
              {column.items.map(itemId => (
                <TaskCard key={itemId} id={itemId} />
              ))}
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
```

#### 3. 파일 업로드 + 순서 변경

```jsx
function FileUploadWithSort() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (uploadedFiles) => {
    const newFiles = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragEnd = (event) => {
    // 파일 순서 변경 로직
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        onChange={e => handleFileUpload(Array.from(e.target.files))} 
      />
      
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={files.map(f => f.id)}>
          {files.map(file => (
            <FileItem key={file.id} file={file} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
```

### 💡 실무 적용 팁

#### 언제 드래그 앤 드롭을 사용할까?

**✅ 사용하기 좋은 경우:**
- 순서가 중요한 목록 (우선순위, 랭킹)
- 상태 변경이 필요한 아이템 (칸반 보드)
- 사용자 맞춤 설정 (개인화 대시보드)
- 직관적인 조작이 중요한 경우

**❌ 사용하지 않는 경우:**
- 단순한 정적 목록
- 복잡한 폼 입력
- 중요한 데이터 변경 (실수 위험)
- 모바일에서 스크롤이 중요한 긴 목록

#### 성능 고려사항

| 아이템 수 | 권장 방법 | 성능 |
|-----------|-----------|------|
| **< 50개** | 기본 구현 | 매우 좋음 |
| **50-200개** | memo + useCallback | 좋음 |
| **200-1000개** | 가상화 + 최적화 | 보통 |
| **> 1000개** | 페이지네이션 권장 | 제한적 |

---

## 5. 자주 묻는 질문들

### ❓ Q1: 모바일에서도 잘 동작하나요?
**A:** 네! dnd-kit은 모바일을 위해 특별히 설계되었습니다. 터치 드래그가 매우 자연스럽고, 스크롤과 드래그를 잘 구분합니다.

### ❓ Q2: 드래그 중에 페이지가 스크롤되면 어떻게 되나요?
**A:** 자동으로 처리됩니다! 드래그하는 동안 페이지 경계에 도달하면 자동으로 스크롤하면서 드래그를 계속할 수 있습니다.

### ❓ Q3: 키보드만으로도 드래그할 수 있나요?
**A:** 네! Tab키로 이동 → Space로 드래그 모드 → 화살표키로 위치 이동 → Space로 드롭 순서로 가능합니다.

### ❓ Q4: 여러 개를 한 번에 드래그할 수 있나요?
**A:** 기본적으로는 하나씩만 가능하지만, 추가 로직을 구현하면 다중 선택 드래그도 가능합니다.

### ❓ Q5: 드래그 중에 실수로 놓치면 어떻게 되나요?
**A:** 원래 위치로 부드럽게 돌아갑니다. 데이터는 변경되지 않아서 안전합니다.

### ❓ Q6: 네트워크가 느린 환경에서도 부드럽게 동작하나요?
**A:** 네! 드래그 앤 드롭은 클라이언트 사이드에서만 동작하므로 네트워크 속도와 무관하게 부드럽습니다.

### ❓ Q7: 드래그 가능한 영역을 제한할 수 있나요?
**A:** 네! modifiers를 사용해서 세로만, 가로만, 또는 특정 영역 내에서만 드래그하도록 제한할 수 있습니다.

### ❓ Q8: 대용량 데이터에서도 성능이 괜찮나요?
**A:** 수백 개까지는 문제없고, 그 이상은 가상화나 페이지네이션과 함께 사용하는 것을 권장합니다.

---

## 🎯 핵심 요약

### dnd-kit의 3가지 마법

1. **쉬운 구현**: 복잡한 드래그 로직을 몇 줄로 해결
2. **뛰어난 사용자 경험**: 부드러운 애니메이션과 직관적인 피드백
3. **완벽한 접근성**: 모든 사용자가 키보드나 스크린 리더로도 사용 가능

### 구현할 때 기억할 것

- **DndContext**: 드래그 영역의 경계선
- **SortableContext**: 정렬 가능한 아이템들의 그룹
- **useSortable**: 개별 아이템을 드래그 가능하게 만드는 훅
- **arrayMove**: 배열 순서를 안전하게 변경하는 유틸리티

### 실무 적용 포인트

- 사용자에게 직관적인 순서 조정 인터페이스 제공
- 관리자 패널에서 우선순위 설정 기능
- 칸반 보드 같은 작업 관리 시스템
- 개인화 대시보드나 설정 페이지

**dnd-kit은 단순히 드래그 앤 드롭 기능을 추가하는 것이 아니라, 사용자가 직접 인터페이스를 조작하고 맞춤화할 수 있는 권한을 주는 강력한 도구입니다!** 🚀