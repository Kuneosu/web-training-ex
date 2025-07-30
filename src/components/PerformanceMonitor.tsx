import { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, TrendingUp } from 'lucide-react';

interface PerformanceStats {
  fps: number;
  memory: {
    used: number;
    total: number;
    percent: number;
  } | null;
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: null
  });
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      // 1초마다 FPS 계산
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        
        // 메모리 정보 가져오기 (Chrome에서만 작동)
        let memoryInfo = null;
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          memoryInfo = {
            used: Math.round(memory.usedJSHeapSize / 1048576), // MB 단위
            total: Math.round(memory.jsHeapSizeLimit / 1048576),
            percent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
          };
        }
        
        setStats({
          fps,
          memory: memoryInfo
        });
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId.current = requestAnimationFrame(measureFPS);
    };
    
    animationId.current = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // FPS에 따른 색상 결정
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600 bg-green-50';
    if (fps >= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // 메모리 사용량에 따른 색상 결정
  const getMemoryColor = (percent: number) => {
    if (percent <= 50) return 'text-green-600 bg-green-50';
    if (percent <= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-3 z-50">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Performance Monitor
      </div>
      
      {/* FPS 모니터 */}
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${getFPSColor(stats.fps).split(' ')[1]}`}>
          <Activity className={`w-4 h-4 ${getFPSColor(stats.fps).split(' ')[0]}`} />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500">FPS</div>
          <div className={`text-lg font-bold ${getFPSColor(stats.fps).split(' ')[0]}`}>
            {stats.fps}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {stats.fps >= 55 ? 'Smooth' : stats.fps >= 30 ? 'OK' : 'Laggy'}
        </div>
      </div>
      
      {/* 메모리 모니터 */}
      {stats.memory ? (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getMemoryColor(stats.memory.percent).split(' ')[1]}`}>
            <Cpu className={`w-4 h-4 ${getMemoryColor(stats.memory.percent).split(' ')[0]}`} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">Memory</div>
            <div className={`text-lg font-bold ${getMemoryColor(stats.memory.percent).split(' ')[0]}`}>
              {stats.memory.used}MB
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {stats.memory.percent}%
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3 opacity-50">
          <div className="p-2 rounded-lg bg-gray-50">
            <Cpu className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">Memory</div>
            <div className="text-sm text-gray-400">Not available</div>
          </div>
        </div>
      )}
      
      {/* 성능 바 */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>FPS Performance</span>
            <span>{Math.round((stats.fps / 60) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stats.fps >= 55 ? 'bg-green-500' : 
                stats.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((stats.fps / 60) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {stats.memory && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Memory Usage</span>
              <span>{stats.memory.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  stats.memory.percent <= 50 ? 'bg-green-500' : 
                  stats.memory.percent <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.memory.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400 text-center pt-2">
        <TrendingUp className="w-3 h-3 inline mr-1" />
        Real-time monitoring
      </div>
    </div>
  );
}