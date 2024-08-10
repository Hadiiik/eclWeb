
const DashboardSkeleton = () => {
  return (
    <div className="p-4">
      {/* Header Skeleton */}
      <div className="animate-pulse flex space-x-4 mb-4">
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
      </div>

      {/* Table Skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
      </div>

      {/* Pagination Skeleton */}
      <div className="animate-pulse flex justify-between mt-4">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;