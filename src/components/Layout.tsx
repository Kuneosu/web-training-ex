import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import notionLogo from '../assets/notion.png';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const getNotionUrl = (pathname: string) => {
    const notionUrls: Record<string, string> = {
      '/infinite-scroll': 'https://kimkwonsu.notion.site/InfiniteScrollPage-2400d6fd244880c0adb7c4a34ae0795b?source=copy_link',
      '/dnd': 'https://kimkwonsu.notion.site/DndPage-2400d6fd244880638b34cfdb939f91a5?source=copy_link',
      '/caching': 'https://kimkwonsu.notion.site/CachingPage-2400d6fd2448804097f7e29046fffd2d?source=copy_link',
      '/page-caching': 'https://kimkwonsu.notion.site/PageCachingPage-2400d6fd2448805d9dc3d6d755219bd7?source=copy_link',
      '/mock-api': 'https://kimkwonsu.notion.site/MockApiPage-2400d6fd2448808e848fe06898253146?source=copy_link'
    };
    return notionUrls[pathname];
  };
  
  const notionUrl = getNotionUrl(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
      {!isHomePage && (
        <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg w-full">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-lg"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <ArrowLeft size={18} />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                홈으로 돌아가기
              </span>
            </Link>
            
            {notionUrl && (
              <a
                href={notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all duration-300 font-medium text-sm px-4 py-2 bg-white/90 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:bg-white"
              >
                <img 
                  src={notionLogo} 
                  alt="Notion" 
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                />
                <span>Notion 문서</span>
              </a>
            )}
          </div>
        </nav>
      )}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}