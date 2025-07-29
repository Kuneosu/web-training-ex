import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../api/mockAPI';
import type { DataItem } from '../api/mockAPI';
import { SkeletonCardList } from '../components/SkeletonCard';
import { Database, AlertCircle, Lightbulb, Code2, RefreshCw, Clock, TrendingUp, Eye, Calendar, Tag } from 'lucide-react';

export default function CachingPage() {
  // React Query를 사용한 데이터 페칭
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<DataItem[], Error>({
    queryKey: ['caching-data'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하다고 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 1, // 1회만 재시도
  });

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
              <div className="flex items-center space-x-3">
                {isFetching && (
                  <div className="flex items-center text-sm text-blue-600">
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    업데이트 중...
                  </div>
                )}
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                  <span>데이터 새로고침</span>
                </button>
              </div>
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-center font-medium">
                    📡 서버에서 데이터를 불러오는 중입니다... (최대 2초 소요)
                  </p>
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

            {/* 성공 상태 - 데이터 표시 */}
            {data && (
              <div>
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-center font-medium">
                    ✅ 데이터를 성공적으로 불러왔습니다! ({data.length}개 항목)
                  </p>
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

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>캐싱 팁:</strong> 동일한 데이터를 다시 요청하면 캐시에서 즉시 로드됩니다! 
                새로고침 버튼을 여러 번 클릭해서 캐싱 효과를 확인해보세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}