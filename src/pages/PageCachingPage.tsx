import { useForm } from '../contexts/FormContext';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, Lightbulb, Code2, Save, ArrowLeft, RotateCcw, Type, Clock, MessageSquare } from 'lucide-react';

export default function PageCachingPage() {
  const { content, setContent, clearContent, getContentLength } = useForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split('\n').length;

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Page Caching System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            페이지 간 이동 시에도 폼 데이터가 유지되는 상태 관리 시스템을 학습해보세요
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
                  글 작성 중 홈 화면으로 이동했다가 다시 뒤로가기 버튼을 눌렀을 때, 작성 중이던 데이터가 모두 초기화되면 사용자 경험이 크게 저하됩니다. 
                  페이지를 이동할 때 이전 상태를 복원할 수 없는 구조라면 사용자 불편이 커집니다.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  개발 필요성
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  페이지 캐싱을 통해 이전 페이지 상태(입력 값, 스크롤 위치 등)를 복원하면 UX가 크게 향상됩니다. 
                  블로그, 게시판, 폼 입력 페이지 등에서 작성 중인 데이터를 잃지 않게 하는 기능은 필수적입니다.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  테스트 포인트
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  뒤로가기 시 작성 중이던 데이터가 정상적으로 복원되는지 확인합니다. 
                  여러 페이지를 이동한 후에도 폼 상태가 유지되는지 테스트하고, 브라우저 새로고침 시 초기화되는 동작을 검증합니다.
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
              <h2 className="text-2xl font-bold text-gray-900">2. 해결 방법: React Context를 이용한 상태 유지</h2>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-yellow-800 mb-4 text-lg">핵심 해결책: React Context API</h3>
              <p className="text-yellow-700 leading-relaxed mb-4">
                React의 Context API를 사용하여 전역 상태를 관리합니다. 
                여러 페이지 컴포넌트의 상위에 `FormProvider`를 위치시켜, 
                컴포넌트가 언마운트(unmount) 되었다가 다시 마운트되어도 Context의 상태는 유지됩니다.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                상태 유지 원리와 구현 방법
              </h3>
              <div className="text-blue-700 leading-relaxed space-y-3">
                <p>
                  Context를 활용한 페이지 캐싱 시스템의 동작 원리:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>전역 상태 관리:</strong> FormProvider가 앱 최상위에서 상태를 관리</li>
                  <li><strong>컴포넌트 라이프사이클:</strong> 페이지 언마운트 시에도 Context 상태는 보존</li>
                  <li><strong>useForm 훅:</strong> 어느 페이지에서든 동일한 상태에 접근 가능</li>
                  <li><strong>페이지 이동 처리:</strong> 뒤로가기로 돌아와도 이전 입력 값 복원</li>
                  <li><strong>제한 사항:</strong> 브라우저 새로고침 시에는 메모리에서 상태가 초기화됨</li>
                </ul>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>⚠️ 중요:</strong> 브라우저 새로고침(F5)이나 탭 닫기 시에는 메모리 상태가 초기화됩니다. 
                    완전한 지속성을 위해서는 localStorage나 sessionStorage를 함께 사용해야 합니다.
                  </p>
                </div>
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
                <button
                  onClick={clearContent}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>초기화</span>
                </button>
              </div>
            </div>

            {/* 테스트 안내 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                페이지 캐싱 테스트 방법
              </h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>1. 아래 텍스트 영역에 내용을 입력해주세요</p>
                <p>2. 상단의 "Home" 링크를 클릭하여 홈페이지로 이동하세요</p>
                <p>3. 브라우저의 뒤로가기 버튼을 눌러 이 페이지로 돌아오세요</p>
                <p>4. 입력했던 내용이 그대로 유지되는지 확인해보세요! ✨</p>
              </div>
            </div>

            {/* 폼 구현 영역 */}
            <div className="space-y-6">
              {/* 상태 정보 표시 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                    <Type className="w-5 h-5 mr-2" />
                    {getContentLength()}
                  </div>
                  <div className="text-sm text-gray-600">문자 수</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {wordCount}
                  </div>
                  <div className="text-sm text-gray-600">단어 수</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {lineCount}
                  </div>
                  <div className="text-sm text-gray-600">줄 수</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {content ? '✅' : '⭕'}
                  </div>
                  <div className="text-sm text-gray-600">상태 유지</div>
                </div>
              </div>

              {/* 텍스트 입력 영역 */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  콘텐츠 작성 (페이지 이동 후에도 내용이 유지됩니다)
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={handleInputChange}
                  placeholder="여기에 내용을 입력하세요. 다른 페이지로 이동한 후 돌아와도 입력한 내용이 유지됩니다!"
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              {/* 네비게이션 테스트 링크들 */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>홈으로 이동</span>
                </Link>
                <Link
                  to="/infinite-scroll"
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>무한 스크롤</span>
                </Link>
                <Link
                  to="/dnd"
                  className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>드래그 앤 드롭</span>
                </Link>
                <Link
                  to="/caching-skeleton"
                  className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>데이터 캐싱</span>
                </Link>
              </div>

              {/* 현재 Context 상태 표시 */}
              {content && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Context에 저장된 내용 미리보기
                  </h4>
                  <div className="text-green-700 text-sm bg-white p-3 rounded border max-h-32 overflow-y-auto">
                    {content.length > 100 ? content.substring(0, 100) + '...' : content}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                💡 <strong>페이지 캐싱 팁:</strong> 위의 링크들을 클릭해서 다른 페이지로 이동한 후, 
                브라우저의 뒤로가기 버튼으로 돌아와보세요. 입력한 내용이 그대로 유지됩니다!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}