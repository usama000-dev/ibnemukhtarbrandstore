// components/LoadingComponent.jsx
"use client"
const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingComponent