import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
      {!isHomePage && (
        <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg w-full">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
          </div>
        </nav>
      )}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}