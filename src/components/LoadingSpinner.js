const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  return <div className={`loading-spinner ${sizeClasses[size]} ${className}`}></div>
}

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="skeleton h-64 w-full"></div>
      <div className="p-4">
        <div className="skeleton h-4 w-3/4 mb-2"></div>
        <div className="skeleton h-3 w-1/2 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-8 w-8 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
