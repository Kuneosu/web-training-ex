import { useState, useCallback, memo } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MousePointer, AlertCircle, Lightbulb, Code2, GripVertical, Users, Settings, TestTube } from 'lucide-react';

// 초기 아이템 데이터
const initialItems = [
  { id: '1', title: '홈페이지 배너', description: '메인 화면 상단 배너 설정', priority: '높음' },
  { id: '2', title: '상품 카테고리', description: '상품 분류 메뉴 순서', priority: '높음' },
  { id: '3', title: '인기 상품', description: '인기 상품 노출 순서', priority: '중간' },
  { id: '4', title: '이벤트 공지', description: '진행중인 이벤트 알림', priority: '중간' },
  { id: '5', title: '고객 후기', description: '상품 리뷰 및 평점', priority: '낮음' },
  { id: '6', title: '추천 상품', description: '개인화 추천 상품 목록', priority: '중간' },
  { id: '7', title: '브랜드 소개', description: '브랜드 스토리 및 소개', priority: '낮음' },
  { id: '8', title: '고객 지원', description: '문의사항 및 FAQ', priority: '높음' },
  { id: '9', title: '소셜 피드', description: 'SNS 연동 콘텐츠', priority: '낮음' },
  { id: '10', title: '뉴스레터', description: '이메일 구독 및 소식', priority: '중간' }
];

// 정렬 가능한 아이템 컴포넌트 (메모이제이션 적용)
const SortableItem = memo(function SortableItem({ item }: { item: typeof initialItems[0] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // 드래그 중에는 트랜지션 비활성화
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '높음': return 'bg-red-100 text-red-800';
      case '중간': return 'bg-yellow-100 text-yellow-800';
      case '낮음': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'transition-all duration-200'}`}
    >
      <div className="flex items-center space-x-4">
        {/* 드래그 핸들 */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 -m-2 hover:bg-gray-100 rounded-md transition-colors"
          style={{ touchAction: 'none' }}
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* 콘텐츠 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      </div>
    </div>
  );
});

// Native DnD 구현을 위한 타입 정의
interface DragState {
  draggingId: string | null;
  dragOverId: string | null;
  initialY: number;
  dragOverPosition: 'above' | 'below' | null;
}

// Native DnD 아이템 컴포넌트
const NativeDraggableItem = memo(function NativeDraggableItem({ 
  item, 
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDragOver,
  dragOverPosition
}: { 
  item: typeof initialItems[0];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
  dragOverPosition: 'above' | 'below' | null;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '높음': return 'bg-red-100 text-red-800';
      case '중간': return 'bg-yellow-100 text-yellow-800';
      case '낮음': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, item.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, item.id);
      }}
      className={`
        bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md
        transition-all duration-200 relative
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 삽입 위치 인디케이터 */}
      {isDragOver && dragOverPosition === 'above' && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg" />
      )}
      {isDragOver && dragOverPosition === 'below' && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg" />
      )}
      
      <div className="flex items-center space-x-4">
        {/* 드래그 핸들 */}
        <div 
          className="p-2 -m-2 hover:bg-gray-100 rounded-md transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* 콘텐츠 */}
        <div className="flex-1 select-none">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      </div>
    </div>
  );
});

export default function DndPage() {
  const [items, setItems] = useState(initialItems);
  const [nativeItems, setNativeItems] = useState(initialItems);
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    dragOverId: null,
    initialY: 0,
    dragOverPosition: null
  });

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

  // Native DnD 핸들러들
  const handleNativeDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragState(prev => ({ ...prev, draggingId: id, initialY: e.clientY }));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleNativeDragEnd = useCallback(() => {
    setDragState({ draggingId: null, dragOverId: null, initialY: 0, dragOverPosition: null });
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

  const handleNativeDrop = useCallback((_e: React.DragEvent, dropId: string) => {
    const { draggingId } = dragState;
    
    if (draggingId && draggingId !== dropId) {
      setNativeItems((items) => {
        const dragIndex = items.findIndex(item => item.id === draggingId);
        const dropIndex = items.findIndex(item => item.id === dropId);
        
        if (dragIndex !== -1 && dropIndex !== -1) {
          const newItems = [...items];
          const [draggedItem] = newItems.splice(dragIndex, 1);
          newItems.splice(dropIndex, 0, draggedItem);
          return newItems;
        }
        
        return items;
      });
    }
    
    setDragState({ draggingId: null, dragOverId: null, initialY: 0, dragOverPosition: null });
  }, [dragState]);

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg">
            <MousePointer className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4 leading-tight pb-2">
            Drag & Drop Interface
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            직관적인 드래그 앤 드롭으로 사용자 맞춤형 인터페이스를 구현해보세요
          </p>
        </div>

        {/* 1. 과제 분석 섹션 */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-red-500 rounded-xl mr-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. 과제 분석</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-bold text-red-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  문제 상황
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  데이터 테이블이나 리스트형 UI에서 사용자가 직접 순서를 조정해야 하는 요구사항이 자주 발생합니다. 
                  예를 들어, 관리자 화면에서 노출 우선순위를 변경하거나 고객 맞춤형 메뉴 구성을 할 때입니다. 
                  이를 구현하지 않으면 사용자가 직관적으로 원하는 순서를 설정하기 어렵고, UX가 떨어집니다.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  개발 필요성
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Drag & Drop 기능은 UI의 직관성을 높이고, 비즈니스 요구사항을 빠르게 반영할 수 있는 핵심 기능입니다. 
                  사용자가 마우스나 터치로 간단히 순서를 변경할 수 있어 관리 효율성이 크게 향상됩니다.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  테스트 포인트
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  아이템을 드래그해 순서를 변경할 때 데이터가 정상적으로 반영되는지 확인합니다. 
                  모바일 터치 환경에서도 Drag & Drop이 잘 동작하는지 테스트합니다. 
                  드래그 중 시각적 피드백과 드롭 후 상태 업데이트를 검증합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 해결 방법 섹션 */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-yellow-500 rounded-xl mr-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. 해결 방법: dnd-kit 라이브러리 활용</h2>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-4 text-lg">핵심 해결책: @dnd-kit/core 라이브러리</h3>
              <p className="text-yellow-700 leading-relaxed mb-4">
                `@dnd-kit/core`는 접근성을 고려한 현대적인 드래그 앤 드롭 라이브러리입니다. 
                키보드 네비게이션, 스크린 리더 지원, 터치 디바이스 호환성을 모두 갖춘 완전한 솔루션을 제공합니다.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                dnd-kit 구현 원리
              </h3>
              <div className="text-blue-700 leading-relaxed space-y-3">
                <p>
                  <strong>DndContext</strong>로 전체 드래그 앤 드롭 영역을 감싸고, 다음과 같이 동작합니다:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>DndContext 설정:</strong> 드래그 영역 전체를 관리하고 충돌 감지 알고리즘 적용</li>
                  <li><strong>onDragEnd 핸들러:</strong> 드래그 완료 시 active와 over 아이템 ID를 받아 처리</li>
                  <li><strong>SortableContext:</strong> 정렬 가능한 아이템들의 컨테이너와 정렬 전략 정의</li>
                  <li><strong>useSortable 훅:</strong> 개별 아이템을 드래그 가능하게 만들고 상태 관리</li>
                  <li><strong>arrayMove 유틸:</strong> 배열에서 아이템 위치를 효율적으로 이동</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 구현 결과 섹션 */}
        <section>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-xl mr-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. 구현 결과</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <Settings className="w-4 h-4" />
                <span>총 {items.length}개 아이템</span>
              </div>
            </div>

            {/* 드래그 앤 드롭 리스트 */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <GripVertical className="w-5 h-5 mr-2" />
                  관리자 메뉴 우선순위 설정
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  아래 아이템들을 드래그하여 원하는 순서로 정렬해보세요. 각 아이템의 왼쪽 핸들을 잡고 드래그할 수 있습니다.
                </p>
                
                <DndContext 
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {items.map((item) => (
                        <SortableItem key={item.id} item={item} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* 현재 순서 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-800 mb-3">현재 순서</h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-center text-sm">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-blue-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-3">우선순위별 분류</h4>
                <div className="space-y-3">
                  {['높음', '중간', '낮음'].map(priority => {
                    const priorityItems = items.filter(item => item.priority === priority);
                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case '높음': return 'text-red-700';
                        case '중간': return 'text-yellow-700';
                        case '낮음': return 'text-green-700';
                        default: return 'text-gray-700';
                      }
                    };
                    
                    return (
                      <div key={priority}>
                        <span className={`font-semibold ${getPriorityColor(priority)}`}>
                          {priority} ({priorityItems.length}개)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>사용 팁:</strong> 드래그 핸들(⋮⋮)을 클릭하고 드래그하여 순서를 변경하세요. 
                키보드 사용자는 Tab키로 핸들에 포커스 후 Space바를 눌러 드래그 모드를 활성화할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Native 구현 섹션 */}
        <section className="mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-500 rounded-xl mr-4">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. 라이브러리 없이 직접 구현</h2>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-purple-800 mb-4 text-lg">Native HTML5 Drag and Drop API 활용</h3>
              <p className="text-purple-700 leading-relaxed mb-4">
                브라우저의 기본 HTML5 Drag and Drop API를 사용하여 라이브러리 없이 드래그 앤 드롭을 구현합니다. 
                이 방법은 추가적인 의존성 없이 순수한 웹 표준 API만으로 기능을 구현할 수 있습니다.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-indigo-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                Native 구현 핵심 원리
              </h3>
              <div className="text-indigo-700 leading-relaxed space-y-3">
                <p>
                  <strong>HTML5 Drag and Drop API</strong>를 사용한 구현 단계:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>draggable 속성:</strong> 요소를 드래그 가능하도록 설정</li>
                  <li><strong>onDragStart:</strong> 드래그 시작 시 아이템 ID 저장 및 효과 설정</li>
                  <li><strong>onDragOver:</strong> 드래그 중인 요소가 다른 요소 위로 지나갈 때 처리</li>
                  <li><strong>onDrop:</strong> 드롭 시 아이템 순서 재배열 로직 실행</li>
                  <li><strong>시각적 피드백:</strong> CSS 클래스를 통한 드래그/드롭 상태 표시</li>
                </ul>
              </div>
            </div>

            {/* Native 드래그 앤 드롭 구현 */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <GripVertical className="w-5 h-5 mr-2" />
                  Native API로 구현한 드래그 앤 드롭
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  라이브러리 없이 브라우저 기본 API만으로 구현한 드래그 앤 드롭입니다. 아이템을 직접 드래그하여 순서를 변경해보세요.
                </p>
                
                <div className="space-y-4">
                  {nativeItems.map((item) => (
                    <NativeDraggableItem
                      key={item.id}
                      item={item}
                      onDragStart={handleNativeDragStart}
                      onDragEnd={handleNativeDragEnd}
                      onDragOver={handleNativeDragOver}
                      onDrop={handleNativeDrop}
                      isDragging={dragState.draggingId === item.id}
                      isDragOver={dragState.dragOverId === item.id}
                      dragOverPosition={dragState.dragOverId === item.id ? dragState.dragOverPosition : null}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 구현 비교 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-3">라이브러리 사용 (dnd-kit)</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>✅ 접근성 기능 내장 (키보드, 스크린리더)</li>
                  <li>✅ 터치 디바이스 완벽 지원</li>
                  <li>✅ 충돌 감지 알고리즘 제공</li>
                  <li>✅ 애니메이션 및 전환 효과 내장</li>
                  <li>⚠️ 번들 크기 증가 (약 30KB)</li>
                  <li>⚠️ 추가 의존성 관리 필요</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-bold text-purple-800 mb-3">Native API 직접 구현</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>✅ 추가 의존성 없음</li>
                  <li>✅ 번들 크기 최소화</li>
                  <li>✅ 완전한 커스터마이징 가능</li>
                  <li>⚠️ 접근성 기능 직접 구현 필요</li>
                  <li>⚠️ 터치 디바이스 별도 처리 필요</li>
                  <li>⚠️ 크로스 브라우저 이슈 처리 필요</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h4 className="font-bold text-yellow-800 mb-3">💡 선택 가이드</h4>
              <div className="text-yellow-700 text-sm space-y-2">
                <p><strong>라이브러리 사용이 적합한 경우:</strong> 복잡한 드래그 앤 드롭 인터랙션, 접근성 중요, 빠른 개발 속도가 필요한 경우</p>
                <p><strong>Native 구현이 적합한 경우:</strong> 간단한 드래그 앤 드롭, 번들 크기 최적화가 중요, 의존성을 최소화하고 싶은 경우</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}