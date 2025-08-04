import { useMemo, useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Scroll, AlertCircle, Lightbulb, Code2, BarChart3, Users, Activity, CheckSquare, Square, MoveRight, Send } from 'lucide-react';
import PerformanceMonitor from '../components/PerformanceMonitor';

// 아이템 타입 정의
type Item = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  views: number;
};

// Mock 데이터 생성 함수
const generateMockData = (count: number, startId: number = 1): Item[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    title: `아이템 ${startId + index}`,
    description: `이것은 ${startId + index}번째 아이템의 설명입니다. 가상화를 통해 효율적으로 렌더링되고 있습니다.`,
    category: ['기술', '디자인', '비즈니스', '마케팅'][index % 4],
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ko-KR'),
    views: Math.floor(Math.random() * 10000)
  }));
};

export default function InfiniteScrollPage() {
  // 4개의 리스트 상태 관리
  const [lists, setLists] = useState<Item[][]>(() => [
    generateMockData(100000), // 첫 번째 리스트에 10만개
    [],
    [],
    []
  ]);
  
  // 선택된 아이템 ID 저장 (Set으로 빠른 조회)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // 각 리스트별 스크롤 컨테이너 참조
  const parentRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  
  // 성능 모니터 표시 상태
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(true);
  
  // 이동 대상 리스트 인덱스 상태
  const [targetListIndex, setTargetListIndex] = useState<number | null>(null);

  // 각 리스트별 가상화 설정
  const virtualizers = [
    useVirtualizer({
      count: lists[0].length,
      getScrollElement: () => parentRefs[0].current,
      estimateSize: () => 120,
      overscan: 5,
    }),
    useVirtualizer({
      count: lists[1].length,
      getScrollElement: () => parentRefs[1].current,
      estimateSize: () => 120,
      overscan: 5,
    }),
    useVirtualizer({
      count: lists[2].length,
      getScrollElement: () => parentRefs[2].current,
      estimateSize: () => 120,
      overscan: 5,
    }),
    useVirtualizer({
      count: lists[3].length,
      getScrollElement: () => parentRefs[3].current,
      estimateSize: () => 120,
      overscan: 5,
    })
  ];

  // 아이템 선택/해제 토글
  const toggleItemSelection = useCallback((itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // 전체 선택
  const selectAll = useCallback((listIndex: number) => {
    const allIds = lists[listIndex].map(item => item.id);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      allIds.forEach(id => newSet.add(id));
      return newSet;
    });
  }, [lists]);

  // 전체 해제
  const deselectAll = useCallback((listIndex: number) => {
    const allIds = lists[listIndex].map(item => item.id);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      allIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  }, [lists]);

  // 선택된 아이템을 다른 리스트로 이동
  const moveSelectedItems = useCallback((fromListIndex: number, toListIndex: number) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      const fromList = [...newLists[fromListIndex]];
      const toList = [...newLists[toListIndex]];
      
      // 선택된 아이템 필터링
      const itemsToMove = fromList.filter(item => selectedItems.has(item.id));
      const remainingItems = fromList.filter(item => !selectedItems.has(item.id));
      
      // 리스트 업데이트
      newLists[fromListIndex] = remainingItems;
      newLists[toListIndex] = [...toList, ...itemsToMove];
      
      return newLists;
    });
    
    // 이동 후 선택 해제
    setSelectedItems(new Set());
  }, [selectedItems]);

  // 리스트별 선택된 아이템 수 계산
  const getSelectedCount = useCallback((listIndex: number) => {
    return lists[listIndex].filter(item => selectedItems.has(item.id)).length;
  }, [lists, selectedItems]);

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Scroll className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight pb-2">
            Infinite Scroll & Virtualization
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            대용량 데이터를 효율적으로 처리하는 가상화 기법을 학습하고 실습해보세요
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
                  수만 개 이상의 데이터를 한 번에 렌더링할 경우, 브라우저가 모든 DOM 요소를 메모리에 올려야 하므로 성능 저하가 발생합니다. 
                  특히 모바일 디바이스나 저사양 브라우저 환경에서 렌더링이 멈추거나 스크롤이 끊기는 현상이 자주 나타납니다.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  개발 필요성
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  실제 서비스에서 상품 목록, 게시글, 로그 데이터 등 대규모 데이터를 보여줘야 하는 상황은 빈번합니다. 
                  성능 최적화된 무한 스크롤은 빠른 로딩 속도와 쾌적한 스크롤링 경험을 제공하여 사용자 이탈을 방지합니다.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  테스트 포인트
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  10만 개 이상의 mock 데이터를 스크롤로 불러올 때 FPS, 메모리 사용량을 측정하여 성능을 평가합니다. 
                  개발자 도구의 Performance 탭에서 실시간 성능 모니터링이 가능합니다.
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
              <h2 className="text-2xl font-bold text-gray-900">2. 해결 방법: 가상화 (Virtualization) 기법 적용</h2>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-4 text-lg">핵심 해결책: 가상화 (Virtualization)</h3>
              <p className="text-yellow-700 leading-relaxed mb-4">
                전체 데이터를 한 번에 렌더링하는 대신, 사용자에게 현재 보이는 화면 영역(Viewport)에 해당하는 DOM 요소만 렌더링하는 기술입니다.
                이를 통해 메모리 사용량을 대폭 줄이고 렌더링 성능을 획기적으로 개선할 수 있습니다.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                @tanstack/react-virtual 라이브러리 원리
              </h3>
              <div className="text-blue-700 leading-relaxed space-y-3">
                <p>
                  <strong>useVirtualizer 훅</strong>이 스크롤 컨테이너의 크기와 각 아이템의 크기를 계산하여 다음과 같이 동작합니다:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>가시 영역 계산:</strong> 현재 스크롤 위치를 기반으로 화면에 보이는 아이템들만 식별</li>
                  <li><strong>동적 렌더링:</strong> 가시 영역의 아이템들만 실제 DOM에 렌더링</li>
                  <li><strong>스크롤 최적화:</strong> 스크롤 이벤트에 따라 렌더링할 아이템 목록을 실시간 업데이트</li>
                  <li><strong>메모리 관리:</strong> 화면 밖 아이템들은 DOM에서 제거하여 메모리 사용량 최소화</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 추가 구현 섹션 */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-500 rounded-xl mr-4">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. 추가 구현: 멀티 리스트 & 선택 기능</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-purple-800 mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  멀티 리스트 가상화
                </h3>
                <ul className="text-purple-700 text-sm leading-relaxed space-y-2">
                  <li>• 4개의 독립적인 가상화 리스트 구현</li>
                  <li>• 첫 번째 리스트에 10만개 아이템 초기화</li>
                  <li>• 각 리스트별 독립적인 스크롤 및 가상화</li>
                  <li>• 리스트 간 아이템 이동 기능</li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="font-bold text-indigo-800 mb-3 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  선택 상태 관리
                </h3>
                <ul className="text-indigo-700 text-sm leading-relaxed space-y-2">
                  <li>• 개별 아이템 선택/해제 토글</li>
                  <li>• 전체 선택/전체 해제 기능</li>
                  <li>• 선택 상태 시각적 피드백 (파란색 하이라이트)</li>
                  <li>• 가상화되어도 선택 상태 유지 (Set 자료구조 활용)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-bold text-green-800 mb-4 text-lg flex items-center">
                <Send className="w-5 h-5 mr-2" />
                아이템 이동 워크플로우
              </h3>
              <div className="text-green-700 leading-relaxed space-y-3">
                <p>
                  <strong>1단계:</strong> 원하는 아이템들을 클릭하여 선택 (체크박스 아이콘 표시)
                </p>
                <p>
                  <strong>2단계:</strong> 소스 리스트에서 "이동" 버튼 클릭 (녹색 테두리로 표시)
                </p>
                <p>
                  <strong>3단계:</strong> 대상 리스트에서 "여기로 받기" 버튼 클릭 (보라색 점선 테두리)
                </p>
                <p>
                  <strong>결과:</strong> 선택된 아이템들이 대상 리스트로 이동하고 선택 상태가 초기화됨
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 구현 결과 섹션 */}
        <section>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-xl mr-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. 구현 결과</h2>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                총 {lists.reduce((sum, list) => sum + list.length, 0).toLocaleString()}개 아이템
              </div>
            </div>

            {/* 4개의 가상화된 리스트 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {lists.map((list, listIndex) => (
                <div 
                  key={listIndex} 
                  className={`
                    rounded-xl p-4 transition-all
                    ${targetListIndex === listIndex 
                      ? 'bg-green-100 ring-2 ring-green-500' 
                      : targetListIndex !== null && targetListIndex !== listIndex
                        ? 'bg-purple-50 ring-2 ring-purple-400 ring-dashed'
                        : 'bg-gray-50'
                    }
                  `}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">리스트 {listIndex + 1}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {getSelectedCount(listIndex)}/{list.length} 선택됨
                      </span>
                    </div>
                  </div>
                  
                  {/* 액션 버튼들 */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => selectAll(listIndex)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      전체 선택
                    </button>
                    <button
                      onClick={() => deselectAll(listIndex)}
                      className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      전체 해제
                    </button>
                    {getSelectedCount(listIndex) > 0 && targetListIndex === null && (
                      <button
                        onClick={() => setTargetListIndex(listIndex)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        이동
                      </button>
                    )}
                    {targetListIndex === listIndex && (
                      <button
                        onClick={() => setTargetListIndex(null)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        취소
                      </button>
                    )}
                    {targetListIndex !== null && targetListIndex !== listIndex && (
                      <button
                        onClick={() => {
                          moveSelectedItems(targetListIndex, listIndex);
                          setTargetListIndex(null);
                        }}
                        className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors animate-pulse"
                      >
                        여기로 받기
                      </button>
                    )}
                  </div>
                  
                  {/* 가상화된 리스트 */}
                  <div
                    ref={parentRefs[listIndex]}
                    className="h-96 overflow-auto border border-gray-200 rounded-lg bg-white"
                    style={{
                      contain: 'strict',
                    }}
                  >
                    <div
                      style={{
                        height: `${virtualizers[listIndex].getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {virtualizers[listIndex].getVirtualItems().map((virtualItem) => {
                        const item = list[virtualItem.index];
                        const isSelected = selectedItems.has(item.id);
                        return (
                          <div
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={virtualizers[listIndex].measureElement}
                            className="absolute top-0 left-0 w-full px-3 py-2"
                            style={{
                              transform: `translateY(${virtualItem.start}px)`,
                            }}
                          >
                            <div 
                              onClick={() => toggleItemSelection(item.id)}
                              className={`
                                rounded-lg p-3 border cursor-pointer transition-all
                                ${isSelected 
                                  ? 'bg-blue-100 border-blue-400 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:shadow-sm hover:border-gray-300'
                                }
                              `}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <div className="pt-0.5">
                                    {isSelected ? (
                                      <CheckSquare className="w-4 h-4 text-blue-600" />
                                    ) : (
                                      <Square className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                                      {item.title}
                                    </h4>
                                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                      {item.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                        {item.category}
                                      </span>
                                      <span className="truncate">{item.date}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 ml-2">
                                  #{item.id}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* 리스트 통계 */}
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    총 {list.length.toLocaleString()}개 | 
                    렌더링: {virtualizers[listIndex].getVirtualItems().length}개
                  </div>
                </div>
              ))}
            </div>

            {/* 전체 성능 정보 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center overflow-hidden">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
                  {virtualizers.reduce((sum, v) => sum + v.getVirtualItems().length, 0)}
                </div>
                <div className="text-xs sm:text-sm text-blue-800">총 렌더링 아이템</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center overflow-hidden">
                <div className="text-xl sm:text-2xl font-bold text-green-600 truncate">
                  {lists.reduce((sum, list) => sum + list.length, 0).toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-green-800">전체 아이템</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center overflow-hidden">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 truncate">
                  {selectedItems.size.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-purple-800">선택된 아이템</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 sm:p-4 text-center overflow-hidden">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 truncate">
                  {(
                    (virtualizers.reduce((sum, v) => sum + v.getVirtualItems().length, 0) / 
                    lists.reduce((sum, list) => sum + list.length, 0)) * 100
                  ).toFixed(2)}%
                </div>
                <div className="text-xs sm:text-sm text-orange-800">렌더링 비율</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>사용법:</strong> 아이템을 클릭하여 선택하고, '이동' 버튼을 클릭한 후 대상 리스트의 '여기로 받기' 버튼을 클릭하세요.
              </p>
              <p className="text-sm text-gray-600 text-center">
                <strong>개발자 도구 팁:</strong> F12 → Performance 탭에서 스크롤 성능을 실시간으로 모니터링해보세요!
              </p>
            </div>
            
            {/* 성능 모니터 토글 버튼 */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                {showPerformanceMonitor ? '성능 모니터 숨기기' : '성능 모니터 표시'}
              </button>
            </div>
          </div>
        </section>
      </div>
      
      {/* 성능 모니터 */}
      {showPerformanceMonitor && <PerformanceMonitor />}
    </div>
  );
}