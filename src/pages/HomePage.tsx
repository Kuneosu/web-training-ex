import { Link } from 'react-router-dom';
import { Scroll, MousePointer, Database, FileText, Server, Sparkles } from 'lucide-react';

export default function HomePage() {
  const pages = [
    {
      title: 'Infinite Scroll',
      description: '무한 스크롤 구현 예제',
      path: '/infinite-scroll',
      icon: <Scroll size={28} />,
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Drag & Drop',
      description: '드래그 앤 드롭 기능 구현',
      path: '/dnd',
      icon: <MousePointer size={28} />,
      bgColor: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600'
    },
    {
      title: 'Caching & Skeleton',
      description: '캐싱과 스켈레톤 UI 구현',
      path: '/caching-skeleton',
      icon: <Database size={28} />,
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Page Caching',
      description: '페이지 레벨 캐싱 구현',
      path: '/page-caching',
      icon: <FileText size={28} />,
      bgColor: 'bg-violet-500',
      hoverColor: 'hover:bg-violet-600'
    },
    {
      title: 'Mock API',
      description: '비동기 Mock API 시뮬레이션',
      path: '/mock-api',
      icon: <Server size={28} />,
      bgColor: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 px-8 py-12">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4 leading-tight pb-2">
          Web Training Examples
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          현대적인 웹 개발 기술을 학습하고 실습할 수 있는 예제 모음입니다
        </p>
      </div>

      {/* Cards Grid - 반응형 그리드 */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="group block"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 h-48 md:h-56 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 ${page.bgColor} ${page.hoverColor} rounded-xl mb-3 md:mb-4 transition-colors duration-300 shadow-md`}>
                    <div className="text-white">
                      {page.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {page.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {page.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto text-center mt-12 md:mt-16">
        <p className="text-gray-500 text-sm">
          각 예제를 클릭하여 상세한 구현을 확인해보세요
        </p>
      </div>
    </div>
  );
}