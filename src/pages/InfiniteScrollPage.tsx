import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Scroll, AlertCircle, Lightbulb, Code2, BarChart3, Users } from 'lucide-react';

// Mock 데이터 생성 함수
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `아이템 ${index + 1}`,
    description: `이것은 ${index + 1}번째 아이템의 설명입니다. 가상화를 통해 효율적으로 렌더링되고 있습니다.`,
    category: ['기술', '디자인', '비즈니스', '마케팅'][index % 4],
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ko-KR'),
    views: Math.floor(Math.random() * 10000)
  }));
};

export default function InfiniteScrollPage() {
  // 10만 개의 mock 데이터 생성
  const items = useMemo(() => generateMockData(100000), []);
  
  // 스크롤 컨테이너 참조
  const parentRef = useRef<HTMLDivElement>(null);

  // 가상화 설정
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // 각 아이템의 예상 높이
    overscan: 5, // 화면 밖에 미리 렌더링할 아이템 수
  });

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Scroll className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
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
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                총 {items.length.toLocaleString()}개 아이템
              </div>
            </div>

            {/* 가상화된 리스트 */}
            <div
              ref={parentRef}
              className="h-96 overflow-auto border border-gray-200 rounded-xl"
              style={{
                contain: 'strict',
              }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = items[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      className="absolute top-0 left-0 w-full px-4 py-3"
                      style={{
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                              <span>{item.date}</span>
                              <span className="flex items-center">
                                <BarChart3 className="w-3 h-3 mr-1" />
                                {item.views.toLocaleString()} 조회
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 ml-4">
                            #{virtualItem.index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 성능 정보 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {virtualizer.getVirtualItems().length}
                </div>
                <div className="text-sm text-blue-800">렌더링된 아이템</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {items.length.toLocaleString()}
                </div>
                <div className="text-sm text-green-800">전체 아이템</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(virtualizer.getTotalSize()).toLocaleString()}px
                </div>
                <div className="text-sm text-purple-800">가상 높이</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {((virtualizer.getVirtualItems().length / items.length) * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-orange-800">렌더링 비율</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>개발자 도구 팁:</strong> F12 → Performance 탭에서 스크롤 성능을 실시간으로 모니터링해보세요!
                현재 화면에 보이는 아이템들만 DOM에 렌더링되어 있는 것을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}