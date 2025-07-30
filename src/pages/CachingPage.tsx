import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchData, fetchDataWithError } from '../api/mockAPI';
import type { DataItem } from '../api/mockAPI';
import { SkeletonCardList } from '../components/SkeletonCard';
import { Database, AlertCircle, Lightbulb, Code2, RefreshCw, Clock, TrendingUp, Eye, Calendar, Tag, Zap, Timer, Bug, Loader } from 'lucide-react';

// 캐시 테스트를 위한 내부 컴포넌트
function CachingContent({ componentKey, onCacheTest, fetchCount, setFetchCount }: { 
  componentKey: number; 
  onCacheTest: () => void;
  fetchCount: number;
  setFetchCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const [isCacheHit, setIsCacheHit] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);
  const [showSkeletonPreview, setShowSkeletonPreview] = useState(false);
  const queryClient = useQueryClient();

  // React Query를 사용한 데이터 페칭
  const { data, isLoading, isError, error, refetch, isFetching, isRefetching, dataUpdatedAt } = useQuery<DataItem[], Error>({
    queryKey: ['caching-data', simulateError],
    queryFn: async () => {
      const startTime = performance.now();
      const result = await (simulateError ? fetchDataWithError() : fetchData());
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setLoadTimeMs(loadTime);
      setFetchCount(prev => prev + 1); // 실제 서버 요청 시에만 증가
      setIsCacheHit(false); // 서버 요청이 발생했으므로 캐시 히트 아님
      
      return result;
    },
    staleTime: 30 * 1000, // 30초간 데이터를 신선하다고 간주 (테스트를 위해 짧게 설정)
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: simulateError ? 2 : 1, // 에러 시뮬레이션 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 비활성화
  });

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

  // 캐시 히트 여부 확인 (서버 요청이 발생한 경우에만)
  useEffect(() => {
    if (data && !isLoading && !isRefetching && loadTimeMs !== null && loadTimeMs > 0) {
      // 서버 요청이 발생한 경우만 캐시 히트 여부 판단
      setIsCacheHit(false); // 서버에서 데이터를 가져온 경우
    }
  }, [data, isLoading, isRefetching, loadTimeMs]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '개발': 'bg-blue-100 text-blue-800',
      '디자인': 'bg-purple-100 text-purple-800',
      '최적화': 'bg-green-100 text-green-800',
      '접근성': 'bg-orange-100 text-orange-800',
      '테스팅': 'bg-red-100 text-red-800',
      '백엔드': 'bg-gray-100 text-gray-800',
      '데이터베이스': 'bg-yellow-100 text-yellow-800',
      '보안': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Caching & Skeleton UI
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            데이터 캐싱과 스켈레톤 UI로 사용자 경험을 향상시키는 방법을 학습해보세요
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
                  서버 API 응답 속도가 느리면 화면 로딩 지연으로 사용자 불만이 발생할 수 있습니다. 
                  로딩 중에 아무런 피드백 없이 빈 화면만 보이면 사용자가 오류로 인식할 위험이 있습니다.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  개발 필요성
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  캐싱을 통해 동일한 데이터를 재요청하지 않고 빠르게 표시할 수 있습니다. 
                  스켈레톤 UI를 적용하면 로딩 중에도 사용자가 콘텐츠 구조를 예상할 수 있어 UX가 개선됩니다.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  테스트 포인트
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  캐싱 전후 API 재호출 속도를 비교합니다. 
                  스켈레톤 UI 적용 시 로딩 경험이 개선되는지 확인합니다. 
                  네트워크 오류 상황에서의 사용자 피드백을 검증합니다.
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
              <h2 className="text-2xl font-bold text-gray-900">2. 해결 방법: React Query와 스켈레톤 UI</h2>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-4 text-lg">핵심 해결책: @tanstack/react-query</h3>
              <p className="text-yellow-700 leading-relaxed mb-4">
                `@tanstack/react-query`의 `useQuery` 훅은 데이터 캐싱, 백그라운드 업데이트, 로딩/에러 상태 관리를 자동으로 처리합니다. 
                한 번 로드된 데이터는 메모리에 캐시되어 동일한 요청 시 즉시 반환되며, 설정된 시간 후 백그라운드에서 자동으로 업데이트됩니다.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                조건부 렌더링을 통한 UX 개선
              </h3>
              <div className="text-blue-700 leading-relaxed space-y-3">
                <p>
                  `useQuery`가 반환하는 상태값을 활용한 사용자 경험 최적화:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>isLoading 상태:</strong> 스켈레톤 UI로 로딩 중임을 시각적으로 표현</li>
                  <li><strong>isError 상태:</strong> 사용자 친화적인 에러 메시지와 재시도 옵션 제공</li>
                  <li><strong>isSuccess 상태:</strong> 실제 데이터를 매끄럽게 렌더링</li>
                  <li><strong>isFetching 상태:</strong> 백그라운드 업데이트 진행 상황 표시</li>
                  <li><strong>캐시 전략:</strong> staleTime과 gcTime으로 캐시 생명주기 관리</li>
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
              {isFetching && (
                <div className="flex items-center text-sm text-blue-600">
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  업데이트 중...
                </div>
              )}
            </div>

            {/* 컨트롤 버튼 그룹 */}
            <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">테스트 컨트롤</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={onCacheTest}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span className="text-sm">캐시 테스트</span>
                </button>
                <button
                  onClick={() => {
                    setShowSkeletonPreview(true);
                    setTimeout(() => setShowSkeletonPreview(false), 3000);
                  }}
                  disabled={showSkeletonPreview}
                  className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Loader className={`w-4 h-4 ${showSkeletonPreview ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{showSkeletonPreview ? '미리보기 중' : '스켈레톤 UI'}</span>
                </button>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  <span className="text-sm">강제 새로고침</span>
                </button>
                <button
                  onClick={() => {
                    setSimulateError(!simulateError);
                    queryClient.invalidateQueries({ queryKey: ['caching-data'] });
                  }}
                  className={`flex items-center justify-center space-x-2 ${simulateError ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white px-4 py-3 rounded-lg transition-colors`}
                >
                  <Bug className="w-4 h-4" />
                  <span className="text-sm">{simulateError ? '에러 ON' : '에러 OFF'}</span>
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>{showComparison ? '성능 비교 숨기기' : '성능 비교 보기'}</span>
                </button>
                <div className="text-xs text-gray-500">
                  각 버튼을 클릭하여 다양한 기능을 테스트해보세요
                </div>
              </div>
            </div>

            {/* 캐시 상태 표시 */}
            <div className={`mb-4 p-3 rounded-lg border ${
              isCacheHit || loadTimeMs === 0 ? 
                'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 
                'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isCacheHit || loadTimeMs === 0 ? 'bg-green-500 animate-pulse' :
                    data && !isFetching ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    데이터 소스: {
                      isCacheHit || loadTimeMs === 0 ? 
                        <span className="text-green-600">⚡ 캐시 (메모리에서 즉시 로드)</span> :
                        data && !isFetching ? 
                          <span className="text-blue-600">🌐 서버 (API 호출 완료)</span> : 
                          <span className="text-gray-500">⏳ 로딩 중...</span>
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  {simulateError && (
                    <span className="text-xs text-red-600 font-medium">
                      ⚠️ 에러 모드 활성 (100% 실패율)
                    </span>
                  )}
                  {data && !isFetching && (
                    <span className="text-xs text-gray-500">
                      캐시 유효 시간: 30초 | 캐시 보관 시간: 10분
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* React Query 캐싱 개념 */}
            <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200">
              <button
                onClick={() => setShowConcepts(!showConcepts)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-100 p-4 rounded-xl transition-colors"
              >
                <h4 className="font-semibold text-gray-700">📚 React Query 캐싱 개념</h4>
                <span className={`transform transition-transform text-gray-400 ${showConcepts ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {showConcepts && (
                <div className="px-4 pb-4">
                  <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <div><strong className="text-blue-800">staleTime (30초) - "서버 요청 안함 시간"</strong></div>
                  <div className="mt-1">데이터를 "신선한(fresh)" 상태로 간주하여 서버 요청을 하지 않는 시간입니다.</div>
                  <div className="text-xs text-blue-600 mt-1">💡 이 시간 동안은 서버 요청 없이 캐시에서 즉시 반환합니다.</div>
                </div>
                <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                  <div><strong className="text-purple-800">gcTime (10분) - "즉시 표시용 캐시 보관"</strong></div>
                  <div className="mt-1">stale 상태가 되어도 "즉시 표시용"으로 캐시를 보관하는 시간입니다.</div>
                  <div className="text-xs text-purple-600 mt-1">💡 페이지 재방문 시 이 캐시를 먼저 보여주고, 동시에 백그라운드에서 새 데이터를 가져옵니다.</div>
                </div>
                <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                  <div><strong className="text-orange-800">retry (1회) - "재시도 횟수"</strong></div>
                  <div className="mt-1">요청 실패 시 자동으로 재시도하는 횟수입니다.</div>
                </div>
                <div className="bg-gray-100 p-3 rounded mt-3">
                  <div className="font-semibold text-gray-700 mb-2">🕐 실제 동작 시나리오:</div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-bold">0초:</span> 데이터 첫 로드 (서버 요청) ✅</div>
                    <div><span className="font-bold">15초:</span> 캐시 테스트 → 캐시 사용 (staleTime 이내) ⚡</div>
                    <div><span className="font-bold">45초:</span> 캐시 테스트 → <span className="text-green-600">기존 데이터 즉시 표시</span> + 백그라운드 업데이트 🔄</div>
                    <div><span className="font-bold">11분:</span> 페이지 방문 → 처음부터 로드 (gcTime 만료, 캐시 삭제) 🗑️</div>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded mt-3">
                  <div className="font-semibold text-blue-700 mb-2">💡 gcTime의 진짜 가치:</div>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div><span className="font-bold">상황:</span> 1분 전 방문 → Home 이동 → 다시 CachingPage 방문</div>
                    <div><span className="font-bold">gcTime 있을 때:</span> 즉시 기존 데이터 표시 → 백그라운드 업데이트</div>
                    <div><span className="font-bold">gcTime 없을 때:</span> 빈 화면 → 로딩 → 데이터 표시</div>
                    <div className="text-green-700 font-semibold">⭐ staleTime 만료 후에도 캐시는 "즉시 표시용"으로 활용됩니다!</div>
                  </div>
                </div>
                    <div className="text-xs pt-2 text-gray-500 bg-yellow-50 p-2 rounded">⚠️ 브라우저 새로고침(F5) 시 JavaScript 메모리가 초기화되어 모든 캐시가 즉시 사라집니다.</div>
                  </div>
                </div>
              )}
            </div>

            {/* 캐시 사용 시나리오 설명 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                캐시가 사용되는 상황들
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <div>
                    <strong>캐시 테스트 버튼 클릭:</strong> 컴포넌트를 재마운트하여 캐시된 데이터를 즉시 표시합니다. (서버 요청 없음)
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <div>
                    <strong>다른 페이지 방문 후 복귀:</strong> Home이나 다른 페이지로 이동했다가 10분 이내에 돌아오면, 캐시가 유지되어 있어 즉시 데이터가 표시됩니다.
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <div>
                    <strong>컴포넌트 재마운트:</strong> 같은 세션 내에서 CachingPage 컴포넌트가 언마운트되었다가 다시 마운트되어도 캐시가 유지됩니다.
                  </div>
                </div>
                <div className="flex items-start bg-yellow-50 p-2 rounded border border-yellow-200">
                  <span className="mr-2">⚠️</span>
                  <div>
                    <strong>중요:</strong> <span className="text-blue-600">"강제 새로고침"</span> 버튼은 React Query의 <code>refetch()</code> 함수로, 캐시를 무시하고 항상 서버에서 데이터를 가져옵니다. 실제 캐시 효과를 보려면 <span className="text-green-600">"캐시 테스트"</span> 버튼을 사용하세요.
                  </div>
                </div>
                <div className="flex items-start text-gray-600">
                  <span className="mr-2">❌</span>
                  <div>
                    <strong>캐시가 사용되지 않는 경우:</strong> 브라우저 새로고침, 새 탭에서 열기, 10분 이상 경과 후 방문, <code>refetch()</code> 함수 호출
                  </div>
                </div>
              </div>
            </div>

            {/* 컨트롤 버튼 그룹 */}
            <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">테스트 컨트롤</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={onCacheTest}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Database className="w-4 h-4" />
                  <span className="text-sm">캐시 테스트</span>
                </button>
                <button
                  onClick={() => {
                    setShowSkeletonPreview(true);
                    setTimeout(() => setShowSkeletonPreview(false), 3000);
                  }}
                  disabled={showSkeletonPreview}
                  className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Loader className={`w-4 h-4 ${showSkeletonPreview ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{showSkeletonPreview ? '미리보기 중' : '스켈레톤 UI'}</span>
                </button>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  <span className="text-sm">강제 새로고침</span>
                </button>
                <button
                  onClick={() => {
                    setSimulateError(!simulateError);
                    queryClient.invalidateQueries({ queryKey: ['caching-data'] });
                  }}
                  className={`flex items-center justify-center space-x-2 ${simulateError ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white px-4 py-3 rounded-lg transition-colors`}
                >
                  <Bug className="w-4 h-4" />
                  <span className="text-sm">{simulateError ? '에러 ON' : '에러 OFF'}</span>
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>{showComparison ? '성능 비교 숨기기' : '성능 비교 보기'}</span>
                </button>
                <div className="text-xs text-gray-500">
                  각 버튼을 클릭하여 다양한 기능을 테스트해보세요
                </div>
              </div>
            </div>

            {/* 성능 메트릭 표시 - 데이터가 로드된 경우 항상 표시 */}
            {data && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isCacheHit ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">로드 시간</p>
                      <p className={`text-2xl font-bold ${isCacheHit ? 'text-green-600' : 'text-blue-600'}`}>
                        {loadTimeMs !== null ? loadTimeMs.toFixed(0) : '0'}ms
                      </p>
                    </div>
                    <Timer className={`w-8 h-8 ${isCacheHit ? 'text-green-500' : 'text-blue-500'}`} />
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    {loadTimeMs === 0 || isCacheHit ? '⚡ 캐시에서 즉시 로드 (서버 요청 없음)' : 
                     fetchCount === 1 ? '🌐 초기 로드 (서버에서 페칭)' : 
                     '🔄 서버에서 재페칭'}
                  </p>
                </div>
                
                <div className={`p-4 border rounded-lg ${isCacheHit || loadTimeMs === 0 ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">서버 요청 횟수</p>
                      <p className={`text-2xl font-bold ${isCacheHit || loadTimeMs === 0 ? 'text-green-600' : 'text-purple-600'}`}>{fetchCount}회</p>
                    </div>
                    <Database className={`w-8 h-8 ${isCacheHit || loadTimeMs === 0 ? 'text-green-500' : 'text-purple-500'}`} />
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    {isCacheHit || loadTimeMs === 0 ? '캐시 히트 시 서버 요청 없음' : '실제 서버 API 호출 횟수'}
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">마지막 서버 요청</p>
                      <p className="text-lg font-bold text-orange-600">
                        {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR') : '-'}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    {isCacheHit || loadTimeMs === 0 ? '기존 데이터 사용 (새 요청 없음)' : '데이터 최종 갱신 시각'}
                  </p>
                </div>
              </div>
            )}

            {/* 성능 비교 섹션 */}
            {showComparison && (
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <h3 className="font-bold text-lg mb-4 text-purple-900">📊 캐싱 효과 비교</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">🐌 캐싱 없이 (매번 서버 요청)</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        평균 로딩 시간: 1,000-2,000ms
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        네트워크 사용량: 매 요청마다 ~50KB
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        사용자 경험: 반복적인 로딩 대기
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        서버 부하: 동일 데이터 반복 요청
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">⚡ React Query 캐싱 적용</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        캐시 히트 시: <strong className="text-green-600">즉시 표시 (메모리에서 로드)</strong>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        네트워크 사용량: 캐시 유효 시 0KB
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        사용자 경험: 즉각적인 데이터 표시
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        서버 부하: 필요 시에만 요청
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>💡 핵심 차이점:</strong> 캐시 사용 시 <span className="font-bold text-green-600">네트워크 요청 자체가 발생하지 않아</span> 즉시 데이터를 표시합니다!<br/>
                    <span className="text-xs text-gray-500">※ React Query는 staleTime 동안 메모리에 캐시된 데이터를 반환하므로 2초 지연이 발생하지 않습니다</span>
                  </p>
                </div>
              </div>
            )}

            {/* 로딩 상태 또는 스켈레톤 미리보기 */}
            {(isLoading || showSkeletonPreview) && (
              <div>
                <div className={`mb-4 p-4 rounded-lg ${showSkeletonPreview ? 'bg-purple-50 border border-purple-200' : 'bg-blue-50'}`}>
                  <p className={`${showSkeletonPreview ? 'text-purple-800' : 'text-blue-800'} text-center font-medium`}>
                    {showSkeletonPreview ? 
                      '🎨 스켈레톤 UI 미리보기 (3초간 표시)' : 
                      '📡 서버에서 데이터를 불러오는 중입니다... (최대 2초 소요)'
                    }
                  </p>
                </div>
                
                {/* 스켈레톤 UI 효과 설명 */}
                <div className={`mb-4 p-4 rounded-lg border ${showSkeletonPreview ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
                  <h4 className={`font-semibold mb-2 ${showSkeletonPreview ? 'text-purple-700' : 'text-gray-700'}`}>
                    🎨 스켈레톤 UI의 UX 개선 효과
                    {showSkeletonPreview && <span className="ml-2 text-sm font-normal text-purple-600">(지금 확인 중!)</span>}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-2">❌ <strong>스켈레톤 UI 없이:</strong></p>
                      <ul className="space-y-1 text-gray-500 ml-4">
                        <li>• 빈 화면으로 불안감 조성</li>
                        <li>• 로딩 시간이 더 길게 느껴짐</li>
                        <li>• 콘텐츠 구조 예측 불가</li>
                      </ul>
                    </div>
                    <div>
                      <p className={`mb-2 ${showSkeletonPreview ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                        ✅ <strong>스켈레톤 UI 적용:</strong>
                      </p>
                      <ul className={`space-y-1 ml-4 ${showSkeletonPreview ? 'text-purple-500 font-medium' : 'text-gray-500'}`}>
                        <li>• 로딩 중임을 명확히 표시</li>
                        <li>• 체감 대기 시간 단축</li>
                        <li>• 레이아웃 시프트 방지</li>
                      </ul>
                    </div>
                  </div>
                  {showSkeletonPreview && (
                    <div className="mt-3 p-2 bg-purple-100 rounded text-xs text-purple-700 text-center">
                      ✨ 아래 스켈레톤 카드들이 실제 데이터의 예상 레이아웃을 보여줍니다!
                    </div>
                  )}
                </div>
                
                <SkeletonCardList count={6} />
              </div>
            )}

            {/* 에러 상태 */}
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

            {/* 성공 상태 - 데이터 표시 (스켈레톤 미리보기 중에는 숨김) */}
            {data && !showSkeletonPreview && (
              <div>
                <div className={`mb-6 p-4 rounded-lg ${isCacheHit || loadTimeMs === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-green-50'}`}>
                  <p className="text-green-800 text-center font-medium">
                    {isCacheHit || loadTimeMs === 0 ? 
                      '⚡ 캐시에서 즉시 데이터를 불러왔습니다!' : 
                      '✅ 서버에서 데이터를 성공적으로 불러왔습니다!'
                    } ({data.length}개 항목)
                  </p>
                  {(isCacheHit || loadTimeMs === 0) && (
                    <p className="text-xs text-green-700 text-center mt-1">
                      🚀 네트워크 요청 없이 메모리에서 즉시 로드됨 - 이것이 캐싱의 효과입니다!
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                            <Tag className="w-3 h-3 inline mr-1" />
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.createdAt}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {item.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}

export default function CachingPage() {
  const [componentKey, setComponentKey] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);

  const handleCacheTest = () => {
    setComponentKey(prev => prev + 1);
  };

  return (
    <CachingContent 
      key={componentKey} 
      componentKey={componentKey} 
      onCacheTest={handleCacheTest}
      fetchCount={fetchCount}
      setFetchCount={setFetchCount}
    />
  );
}