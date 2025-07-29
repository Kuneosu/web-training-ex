// SkeletonCard component with Tailwind CSS animate-pulse

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        {/* Title skeleton */}
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        
        {/* Status badge skeleton */}
        <div className="ml-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Metadata skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Category skeleton */}
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          
          {/* Date skeleton */}
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Views skeleton */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-3 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

// 여러 개의 스켈레톤 카드를 표시하는 컴포넌트
export function SkeletonCardList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

// 리스트 형태의 스켈레톤 UI
export function SkeletonListItem() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center space-x-4">
        {/* Number skeleton */}
        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
        
        {/* Content skeleton */}
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Status skeleton */}
        <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

// 테이블 형태의 스켈레톤 UI
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gray-50 p-4">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="grid grid-cols-5 gap-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}