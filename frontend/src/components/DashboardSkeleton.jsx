// frontend/src/components/DashboardSkeleton.jsx

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div>
        <div className="h-10 bg-gray-200 rounded-xl w-96 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-72"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Recent + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-72">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 h-72">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
          <div className="h-full bg-gray-200 rounded-xl"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
          <div className="h-full bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
        <div className="h-full bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;