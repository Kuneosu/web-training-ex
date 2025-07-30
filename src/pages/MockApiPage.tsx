import { useState } from 'react';
import { mockFetch } from '../api/mockAPI';
import type { MockApiResponse } from '../api/mockAPI';
import { Server, AlertCircle, Lightbulb, Code2, CheckCircle, XCircle, Clock, Loader2, Play } from 'lucide-react';

export default function MockApiPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MockApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (scenario: 'success' | 'error') => {
    // 상태 초기화
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await mockFetch(scenario);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight pb-2">
            Mock API System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Promise와 setTimeout을 활용한 비동기 네트워크 통신 시뮬레이션을 학습해보세요
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
                  실제 서버 API가 개발 중이거나 QA 단계일 때, 프론트엔드 개발자는 API 연동 테스트를 할 수 없어 개발 속도가 지연됩니다. 
                  네트워크 응답 지연이나 에러 상황을 미리 테스트할 수 없어, 예외 처리 로직이 미비한 상태에서 배포되는 위험이 있습니다.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  개발 필요성
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Mock API를 사용하면 서버 준비 여부와 관계없이 프론트엔드 개발을 병행할 수 있어 생산성이 높아집니다. 
                  지연시간, 에러 응답 코드 등을 직접 설정할 수 있어 다양한 상황을 시뮬레이션하고 안정적인 UI/UX를 확보할 수 있습니다.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  테스트 포인트
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  Mock API 요청 시 데이터가 정상적으로 반환되는지 확인합니다. 
                  인위적인 지연시간 및 오류 코드를 통해 예외 처리 로직을 검증합니다. 
                  로딩 상태와 에러 상태에서의 사용자 경험을 테스트합니다.
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
              <h2 className="text-2xl font-bold text-gray-900">2. 해결 방법: Promise를 이용한 비동기 동작 시뮬레이션</h2>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-4 text-lg">핵심 해결책: Promise + setTimeout 조합</h3>
              <p className="text-yellow-700 leading-relaxed mb-4">
                JavaScript의 `Promise`와 `setTimeout`을 조합하면 실제 네트워크 통신과 유사한 비동기 동작을 시뮬레이션할 수 있습니다. 
                함수가 호출되면 즉시 Promise를 반환하여 비동기 처리를 시작하고, `setTimeout`으로 설정된 지연시간 후에 결과를 반환합니다.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                비동기 동작 시뮬레이션 원리와 상태 관리
              </h3>
              <div className="text-blue-700 leading-relaxed space-y-3">
                <p>
                  Mock API의 비동기 동작과 React 상태 관리의 연동 흐름:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>1. 요청 시작:</strong> 버튼 클릭 시 즉시 loading 상태를 true로 변경</li>
                  <li><strong>2. Promise 생성:</strong> new Promise()로 비동기 작업 객체 생성</li>
                  <li><strong>3. 지연 시뮬레이션:</strong> setTimeout으로 1.5초 네트워크 지연 구현</li>
                  <li><strong>4. 조건부 처리:</strong> scenario 파라미터에 따라 resolve(성공) 또는 reject(실패) 실행</li>
                  <li><strong>5. 상태 업데이트:</strong> 성공 시 data 상태 업데이트, 실패 시 error 상태 업데이트</li>
                  <li><strong>6. 로딩 완료:</strong> finally 블록에서 loading 상태를 false로 변경</li>
                </ul>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>💡 핵심 포인트:</strong> Promise는 비동기 작업의 결과를 나타내는 객체로, 
                    pending(대기) → fulfilled(성공) 또는 rejected(실패) 상태로 전환됩니다. 
                    이를 통해 실제 API와 동일한 비동기 처리 패턴을 구현할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 구현 결과 섹션 */}
        <section>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-500 rounded-xl mr-4">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. 구현 결과</h2>
            </div>

            {/* 테스트 안내 */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-800 mb-2 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Mock API 동작 테스트
              </h3>
              <p className="text-indigo-700 text-sm">
                아래 버튼들을 클릭하여 성공/실패 시나리오별 Mock API 동작을 테스트해보세요. 
                이 페이지의 목적은 UI/UX보다는 Mock API의 동작 자체를 검증하는 것입니다.
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => handleRequest('success')}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                <span>성공 데이터 요청</span>
                {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              </button>
              
              <button
                onClick={() => handleRequest('error')}
                disabled={loading}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <XCircle className="w-5 h-5" />
                <span>에러 발생 요청</span>
                {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              </button>
            </div>

            {/* 상태 표시 영역 */}
            <div className="space-y-6">
              {/* 로딩 상태 */}
              {loading && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <div className="text-center">
                      <h3 className="font-bold text-blue-800 text-lg">Mock API 요청 중...</h3>
                      <p className="text-blue-600 text-sm mt-1">
                        네트워크 지연 시뮬레이션 중 (1.5초 대기)
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 bg-blue-100 rounded-lg p-3">
                    <div className="flex items-center text-blue-700 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>setTimeout으로 실제 네트워크 지연을 시뮬레이션하고 있습니다...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 성공 상태 */}
              {data && !loading && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-800 text-lg">✅ API 요청 성공</h3>
                      <p className="text-green-600 text-sm mt-1">Mock API에서 정상적인 응답을 받았습니다.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">응답 메시지:</span>
                        <p className="text-gray-900 font-medium">{data.message}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">응답 시간:</span>
                        <p className="text-gray-900 font-medium">{formatTimestamp(data.timestamp)}</p>
                      </div>
                    </div>
                    
                    {data.data && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-2">응답 데이터:</span>
                        <pre className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 overflow-x-auto">
                          {JSON.stringify(data.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {error && !loading && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start space-x-3 mb-4">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-red-800 text-lg">❌ API 요청 실패</h3>
                      <p className="text-red-600 text-sm mt-1">Mock API에서 에러 응답을 시뮬레이션했습니다.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-600 block mb-2">에러 메시지:</span>
                    <p className="text-red-700 font-medium bg-red-50 p-3 rounded border">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* 초기 상태 */}
              {!loading && !data && !error && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                  <Server className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-600 text-lg mb-2">Mock API 테스트 준비</h3>
                  <p className="text-gray-500 text-sm">
                    위의 버튼을 클릭하여 성공 또는 실패 시나리오를 테스트해보세요.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>Mock API 검증 포인트:</strong> 
                각 버튼 클릭 시 1.5초 지연 후 응답이 오는지 확인하고, 
                성공/실패 시나리오별로 적절한 상태 변화가 일어나는지 검증해보세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}